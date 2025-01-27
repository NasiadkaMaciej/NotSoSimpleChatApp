import express from "express";
import { checkAuth, signup, login, logout, updateProfile, verifyEmail, updateCredentials } from "../controllers/authController.js";
import { authenticateUser, deactivateAccount } from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup, login, logout, and check if the user is authenticated
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// Check if the user is authenticated
router.get("/check", authenticateUser, checkAuth);
// Update user profile
router.put("/profile", authenticateUser, updateProfile);
// Verify email
router.get('/verify-email', verifyEmail);
// Deactivate account
router.delete('/deactivate', authenticateUser, deactivateAccount);
// Update user credentials
router.put("/credentials", authenticateUser, updateCredentials);

export default router;