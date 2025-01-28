import { useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import UserProfile from "./UserProfile";
import SearchBar from "./SearchBar";
import MessageBubble from "./MessageBubble";

const ChatContainer = () => {
	const { messages, isMessagesLoading, isProfileOpen } = useChatStore();
	const { authUser } = useAuthStore();
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentMatch, setCurrentMatch] = useState(0);
	const [matchedMessages, setMatchedMessages] = useState([]);
	const messagesEndRef = useRef(null);

	// Update matches when search term changes
	useEffect(() => {
		const matches = searchTerm
			? messages.reduce((acc, message, index) => {
				if (message.type === 'text' && message.text.toLowerCase().includes(searchTerm.toLowerCase()))
					acc.push(index);
				return acc;
			}, [])
			: [];
		setMatchedMessages(matches);
		setCurrentMatch(0);
	}, [searchTerm, messages]);

	// Scroll to highlighted message
	useEffect(() => {
		if (matchedMessages.length > 0) {
			const messageElement = document.querySelector(`[data-message-index="${matchedMessages[currentMatch]}"]`);
			messageElement?.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [currentMatch, matchedMessages]);

	// Auto scroll to bottom on new messages
	useEffect(() => {
		if (!isSearchOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isSearchOpen]);

	const handlePrevMatch = () => {
		setCurrentMatch(prev => Math.max(0, prev - 1));
	};

	const handleNextMatch = () => {
		// ToDo: Do it on enter push
		setCurrentMatch(prev => Math.min(matchedMessages.length - 1, prev + 1));
	};

	if (isMessagesLoading) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<Loader className="size-8 animate-spin" />
			</div>
		);
	}

	return (
		<>
			<div className="flex-1 flex flex-col">
				<ChatHeader onSearchOpen={() => setIsSearchOpen(true)} />
				{isSearchOpen && (
					<SearchBar
						searchTerm={searchTerm}
						onSearchChange={setSearchTerm}
						onClose={() => {
							setIsSearchOpen(false);
							setSearchTerm("");
						}}
						currentMatch={currentMatch}
						totalMatches={matchedMessages.length}
						onPrevMatch={handlePrevMatch}
						onNextMatch={handleNextMatch}
					/>
				)}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{messages.map((message, index) => (
						<div key={message._id} data-message-index={index}>
							<MessageBubble
								message={message}
								isOwnMessage={message.senderId === authUser._id}
								searchTerm={searchTerm}
								isHighlighted={matchedMessages[currentMatch] === index}
								isLastMessage={index === messages.length - 1}
							/>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
				<MessageInput />
			</div>
			{isProfileOpen && <UserProfile />}
		</>
	);
};

export default ChatContainer;