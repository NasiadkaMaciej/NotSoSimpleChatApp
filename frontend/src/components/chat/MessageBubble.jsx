import { useState } from "react";
import { Check, CheckCheck, MoreVertical, Edit, Trash, X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { toast } from "react-hot-toast";
import TextMessage from "./message/TextMessage";
import ImageMessage from "./message/ImageMessage";

const MessageBubble = ({ message, isOwnMessage, searchTerm, isHighlighted }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedText, setEditedText] = useState(message.text);
	const [showMenu, setShowMenu] = useState(false);
	const { editMessage, deleteMessage } = useChatStore();

	const canEditOrDelete = isOwnMessage && message.type === "text";
	const messageAge = Date.now() - new Date(message.createdAt).getTime();
	const canEdit = canEditOrDelete && messageAge < 15 * 60 * 1000; // 15 minutes
	const canDelete = canEditOrDelete && messageAge < 60 * 60 * 1000; // 1 hour

	const renderStatus = () => {
		if (!isOwnMessage) return null;
		return message.isRead ? (
			<CheckCheck size={14} className="text-success" />
		) : (
			<Check size={14} className="text-base-content/60" />
		);
	};

	const handleEdit = async () => {
		if (!editedText.trim()) {
			toast.error("Message cannot be empty");
			return;
		}

		try {
			await editMessage(message._id, editedText);
			setIsEditing(false);
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to edit message");
		}
	};

	const handleDelete = async () => {
		try {
			await deleteMessage(message._id);
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to delete message");
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") handleEdit();
		else if (e.key === "Escape") setIsEditing(false);
	};

	return (
		<div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"} group`}>
			<div
				className={`chat-bubble break-all relative ${isOwnMessage ? "chat-bubble-primary" : "chat-bubble-base-200"
					}`}
			>
				{isEditing ? (
					<div className="flex gap-2 items-center min-w-[200px]">
						<input
							type="text"
							value={editedText}
							onChange={(e) => setEditedText(e.target.value)}
							onKeyDown={handleKeyDown}
							className="w-full px-2 py-1 rounded-md bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base-content text-sm"
							autoFocus
						/>
						<button onClick={handleEdit} className="btn btn-ghost btn-sm btn-circle hover:bg-success/10">
							<Check className="size-4 text-success" />
						</button>
						<button
							onClick={() => setIsEditing(false)}
							className="btn btn-ghost btn-sm btn-circle hover:bg-error/10"
						>
							<X className="size-4 text-error" />
						</button>
					</div>
				) : (
					<>
						{message.type === "image" ? (
							<ImageMessage imageSrc={message.image} />
						) : (
							<TextMessage
								text={message.text}
								isEdited={message.isEdited}
								searchTerm={searchTerm}
								isHighlighted={isHighlighted}
							/>
						)}

						{(canEdit || canDelete) && (
							<div className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
								<div className="relative">
									<button
										onClick={() => setShowMenu(!showMenu)}
										className="btn btn-ghost btn-xs btn-circle hover:bg-base-300"
									>
										<MoreVertical className="size-4 text-base-content/60" />
									</button>
									{showMenu && (
										<div className="absolute right-0 mt-1 bg-base-100 rounded-lg shadow-xl p-1.5 z-10 border border-base-300 min-w-[100px]">
											{canEdit && (
												<button
													onClick={() => {
														setIsEditing(true);
														setShowMenu(false);
													}}
													className="btn btn-ghost btn-xs gap-2 w-full justify-start hover:bg-base-200"
												>
													<Edit className="size-4 text-base-content/60" />
													<span className="text-base-content/60">Edit</span>
												</button>
											)}
											{canDelete && (
												<button
													onClick={handleDelete}
													className="btn btn-ghost btn-xs gap-2 w-full justify-start hover:bg-error/10"
												>
													<Trash className="size-4 text-error" />
													<span className="text-error">Delete</span>
												</button>
											)}
										</div>
									)}
								</div>
							</div>
						)}
					</>
				)}
			</div>
			{renderStatus()}
		</div>
	);
};

export default MessageBubble;
