import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoute.js";
import { connectDB } from "./utils/mongodb.js";
import dotenv from 'dotenv';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);


app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});