export const formatLastSeen = (lastSeen) => {
	if (!lastSeen) return 'Never';

	const now = new Date();
	const lastSeenDate = new Date(lastSeen);
	const diffInSeconds = Math.floor((now - lastSeenDate) / 1000);

	if (diffInSeconds < 60) return 'just now';
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
	if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

	return lastSeenDate.toLocaleDateString();
};