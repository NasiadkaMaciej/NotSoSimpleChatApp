import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { Loader } from "lucide-react";

const MessageBubble = ({ message, isOwnMessage }) => (
	<div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
		<div className={`chat-bubble ${isOwnMessage ? "chat-bubble-primary" : ""}`}>
			{message.text}
		</div>
	</div>
);

const ChatContainer = () => {
	const { messages, isMessagesLoading, selectedUser } = useChatStore();
	const { authUser } = useAuthStore();
	
	// Reference for auto-scrolling to latest message
	const messagesEndRef = useRef(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (isMessagesLoading) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<Loader className="size-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col">
			<ChatHeader />
			{ /* ToDo: User avatar here */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((message) => (
					<MessageBubble
						key={message._id}
						message={message}
						isOwnMessage={message.senderId === authUser._id}
					/>
				))}
				<div ref={messagesEndRef} />
			</div>
			<MessageInput />
		</div>
	);
};

export default ChatContainer;