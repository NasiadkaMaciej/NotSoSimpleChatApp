import express from "express";
import { checkAuth, signup, login, logout, updateProfile, verifyEmail, updateCredentials } from "../controllers/authController.js";
import { authenticateUser, deactivateAccount } from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup, login, logout, and check if the user is authenticated
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", authenticateUser, checkAuth);
router.put("/profile", authenticateUser, updateProfile); // Ensure this line is present
router.get('/verify-email', verifyEmail);
router.delete('/deactivate', authenticateUser, deactivateAccount);
router.put("/credentials", authenticateUser, updateCredentials);

export default router;