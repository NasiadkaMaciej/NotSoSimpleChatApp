import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getMessages, getUsers, sendMessage, editMessage, deleteMessage } from "../controllers/messageController.js";

const router = express.Router();

// Get users for the sidebar
router.get("/users", authenticateUser, getUsers);
// Get messages between the logged in user and another user
router.get("/:id", authenticateUser, getMessages);
// Send a message to another user
router.post("/send/:id", authenticateUser, sendMessage);
// Edit a message
router.put("/:id", authenticateUser, editMessage);
// Delete a message
router.delete("/:id", authenticateUser, deleteMessage);
export default router;
