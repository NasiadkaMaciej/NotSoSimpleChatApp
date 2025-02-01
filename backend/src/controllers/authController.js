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
	const { avatarColor, aboutMe, notificationSettings } = req.body;

	try {
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ error: "User not found" });

		if (aboutMe && aboutMe.length > 256)
			return res.status(400).json({ error: "About Me section cannot exceed 256 characters" });

		if (avatarColor) user.avatarColor = avatarColor;
		if (aboutMe !== undefined) user.aboutMe = aboutMe;
		if (notificationSettings) {
			user.notificationSettings = {
				...notificationSettings,
				mutedUsers: notificationSettings.mutedUsers || user.notificationSettings.mutedUsers
			};
		}

		await user.save();

		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			avatarColor: user.avatarColor,
			aboutMe: user.aboutMe,
			notificationSettings: user.notificationSettings
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

const handleGroupMembership = async (userId, targetUserId, group, action) => {
	try {
		const user = await User.findById(userId);
		if (!user) throw new Error("User not found");

		const targetUser = await User.findById(targetUserId);
		if (!targetUser) throw new Error("Target user not found");

		if (!user.groups[group]) user.groups[group] = [];

		if (action === 'add')
			user.groups[group].push(targetUserId);
		else {
			user.groups[group] = user.groups[group].filter(id =>
				id.toString() !== targetUserId.toString()
			);
		}

		await user.save();
		return user;
	} catch (error) {
		throw error;
	}
};

export const updateGroupMembership = async (req, res) => {
	const { id: targetUserId } = req.params;
	const { group, action } = req.body;
	const userId = req.user._id;

	try {
		const validGroups = ['friends', 'work', 'family'];
		if (!validGroups.includes(group))
			return res.status(400).json({ error: "Invalid group" });

		const user = await handleGroupMembership(userId, targetUserId, group, action);

		res.status(200).json({
			message: `User ${action === 'add' ? 'added to' : 'removed from'} ${group} group`,
			groups: user.groups
		});
	} catch (error) {
		sendError(res, error, `group-${action}`);
	}
};

export const toggleBlockUser = async (req, res) => {
	const { id: targetUserId } = req.params;
	const userId = req.user._id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const isBlocked = user.blockedUsers.includes(targetUserId);

		if (isBlocked)
			user.blockedUsers = user.blockedUsers.filter(id =>
				id.toString() !== targetUserId.toString()
			);
		else user.blockedUsers.push(targetUserId);

		await user.save();

		res.status(200).json({
			message: `User ${isBlocked ? 'unblocked' : 'blocked'} successfully`,
			blockedUsers: user.blockedUsers
		});
	} catch (error) {
		sendError(res, error, "toggleBlockUser");
	}
};

export const toggleUserMute = async (req, res) => {
	const { id: targetUserId } = req.params;
	const userId = req.user._id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const isMuted = user.notificationSettings.mutedUsers.includes(targetUserId);

		if (isMuted)
			user.mutedUsers = user.mutedUsers.filter(id =>
				id.toString() !== targetUserId.toString()
			);
		else user.mutedUsers.push(targetUserId);

		await user.save();

		res.status(200).json({
			message: `User ${isMuted ? 'unmuted' : 'muted'} successfully`,
			mutedUsers: user.mutedUsers
		});
	} catch (error) {
		sendError(res, error, "toggleUserMute");
	}
};


// ToDo: Function to check identity?