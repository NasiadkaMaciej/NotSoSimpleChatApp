import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true }
		// ToDo: Add friends, family, work colleagues lists
		// ToDo: Add profile picture
		// ToDo: Add online status
		// ToDo: Add last seen
		// ToDo: Add about
		// ToDo: Add UI settings
		// ToDo: Email Verification?
		// ToDo: Notifications preferences
	},
	// Add createdAt and updatedAt fields
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;