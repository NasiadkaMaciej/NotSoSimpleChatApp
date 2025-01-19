import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.js";
import { validateSignUpData } from "../utils/validate.js";
import { sendError } from "../utils/errors.js";

export const signup = async (req, res) => {
	const { fullName, email, password } = req.body;
	const validationFailed = validateSignUpData(fullName, email, password);
	if (validationFailed) return res.status(400).json({ error: validationFailed });

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) return res.status(400).json({ error: "Email already exists" });

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({ fullName, email, password: hashedPassword });
		await newUser.save();

		generateToken(newUser._id, res);

		res.status(201).json({
			_id: newUser._id,
			fullName: newUser.fullName,
			email: newUser.email
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

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid password" });

		generateToken(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			email: user.email
		});
	} catch (error) {
		sendError(res, error, "login");
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
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