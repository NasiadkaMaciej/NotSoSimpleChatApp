import { Server } from "socket.io";
import express from "express";
import http from "http";
import dotenv from "dotenv";

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

io.on("connection", (socket) => {
	console.log("User connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId) userSocketMap[userId] = socket.id;

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log("User disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export function getReceiverSocketId(userId) {
	return userSocketMap[userId];
}

export { io, socketServer };