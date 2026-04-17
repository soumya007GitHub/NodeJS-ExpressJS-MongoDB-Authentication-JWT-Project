import asyncHandler from "express-async-handler";
import Contact from "../models/Contact.js";

const allContacts = asyncHandler(async (req, res)=>{
    const allContactsData = await Contact.find({userId: req.user.id});
    res.status(200).json(allContactsData);
})

const showContact = asyncHandler(async (req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(contact === null){
        res.status(404);
        throw new Error("Contacts not found.");
    }
    res.status(200).json(contact);
})

const addContact = asyncHandler(async (req, res)=>{
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory");
    }else{
    const ifExists = await Contact.findOne({
        $or: [{name}, {email}, {phone}]
    })
    if(ifExists){
        res.status(401);
        throw new Error("Contact already exists with following name or phone or email");
    }
    const newContact = new Contact({
        userId: req.user.id,
        name,
        email,
        phone
    });
    await newContact.save();
    }
    res.status(200).json("New contact added successfully");
})

const updateContact = asyncHandler(async (req, res)=>{
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body);
    if(contact === null || contact.userId.toString() !== req.user.id){
        res.status(404);
        throw new Error("Contact not found or you dont have access to update this contact.");
    }
    res.status(200).json("Contact updated succesfully!");
})

const deleteContact = asyncHandler(async (req, res)=>{
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if(contact === null || contact.userId.toString() !== req.user.id){
        res.status(404);
        throw new Error("Contact not found or you dont have access to delete this contact.");
    }
    res.status(200).json("Contact deleted succesfully!");
})
export default {allContacts, showContact, addContact, updateContact, deleteContact};