import { create } from 'zustand';
import { axiosInstance } from '../utils/axios';
import toast from 'react-hot-toast';

const displayError = (error) => {
	const message = error.response?.data?.message || error.message;
	toast.error(message);
	console.error("Error: ", message, error);
};

export const useAuthStore = create((updateState) => ({
	authUser: null,
	isSigningUp: false,
	isCheckingAuth: true,

	checkAuth: async () => {
		// If token is not set, do not try to authenticate
		const jwtToken = document.cookie.split('; ').find(row => row.startsWith('jwt='));
		if (!jwtToken) {
			updateState({ isCheckingAuth: false });
			return;
		}

		try {
			const response = await axiosInstance('/auth/check');
			updateState({ authUser: response.data });
		} catch (error) {
			displayError(error);
		} finally {
			updateState({ isCheckingAuth: false });
		}
	},

	signup: async (formData) => {
		updateState({ isSigningUp: true });
		try {
			const response = await axiosInstance.post('/auth/signup', formData);
			toast.success("Account created successfully");
			updateState({ authUser: response.data });
		} catch (error) {
			displayError(error);
		} finally {
			updateState({ isSigningUp: false });
		}
	},

}));