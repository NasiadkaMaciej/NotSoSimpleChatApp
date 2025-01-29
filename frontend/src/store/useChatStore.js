// Manages chat messages, users, and real-time message subscriptions

import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios";
import { create } from "zustand";

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
	onlineUsers: [],
	showFriends: true,
	currentGroup: 'all', // 'all', 'friends', 'work', 'family'

	setOnlineUsers: (users) => { set({ onlineUsers: users }) },
	setProfileOpen: (isOpen) => { set({ isProfileOpen: isOpen }) },
	toggleShowFriends: () => set(state => ({ showFriends: !state.showFriends })),

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			// Timestamp to prevent caching
			const res = await axiosInstance.get(`/message/users?_=${Date.now()}`);
			const users = res.data;
			set({ users });
		} catch (error) {
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
	sendMessage: async (text, image) => {
		const { selectedUser, messages } = get();
		try {
			const messageData = image ? { image } : { text };
			const res = await axiosInstance.post(
				`/message/send/${selectedUser._id}`,
				messageData
			);
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

	toggleGroupMembership: async (userId, group) => {
		try {
			const user = get().users.find(u => u._id === userId);
			if (!user) throw new Error('User not found');

			const isInGroup = user[`is${group.charAt(0).toUpperCase() + group.slice(1)}`];
			const action = isInGroup ? 'remove' : 'add';

			const response = await axiosInstance.post(
				`/auth/groups/${userId}`,
				{ group, action }
			);

			// Update local state
			set(state => ({
				users: state.users.map(u =>
					u._id === userId
						? {
							...u,
							[`is${group.charAt(0).toUpperCase() + group.slice(1)}`]: !isInGroup,
							groups: response.data.groups
						}
						: u
				),
				selectedUser: state.selectedUser?._id === userId
					? {
						...state.selectedUser,
						[`is${group.charAt(0).toUpperCase() + group.slice(1)}`]: !isInGroup,
						groups: response.data.groups
					}
					: state.selectedUser
			}));

			toast.success(response.data.message);
		} catch (error) {
			displayError(error);
		}
	},

	toggleGroup: () => {
		set(state => {
			const groups = ['all', 'friends', 'work', 'family'];
			const currentIndex = groups.indexOf(state.currentGroup);
			const nextGroup = groups[(currentIndex + 1) % groups.length];
			return { currentGroup: nextGroup };
		});
	},

	updateMessageStatus: (data) => {
		set((state) => ({
			messages: state.messages.map(msg =>
				(msg.senderId === data.senderId && msg.receiverId === data.receiverId)
					? { ...msg, status: data.status }
					: msg
			)
		}));
	}
}));