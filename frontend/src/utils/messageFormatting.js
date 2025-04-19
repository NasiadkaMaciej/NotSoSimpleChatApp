export const formatMessageContent = (text, searchTerm, isHighlighted) => {
	if (!text) return text;

	const urlRegex = /(https?:\/\/[^\s]+)/g;

	// If search term exists, split by it and highlight
	if (searchTerm) {
		const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));

		return parts.map((part, i) => {
			// Highlight search term
			if (part.toLowerCase() === searchTerm.toLowerCase()) {
				return (
					<mark key={i} className={`bg-warning ${isHighlighted ? 'bg-warning-focus' : ''}`}>
						{part}
					</mark>
				);
			}

			// Process URLs in regular text
			return part.split(urlRegex).map((token, j) => (
				urlRegex.test(token) ? (
					<a key={`${i}-${j}`} href={token} target="_blank" className="underline">
						{token}
					</a>
				) : token
			));
		});
	}

	// If no search term, just process URLs
	return text.split(urlRegex).map((token, i) => (
		urlRegex.test(token) ? (
			<a key={i} href={token} target="_blank" className="underline">
				{token}
			</a>
		) : token
	));
};