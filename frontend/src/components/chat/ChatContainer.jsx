import { useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatSearch } from "../../hooks/useChatSearch";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import UserProfile from "./UserProfile";
import SearchBar from "./SearchBar";
import MessageBubble from "./MessageBubble";
import EmptyChat from "./placeholders/EmptyChat";

const ChatContainer = () => {
	const { messages, isMessagesLoading, isProfileOpen, getMessages, selectedUser } = useChatStore();

	const { authUser } = useAuthStore();
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const messagesEndRef = useRef(null);

	const { searchTerm, setSearchTerm, currentMatch, matchedMessages, nextMatch, prevMatch } = useChatSearch(messages);

	// Fetch messages when selected user changes
	useEffect(() => {
		if (selectedUser) {
			getMessages(selectedUser._id);
		}
	}, [selectedUser, getMessages]);

	// Scroll to highlighted message or bottom of messages
	useEffect(() => {
		if (isSearchOpen && matchedMessages.length > 0) {
			const messageElement = document.querySelector(`[data-message-index="${matchedMessages[currentMatch]}"]`);
			messageElement?.scrollIntoView({ behavior: "smooth", block: "center" });
		} else if (!isSearchOpen) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isSearchOpen, currentMatch, matchedMessages]);

	// Loading state
	if (isMessagesLoading) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<Loader className="size-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex-1 flex md:static fixed inset-0 bg-base-100 z-50 sm:z-50 md:z-0">
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
						onPrevMatch={prevMatch}
						onNextMatch={nextMatch}
					/>
				)}

				<div className="flex-1 overflow-y-auto p-4">
					{messages.length > 0 ? (
						<div className="space-y-4">
							{messages.map((message, index) => (
								<div key={message._id} data-message-index={index}>
									<MessageBubble
										message={message}
										isOwnMessage={message.senderId === authUser._id}
										searchTerm={searchTerm}
										isHighlighted={matchedMessages[currentMatch] === index}
									/>
								</div>
							))}
							<div ref={messagesEndRef} />
						</div>
					) : (
						<EmptyChat username={selectedUser?.username} />
					)}
				</div>

				<MessageInput />
			</div>

			{isProfileOpen && <UserProfile />}
		</div>
	);
};

export default ChatContainer;
