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