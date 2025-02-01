import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { playNotification } from '../utils/notification';

export const useNotifications = (message, selectedUser) => {
	const { authUser } = useAuthStore();

	useEffect(() => {
		if (!message) return;

		// Show notification if not from current chat or window is not focused
		if (
			authUser?.notificationSettings?.enableNotifications &&
			(!selectedUser || selectedUser._id !== message.senderId || document.hidden)
		) {
			toast(`New message from ${message.senderName}`);
			if (authUser?.notificationSettings?.enableSound)
				playNotification();
		}
	}, [message, selectedUser, authUser]);
};