import axios from 'axios';
export const axiosInstance = axios.create({
	// ToDo: Change it later to url
	baseURL: 'https://front.nasiadka.pl/api',
	withCredentials: true,
	headers: {
        'Content-Type': 'application/json'
    }
});