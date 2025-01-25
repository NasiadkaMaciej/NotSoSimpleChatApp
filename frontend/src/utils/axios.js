import axios from 'axios';
export const axiosInstance = axios.create({
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