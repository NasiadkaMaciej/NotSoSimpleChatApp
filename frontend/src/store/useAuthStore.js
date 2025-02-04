import toast from 'react-hot-toast';
import { create } from 'zustand';
import { api } from '../services/api';

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
			const response = await api.auth.check();
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
			await api.auth.signup(formData);
			toast.success("Account created successfully. Please verify your email.");			
			updateState({ 
				isSigningUp: false,
				signupSuccess: true 
			});
	
			return true; // Indicate success to component
		} catch (error) {
			displayError(error);
			updateState({ 
				isSigningUp: false,
				signupSuccess: false 
			});
			return false;
		}
	},

	login: async (formData) => {
		try {
			const response = await api.auth.login(formData);
			updateState({ authUser: response.data });
			toast.success("Logged in successfully");
		} catch (error) {
			displayError(error);
		}
	},

	logout: async () => {
		try {
			await api.auth.logout();
			updateState({ authUser: null });
			toast.success("Logged out successfully");
		} catch (error) {
			displayError(error);
		}
	},

	updateProfile: async (formData) => {
		updateState({ isUpdatingProfile: true });
		try {
			const response = await api.users.update(formData);
			updateState({ authUser: response.data });
			toast.success("Profile updated successfully");
		} catch (error) {
			displayError(error);
		} finally {
			updateState({ isUpdatingProfile: false });
		}
	}

}));