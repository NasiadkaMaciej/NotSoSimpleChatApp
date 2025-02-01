import { useEffect, useRef } from 'react';

export const useSocket = (authUser, handlers) => {
	const socketRef = useRef(null);

	useEffect(() => {
		if (!authUser?._id) return;

		// Create socket connection only if it doesn't exist
		if (!socketRef.current) {
			socketRef.current = window.io({
				path: '/socket.io/',
				query: { userId: authUser._id },
				transports: ['websocket'],
			});

			// Register event handlers
			Object.entries(handlers).forEach(([event, handler]) => {
				socketRef.current.on(event, handler);
			});
		}

		// Cleanup function
		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
				socketRef.current = null;
			}
		};
	}, [authUser._id]); // Only recreate socket when user ID changes
};