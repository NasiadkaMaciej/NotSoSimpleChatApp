import { Server } from "socket.io";
import express from "express";
import http from "http";
import dotenv from "dotenv";
import User from "../models/userModel.js";

const socketApp = express();
const socketServer = http.createServer(socketApp);

dotenv.config();
const apiPort = process.env.API_PORT || 3005;

const io = new Server(socketServer, {
	cors: {
		// ToDo: Is localhost needed?
		origin: [`http://127.0.0.1:${apiPort}`, 'https://front.nasiadka.pl'],
		credentials: true,
	},
	path: '/socket.io/',
	// ToDo: Is this needed?
	transports: ['websocket', 'polling']
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
});

export function getReceiverSocketId(userId) {
	return userSocketMap[userId];
}

export { io, socketServer };