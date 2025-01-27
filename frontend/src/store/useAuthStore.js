import { create } from 'zustand';
import { axiosInstance } from '../utils/axios';
import toast from 'react-hot-toast';

const displayError = (error) => {
	const message = error.response?.data?.error || error.message;
	toast.error(message);
	console.error("Error: ", message, error);
};

export const useAuthStore = create((updateState) => ({
	authUser: null,
	isSigningUp: false,
	isCheckingAuth: true,
	isUpdatingProfile: false,

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
			toast.success("Account created successfully. Please verify your email.");
			setTimeout(() => {
				window.location.href = '/login';
			}, 3000);
		} catch (error) {
			displayError(error);
		} finally {
			updateState({ isSigningUp: false });
		}
	},

	login: async (formData) => {
		try {
			const response = await axiosInstance.post('/auth/login', formData);
			updateState({ authUser: response.data });
			toast.success("Logged in successfully");
		} catch (error) {
			displayError(error);
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post('/auth/logout');
			updateState({ authUser: null });
			toast.success("Logged out successfully");
		} catch (error) {
			displayError(error);
		}
	},

	updateProfile: async (formData) => {
		updateState({ isUpdatingProfile: true });
		try {
			const response = await axiosInstance.put('/auth/profile', formData);
			updateState({ authUser: response.data });
			toast.success("Profile updated successfully");
		} catch (error) {
			displayError(error);
		} finally {
			updateState({ isUpdatingProfile: false });
		}
	}

}));