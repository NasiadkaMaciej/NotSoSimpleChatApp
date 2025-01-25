import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/mongodb.js";
import authRoutes from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import { socketServer } from "./utils/socket.js";

dotenv.config();
connectDB();

const app = express();
const apiPort = process.env.API_PORT || 3005;
const socketPort = process.env.SOCKET_PORT || 3006;

app.use(express.json());
app.use(cors({
	// ToDo: Is localhost needed?
	origin: [`http://127.0.0.1:${apiPort}`, 'https://front.nasiadka.pl'],
	credentials: true,
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(apiPort, () => {
	console.log(`API server running on http://localhost:${apiPort}`);
});

socketServer.listen(socketPort, () => {
	console.log(`WebSocket server running on http://localhost:${socketPort}`);
});