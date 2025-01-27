const MessageBubble = ({ message, isOwnMessage, searchTerm, isHighlighted }) => {
	const getHighlightedText = (text, searchTerm, isHighlighted) => {
		if (!text || !searchTerm) return text;

		const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
		return (
			<span>
				{parts.map((part, i) =>
					part.toLowerCase() === searchTerm.toLowerCase() ? (
						<mark key={i} className={`bg-warning ${isHighlighted ? 'bg-warning-focus' : ''}`}>
							{part}
						</mark>
					) : (
						part
					)
				)}
			</span>
		);
	};

	const renderContent = () => {
		if (message.type === 'image') {
			return (
				<div className="relative">
					<img
						src={message.image}
						alt="Message"
						className="max-w-sm rounded-lg shadow cursor-pointer hover:opacity-90 transition-opacity"
						onClick={() => window.open(message.image, '_blank')}
					/>
				</div>
			);
		}

		return getHighlightedText(message.text, searchTerm, isHighlighted);
	};

	return (
		<div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
			<div className={`chat-bubble break-all ${isOwnMessage ? "chat-bubble-primary" : ""}`}>
				{renderContent()}
			</div>
		</div>
	);
};

export default MessageBubble;