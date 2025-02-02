import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: ['text', 'image'],
			default: 'text'
		},
		text: {
			type: String,
			required: function () { return this.type === 'text'; },
			trim: true
		},
		image: {
			type: String,
			required: function () { return this.type === 'image'; }
		},
		isRead: {
			type: Boolean,
			default: false
		},
		isEdited: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
