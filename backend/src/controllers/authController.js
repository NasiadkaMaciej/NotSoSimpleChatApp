import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.js";
import { validateSignUpData, isPasswordValid } from "../utils/validate.js";
import { sendError } from "../utils/errors.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email.js";

export const signup = async (req, res) => {
	const { username, email, password } = req.body;

	const validationFailed = validateSignUpData(username, email, password);
	if (validationFailed) return res.status(400).json({ error: validationFailed });

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) return res.status(400).json({ error: "Email already exists" });

		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = crypto.randomBytes(32).toString('hex');

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			verificationToken,
			verified: false
		});

		await newUser.save();
		await sendVerificationEmail(email, verificationToken);

		res.status(201).json({
			message: "Account created. Please verify your email."
		});
	} catch (error) {
		sendError(res, error, "signup");
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		return res.status(400).json({ error: "Email and password are required" });

	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ error: "Account not found" });
		if (!user.verified) return res.status(400).json({ error: 'Please verify your email first' });

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid password" });

		generateToken(user._id, res);

		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			avatarColor: user.avatarColor
		});
	} catch (error) {
		sendError(res, error, "login");
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", {
			maxAge: 0,
			secure: true,
			sameSite: 'strict',
			path: '/'
		});
		res.status(200).json({ message: "Logged out" });
	} catch (error) {
		sendError(res, error, "logout");
	}
};

// Check if the user is authenticated
export const checkAuth = (req, res) => {
	try {
		res.status(200).json(req.user);
	} catch (error) {
		sendError(res, error, "checkAuth");
	}
};

export const updateProfile = async (req, res) => {
	const { avatarColor, aboutMe } = req.body;

	try {
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ error: "User not found" });

		user.avatarColor = avatarColor || user.avatarColor;
		user.aboutMe = aboutMe || user.aboutMe;
		await user.save();

		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			avatarColor: user.avatarColor,
			aboutMe: user.aboutMe
		});
	} catch (error) {
		sendError(res, error, "updateProfile");
	}
};

export const verifyEmail = async (req, res) => {
	const { token } = req.query;

	try {
		const user = await User.findOne({ verificationToken: token });
		if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

		user.verified = true;
		user.verificationToken = null;
		await user.save();

		res.status(200).json({ message: 'Email verified successfully' });
	} catch (error) {
		sendError(res, error, 'verifyEmail');
	}
};

export const updateCredentials = async (req, res) => {
	const { newUsername, currentPassword, newPassword } = req.body;

	// ToDo: Make error handling and validation a util and use it on:
	// Frontend - ProfilePage.jsx
	// Frontend - SignupPage.jsx
	// Backend - authController.js (here)

	try {
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ error: "User not found" });

		// Validate current password
		if (currentPassword) {
			const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
			if (!isPasswordCorrect) return res.status(400).json({ error: "Current password is incorrect" });
		}

		// Update username if provided
		if (newUsername) {
			if (newUsername.length < 3) return res.status(400).json({ error: "Username must be at least 3 characters long" });
			user.username = newUsername;
		}

		// Update password if provided
		if (newPassword) {
			if (newPassword.length < 12) return res.status(400).json({ error: "Password must be at least 12 characters long" });
			if (!isPasswordValid(newPassword)) return res.status(400).json({ error: "Password must contain at least one letter, one number, and one special character" });
			user.password = await bcrypt.hash(newPassword, 10);
		}

		await user.save();

		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			avatarColor: user.avatarColor,
			aboutMe: user.aboutMe
		});
	} catch (error) {
		sendError(res, error, "updateCredentials");
	}
};

export const addFriend = async (req, res) => {
	try {
		const { id: friendId } = req.params;
		const userId = req.user._id;

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		if (user.friends.includes(friendId))
			return res.status(400).json({ error: "Already in friends list" });

		user.friends.push(friendId);
		await user.save();

		res.status(200).json({ message: "Friend added successfully" });
	} catch (error) {
		sendError(res, error, "addFriend");
	}
};

export const removeFriend = async (req, res) => {
	try {
		const { id: friendId } = req.params;
		const userId = req.user._id;

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		user.friends = user.friends.filter(id => id.toString() !== friendId);
		await user.save();

		res.status(200).json({ message: "Friend removed successfully" });
	} catch (error) {
		sendError(res, error, "removeFriend");
	}
};