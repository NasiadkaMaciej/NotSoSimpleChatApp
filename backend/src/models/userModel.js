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
			default: "",
			maxLength: [256, 'About Me section cannot exceed 256 characters']
		},
		isOnline: {
			type: Boolean,
			default: false
		},
		lastSeen: {
			type: Date,
			default: Date.now
		},
		groups: {
			friends: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}],
			work: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}],
			family: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}]
		},
		blockedUsers: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}],
		notificationSettings: {
			enableNotifications: {
				type: Boolean,
				default: true
			},
			enableSound: {
				type: Boolean,
				default: false
			},
			mutedUsers: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: []
			}]
		},
		verified: {
			type: Boolean,
			default: false
		},
		verificationToken: {
			type: String,
			default: null
		}
	},
	// ToDo: Add profile picture
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;