import notificationSound from '../assets/notification.mp3';

export const requestNotificationPermission = async () => {
	try {
		if ('Notification' in window) {
			const permission = await Notification.requestPermission();
			return permission === 'granted';
		}
		return false;
	} catch (error) {
		console.error('Error requesting notification permission:', error);
		return false;
	}
};

export const playNotification = () => {
	const audio = new Audio(notificationSound);
	audio.play().catch(err => console.error('Error playing notification:', err));
};