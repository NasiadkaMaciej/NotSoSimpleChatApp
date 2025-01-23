import express from "express";
import { checkAuth, signup, login, logout, updateProfile } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup, login, logout, and check if the user is authenticated
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", authenticateUser, checkAuth);
router.put("/profile", authenticateUser, updateProfile); // Ensure this line is present

export default router;