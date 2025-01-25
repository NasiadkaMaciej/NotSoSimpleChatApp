// Manages chat messages, users, and real-time message subscriptions
// Uses Zustand for state management and Socket.io for real-time updates

import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios";

const displayError = (error) => {
	const message = error.response?.data?.error || error.message;
	toast.error(message);
	console.error("Error: ", message, error);
};

export const useChatStore = create((set, get) => ({
	users: [],
	selectedUser: null,
	isUsersLoading: false,

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			// Timestamp to prevent caching
			const res = await axiosInstance.get(`/message/users?_=${Date.now()}`);
			if (Array.isArray(res.data)) {
				set({ users: res.data });
			} else {
				console.error("Invalid users data received:", res.data);
				set({ users: [] });
			}
		} catch (error) {
			console.error("Error fetching users:", error);
			displayError(error);
			set({ users: [] });
		} finally {
			set({ isUsersLoading: false });
		}
	},

	setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
