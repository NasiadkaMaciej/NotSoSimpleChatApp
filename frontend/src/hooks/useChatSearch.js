import { useState, useEffect } from "react";

export const useChatSearch = (messages) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [currentMatch, setCurrentMatch] = useState(0);
	const [matchedMessages, setMatchedMessages] = useState([]);

	// Update matches when search term changes
	useEffect(() => {
		if (!searchTerm) {
			setMatchedMessages([]);
			return;
		}

		const matches = messages.reduce((acc, message, index) => {
			if (message.type === 'text' &&
				message.text.toLowerCase().includes(searchTerm.toLowerCase())) {
				acc.push(index);
			}
			return acc;
		}, []);

		setMatchedMessages(matches);
		setCurrentMatch(matches.length > 0 ? 0 : -1);
	}, [searchTerm, messages]);

	const nextMatch = () => {
		if (matchedMessages.length > 0) {
			setCurrentMatch(prev => (prev + 1) % matchedMessages.length);
		}
	};

	const prevMatch = () => {
		if (matchedMessages.length > 0) {
			setCurrentMatch(prev => (prev - 1 + matchedMessages.length) % matchedMessages.length);
		}
	};

	return {
		searchTerm,
		setSearchTerm,
		currentMatch,
		matchedMessages,
		nextMatch,
		prevMatch
	};
};