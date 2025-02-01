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
		deactivate: () => axiosInstance.delete('/auth/deactivate'),
		verifyEmail: (token) => axiosInstance.get(`/auth/verify-email?token=${token}`),
	},
	users: {
		// Timestamp to prevent caching
		get: () => axiosInstance.get(`/message/users_=${Date.now()}`),
		update: (data) => axiosInstance.put('/auth/profile', data),
		block: (userId) => axiosInstance.post(`/auth/block/${userId}`)
	},
	messages: {
		send: (userId, data) => axiosInstance.post(`/message/send/${userId}`, data),
		get: (userId) => axiosInstance.get(`/message/${userId}`),
		search: (query) => axiosInstance.get(`/message/search?q=${query}`)
	}
};