import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateToken.js";

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/current", validateToken, userController.currentUser);

export default router;
