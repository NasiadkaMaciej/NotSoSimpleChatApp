import axios from 'axios';
const axiosInstance = axios.create({
	// ToDo: Change it later to url
	baseURL: 'https://front.nasiadka.pl/api',
	withCredentials: true,
	headers: {
		// Ensure no cache to prevent users list being stuck
		'Content-Type': 'application/json',
		'Cache-Control': 'no-cache',
		'Pragma': 'no-cache',
		'Expires': '0'
	}
});
export const api = {
	auth: {
		check: () => axiosInstance.get('/auth/check'),
		login: (data) => axiosInstance.post('/auth/login', data),
		signup: (data) => axiosInstance.post('/auth/signup', data),
		logout: () => axiosInstance.post('/auth/logout'),

		groups: (userId, data) => axiosInstance.post(`/auth/groups/${userId}`, data),
		notifications: { mute: (userId) => axiosInstance.post(`/auth/notifications/mute/${userId}`) },
		block: (userId) => axiosInstance.post(`/auth/block/${userId}`),

		deactivate: () => axiosInstance.delete('/auth/deactivate'),
		verifyEmail: (token) => axiosInstance.get(`/auth/verify-email?token=${token}`),
	},
	users: {
		// Timestamp to prevent caching
		get: () => axiosInstance.get(`/message/users?_=${Date.now()}`),
		update: (data) => axiosInstance.put('/auth/profile', data),
		updateCredentials: (data) => axiosInstance.put('/auth/credentials', data),
		search: (query) => axiosInstance.get(`/auth/search?query=${encodeURIComponent(query)}`),
	},
	messages: {
		send: (userId, data) => axiosInstance.post(`/message/send/${userId}`, data),
		get: (userId) => axiosInstance.get(`/message/${userId}`),
		edit: (messageId, text) => axiosInstance.put(`/message/${messageId}`, { text }),
		delete: (messageId) => axiosInstance.delete(`/message/${messageId}`),
	}
};