import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const registerUser = asyncHandler (async (req, res)=>{
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are required for registration.");
    }
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        res.status(400);
        throw new Error("User already exists with same email or username.");
    }
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPwd
    });
    await newUser.save();
    res.status(201).json("Registered succesfully");
});

const loginUser = asyncHandler (async (req, res)=>{
    const {username, password} = req.body;
    if(!username || !password){
        res.status(400);
        res.json("Username or password is missing for login.");
    }
    const user = User.findOne({username});
    if(user == null){
        res.status(40);
        res.json("Account not found, please fill correct credentials or register first");
    }
    const hashedPwd = JSON.parse(user).password;
    if(bcrypt.compareSync(password, hashedPwd)){
       res.json("Login succesfully");
    }
    else{
        res.json("Username or password is incorrect");
    }
});

const currentUser = asyncHandler (async (req, res)=>{
    res.send("Current user");
});

export default {registerUser, loginUser, currentUser};