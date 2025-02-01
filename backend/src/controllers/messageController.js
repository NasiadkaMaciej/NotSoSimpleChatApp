import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { sendError } from "../utils/errors.js";
import { io, getReceiverSocketId } from "../utils/socket.js";

export const getUsers = async (req, res) => {
	try {
		const currentUser = await User.findById(req.user._id);
		const users = await User.find({ _id: { $ne: req.user._id } })
			.select("-password -verified -verificationToken");

		const usersWithGroups = users.map(user => ({
			...user.toObject(),
			isFriend: currentUser.groups.friends.includes(user._id),
			isWork: currentUser.groups.work.includes(user._id),
			isFamily: currentUser.groups.family.includes(user._id),
			isBlocked: currentUser.blockedUsers.includes(user._id)
		}));
		res.set({
			'Cache-Control': 'no-cache, no-store, must-revalidate',
			'Pragma': 'no-cache',
			'Expires': '0'
		});
		res.status(200).json(usersWithGroups);
	} catch (error) {
		sendError(res, error, "getUsers");
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		const sender = await User.findById(senderId);
		const receiver = await User.findById(receiverId);

		if (sender.blockedUsers.includes(receiverId) || receiver.blockedUsers.includes(senderId))
			return res.status(403).json({ error: "Unable to access messages" });

		// Mark messages as read and notify sender
		await Message.updateMany(
			{
				senderId: receiverId,
				receiverId: senderId,
				status: { $ne: 'read' }
			},
			{ status: 'read' }
		);

		// Emit read status update via socket
		const senderSocketId = getReceiverSocketId(receiverId);
		if (senderSocketId) {
			io.to(senderSocketId).emit("messageStatusUpdate", {
				senderId: receiverId,
				receiverId: senderId,
				status: 'read'
			});
		}

		// Get messages after updating status
		const messages = await Message.find({
			$or: [
				{ senderId, receiverId },
				{ senderId: receiverId, receiverId: senderId }
			]
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		sendError(res, error, "getMessages");
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		const newMessage = new Message({
			senderId,
			receiverId,
			type: image ? 'image' : 'text',
			...(image ? { image } : { text }),
			status: 'sent'
		});

		await newMessage.save();

		// Emit to receiver socket
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
			newMessage.status = 'delivered';
			await newMessage.save();

			// Notify sender about delivery
			io.to(getReceiverSocketId(senderId)).emit("messageStatusUpdate", {
				senderId,
				receiverId,
				status: 'delivered'
			});
		}

		res.status(201).json(newMessage);
	} catch (error) {
		sendError(res, error, "sendMessage");
	}
};