import axios from 'axios';
export const axiosInstance = axios.create({
	// ToDo: Change it later to url
	baseURL: 'http://192.168.88.69:3005/api',
	withCredentials: true,
	headers: {
        'Content-Type': 'application/json'
    }
});