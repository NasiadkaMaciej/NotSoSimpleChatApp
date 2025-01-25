import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

import { getReceiverSocketId, io } from "../utils/socket.js";
import { sendError } from "../utils/errors.js";

export const getUsers = async (req, res) => {
	// ToDo: Add friends, family, work colleagues lists
	try {
		// Do not display logged in user
		const filteredUsers = await User.find({ _id: { $ne: req.user._id } }).select("-password");
		// Prevent caching list of users, so that new users are displayed
		res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
		res.status(200).json(filteredUsers);
	} catch (error) {
		sendError(res, error, "getUsers");
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: receiver } = req.params;
		const sender = req.user._id;

		// Get messages between sender and receiver
		const messages = await Message.find({
			$or: [{ senderId: sender, receiverId: receiver },
			{ senderId: receiver, receiverId: sender }]
		});

		res.status(200).json(messages);
	} catch (error) {
		sendError(res, error, "getMessages");
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { text } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		const newMessage = new Message({ senderId, receiverId, text });
		// Save the message to the database
		await newMessage.save();

		// Emit the new message to the receiver
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId)
			io.to(receiverSocketId).emit("newMessage", newMessage);

		res.status(201).json(newMessage);
	} catch (error) {
		sendError(res, error, "sendMessage");
	}
};
