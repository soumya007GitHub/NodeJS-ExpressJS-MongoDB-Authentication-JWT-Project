import asyncHandler from "express-async-handler";
import Contact from "../models/Contact.js";

const allContacts = asyncHandler(async (req, res)=>{
    const allContactsData = await Contact.find();
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
    const newContact = new Contact({
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
    if(contact === null){
        res.status(404);
        throw new Error("Contact not found.");
    }
    res.status(200).json("Contact updated succesfully!");
})

const deleteContact = asyncHandler(async (req, res)=>{
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if(contact === null){
        res.status(404);
        throw new Error("Contact not found.");
    }
    res.status(200).json("Contact deleted succesfully!");
})
export default {allContacts, showContact, addContact, updateContact, deleteContact};