import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sendError } from "../utils/errors.js";


// Protect routes by checking if the user is authenticated
export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

        const jwtSecretKey = process.env.JWT_SECRET;
        if (!jwtSecretKey) throw new Error('JWT_SECRET is not defined in environment variables');

        const decodedToken = jwt.verify(token, jwtSecretKey);
        if (!decodedToken) return res.status(401).json({ message: "Unauthorized - Invalid token" });

        const user = await User.findById(decodedToken.userId).select("-password");
        if (!user) return res.status(404).json({ message: 'User not found' });

		// Add the user to the request object and continue
        req.user = user;
        next();
    } catch (error) {
		sendError(res, error, "authenticateUser");
    }
};