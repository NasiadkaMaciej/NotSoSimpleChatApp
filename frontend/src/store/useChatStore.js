// Manages chat messages, users, and real-time message subscriptions
// Uses Zustand for state management

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
	messages: [],
	isUsersLoading: false,
	isMessagesLoading: false,
	isProfileOpen: false,
	setMessageText: (text) => set({ messageText: text }),

	setProfileOpen: (value) => set({ isProfileOpen: value }),

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

	setSelectedUser: (selectedUser) => {
		set({ selectedUser });
		if (selectedUser) {
			get().getMessages(selectedUser._id);
		}
	},

	// ToDo: Cache messages to not load when switching
	getMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const res = await axiosInstance.get(`/message/${userId}`);
			set({ messages: res.data });
		} catch (error) {
			displayError(error);
			set({ messages: [] });
		} finally {
			set({ isMessagesLoading: false });
		}
	},
	sendMessage: async (text) => {
		const { selectedUser, messages } = get();
		try {
			const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, { text });
			set({ messages: [...messages, res.data] });
		} catch (error) {
			displayError(error);
		}
	},

	appendMessage: (message) => {
		set((state) => {
			const updatedMessages = [...state.messages];
			updatedMessages.push(message);
			return { messages: updatedMessages };
		});
	},
}));