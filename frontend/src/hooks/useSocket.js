// frontend/src/hooks/useSocket.js
import { useEffect } from 'react';

export const useSocket = (authUser, handlers, socketRef) => {
	useEffect(() => {
		if (!authUser?._id) return;

		if (!socketRef.current) {
			socketRef.current = window.io({
				path: '/socket.io/',
				query: { userId: authUser._id },
				transports: ['websocket'],
				reconnection: true,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
			});

			// Register event handlers
			Object.entries(handlers).forEach(([event, handler]) => {
				socketRef.current.on(event, handler);
			});
		}
	}, [authUser?._id, handlers]);
};