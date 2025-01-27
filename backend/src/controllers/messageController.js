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

getMessages: async (userId) => {
	set({ isMessagesLoading: true });
	try {
		const res = await axiosInstance.get(`/message/${userId}`);
		// Update messages only if they actually changed
		set((state) => {
			const newMessages = res.data;
			if (JSON.stringify(state.messages) !== JSON.stringify(newMessages))
				return { messages: newMessages };
			return {};
		});
	} catch (error) {
		displayError(error);
		set({ messages: [] });
	} finally {
		set({ isMessagesLoading: false });
	}
};

appendMessage: (message) => {
	set((state) => ({
		messages: [...state.messages, message]
	}));
};

export const sendMessage = async (req, res) => {
	try {
		const { text } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		const newMessage = new Message({
			senderId,
			receiverId,
			text
		});

		await newMessage.save();

		// Emit the message to the receiver
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", {
				senderId,
				receiverId,
				text
			});
		}

		res.status(201).json(newMessage);
	} catch (error) {
		sendError(res, error, "sendMessage");
	}
};