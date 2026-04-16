import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("email or password is missing for login.");
    }
    const user = User.findOne({email});
    if(user == null){
        res.status(400);
        throw new Error("Account not found, please fill correct credentials or register first");
    }
    if(await bcrypt.compare(password, user.password)){
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            }
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1m"
        })
       res.status(200).json({accessToken});
    }
    else{
        res.status(401);
        throw new Error("Username or password is incorrect");
    }
    res.json("Login succesful");
});

const currentUser = asyncHandler (async (req, res)=>{
    res.send("Current user");
});

export default {registerUser, loginUser, currentUser};