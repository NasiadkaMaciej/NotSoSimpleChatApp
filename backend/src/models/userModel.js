import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
			minLength: 3
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		password: {
			type: String,
			required: true,
			minLength: 12
		},
		avatarColor: {
			type: String,
			default: "#ffffff",
			validate: {
				validator: (v) => /^#[0-9A-Fa-f]{6}$/.test(v),
				message: 'Invalid hex color'
			}
		},
		aboutMe: {
			type: String,
			default: ""
		},
		isOnline: {
			type: Boolean,
			default: false
		},
		lastSeen: {
			type: Date,
			default: Date.now
		},
		friends: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}],
		verified: {
			type: Boolean,
			default: false
		},
		verificationToken: {
			type: String,
			default: null
		}
	},
	// ToDo: Add friends, family, work colleagues lists
	// ToDo: Add profile picture
	// ToDo: Add online status
	// ToDo: Add last seen - maybe from timestamp?
	// ToDo: Email Verification?
	// ToDo: Notifications preferences
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;