import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/current", userController.currentUser);

export default router;
