import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isOwnMessage, searchTerm, isHighlighted }) => {

	const renderStatus = () => {
		if (!isOwnMessage) return null;
		return message.status === 'read'
			? <CheckCheck size={14} className="text-success" />
			: <Check size={14} className="text-base-content/60" />;
	};
	
	const formatContent = (text, searchTerm, isHighlighted) => {
		if (!text) return text;

		const urlRegex = /(https?:\/\/[^\s]+)/g;
		const parts = searchTerm ? text.split(new RegExp(`(${searchTerm})`, 'gi')) : [text];

		return (
			<span>
				{parts.map((part, i) => {
					if (searchTerm && part.toLowerCase() === searchTerm.toLowerCase()) {
						return (
							<mark key={i} className={`bg-warning ${isHighlighted ? 'bg-warning-focus' : ''}`}>
								{part}
							</mark>
						);
					}

					return part.split(urlRegex).map((token, j) => (
						urlRegex.test(token) ? (
							<a key={`${i}-${j}`} href={token} target="_blank" className="underline">
								{token}
							</a>
						) : token
					));
				})}
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

		return formatContent(message.text, searchTerm, isHighlighted);
	};

	return (
		<div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
			<div className={`chat-bubble break-all ${isOwnMessage ? "chat-bubble-primary" : ""}`}>
				{renderContent()}
			</div>
			{renderStatus()}
		</div>
	);
};

export default MessageBubble;