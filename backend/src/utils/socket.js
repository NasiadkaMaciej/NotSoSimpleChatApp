import { Server } from "socket.io";
import express from "express";
import http from "http";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

const socketApp = express();
const socketServer = http.createServer(socketApp);

dotenv.config();
const apiPort = process.env.API_PORT || 3005;

const io = new Server(socketServer, {
	cors: {
		origin: 'https://front.nasiadka.pl',
		credentials: true,
	},
	path: '/socket.io/',
	transports: ['websocket', 'polling'],
	upgrade: false,
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000
});

// userID -> socketID
const userSocketMap = {};

io.on("connection", async (socket) => {
	const userId = socket.handshake.query.userId;
	if (userId) {
		userSocketMap[userId] = socket.id;
		await User.findByIdAndUpdate(userId, {
			isOnline: true,
			lastSeen: new Date()
		});
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	}

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", async () => {
		if (userId) {
			delete userSocketMap[userId];
			// Update user status to offline and last seen
			await User.findByIdAndUpdate(userId, {
				isOnline: false,
				lastSeen: new Date()
			});
			io.emit("getOnlineUsers", Object.keys(userSocketMap));
		}
	});

	socket.on("messageRead", async (data) => {
		const { senderId, receiverId } = data;

		// Update messages in database
		await Message.updateMany(
			{
				senderId,
				receiverId,
				isRead: false
			},
			{ isRead: true }
		);

		// Notify sender
		const senderSocketId = getReceiverSocketId(senderId);
		if (senderSocketId)
			io.to(senderSocketId).emit("messageStatusUpdate", {
				senderId,
				receiverId,
				isRead: true
			});
	});

	socket.on("userStatus", async ({ userId, isOnline }) => {
		if (userId) {
			if (isOnline) userSocketMap[userId] = socket.id;
			await User.findByIdAndUpdate(userId, {
				isOnline,
				...(isOnline ? {} : { lastSeen: new Date() })
			});
			io.emit("getOnlineUsers", Object.keys(userSocketMap));
		}
	});
	socket.on("newMessage", (message) => {
		const receiverSocketId = getReceiverSocketId(message.receiverId);
		if (receiverSocketId)
			io.to(receiverSocketId).emit("newMessage", message);
	});
	socket.on("messageEdited", async ({ messageId, text, senderId, receiverId }) => {
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId)
		  io.to(receiverSocketId).emit("messageEdited", {
			messageId,
			text,
			isEdited: true
		  });
	  });
	  
	  socket.on("messageDeleted", async ({ messageId, senderId, receiverId }) => {
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId)
		  io.to(receiverSocketId).emit("messageDeleted", { messageId });
	  });
});

export function getReceiverSocketId(userId) {
	return userSocketMap[userId];
}

export { io, socketServer };