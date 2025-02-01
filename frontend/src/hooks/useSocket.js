// frontend/src/hooks/useSocket.js
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { playNotification } from '../utils/notification';

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
				socketRef.current.on(event, (data) => {
					handler(data);

					// Show notification for new messages if enabled
					if (event === 'newMessage' && authUser?.notificationSettings?.enableNotifications) {
						toast(`New message from ${data.senderName}`);
						if (authUser?.notificationSettings?.enableSound)
							playNotification();
					}
				});
			});
		}

		// Handle window visibility
		const handleVisibilityChange = () => {
			if (socketRef.current) {
				socketRef.current.emit('userStatus', {
					userId: authUser._id,
					isOnline: !document.hidden
				});
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [authUser?._id, handlers]);
};