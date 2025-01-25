import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getMessages, getUsers, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

// Get users for the sidebar
router.get("/users", authenticateUser, getUsers);
// Get messages between the logged in user and another user
router.get("/:id", authenticateUser, getMessages);
// Send a message to another user
router.post("/send/:id", authenticateUser, sendMessage);

export default router;
