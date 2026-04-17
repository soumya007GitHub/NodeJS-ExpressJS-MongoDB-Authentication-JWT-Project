import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const validateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401);
        throw new Error("Token is not provided");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401);
        throw new Error("Token is not provided");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
        res.status(401);
        throw new Error("Invalid or expired token");
    }

    req.user = decoded.user;

    if (!req.user?.id) {
        res.status(401);
        throw new Error("Invalid token payload");
    }

    const existingUser = await User.findById(req.user.id);
    if (!existingUser) {
        res.status(403);
        throw new Error(
            "This account no longer exists. You cannot use this token."
        );
    }

    next();
});

export default validateToken;
