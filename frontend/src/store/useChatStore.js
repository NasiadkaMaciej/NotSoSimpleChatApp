import toast from "react-hot-toast";
import { create } from "zustand";
import { api } from "../services/api";
import { useAuthStore } from "./useAuthStore";

const displayError = (error) => {
	const message = error.response?.data?.error || error.message;
	toast.error(message);
	console.error("Error:", message, error);
};

export const useChatStore = create((set, get) => ({
	// State
	users: [],
	messages: [],
	searchResults: [],
	onlineUsers: [],
	selectedUser: null,
	currentGroup: 'all', // 'all', 'friends', 'work', 'family'
	isUsersLoading: false,
	isMessagesLoading: false,
	isProfileOpen: false,
	inChatPage: false,

	// UI State Setters
	setOnlineUsers: (users) => set({ onlineUsers: users }),
	setProfileOpen: (isOpen) => set({ isProfileOpen: isOpen }),
	setInChatPage: (value) => set({ inChatPage: value }),

	// User Management
	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const { data: users } = await api.users.get();
			set({ users });
		} catch (error) {
			displayError(error);
			set({ users: [] });
		} finally {
			set({ isUsersLoading: false });
		}
	},

	setSelectedUser: (user) => {
		set({ selectedUser: user });

		if (user) {
			window.io().emit("messageRead", {
				senderId: user._id,
				receiverId: useAuthStore.getState().authUser._id
			});
		}
	},

	// Message Management
	// ToDo: Cache messages to not load when switching
	// ToDo: Pagination?
	getMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const { data } = await api.messages.get(userId);
			set({ messages: data });
			// Mark messages as read when loading conversation
			if (userId) {
				window.io().emit("messageRead", {
					senderId: userId,
					receiverId: useAuthStore.getState().authUser._id
				});
			}
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
			const { data } = await api.messages.send(selectedUser._id, messageData);
			set({ messages: [...messages, data] });
		} catch (error) {
			displayError(error);
		}
	},

	handleNewMessage: (message) => {
		const state = get();
		const authUser = useAuthStore.getState().authUser;
		const user = state.users.find(u => u._id === message.senderId);
		const correctedSenderName = message.senderName || user?.username || 'Unknown User';
		const isMuted = user?.isMuted;
		const isCurrentChat = (
			state.selectedUser?._id === message.senderId ||
			state.selectedUser?._id === message.receiverId
		);

		// If chat is open and message belongs to current conversation
		if (isCurrentChat && state.inChatPage) {
			// Mark as read immediately if we're the receiver
			if (message.receiverId === authUser._id)
				window.io().emit("messageRead", {
					senderId: message.senderId,
					receiverId: authUser._id
				});
			set(state => ({
				messages: [...state.messages, { ...message, isRead: message.receiverId === authUser._id }]
			}));
			// Show notification only if we're the receiver, chat isn't open, and user isn't muted
		} else if (message.receiverId === authUser._id && !isMuted)
			toast(`New message from ${correctedSenderName}`);
	},

	updateMessageStatus: (data) => {
		set(state => ({
			messages: state.messages.map(msg =>
				(msg.senderId === data.senderId && msg.receiverId === data.receiverId)
					? { ...msg, isRead: data.isRead }
					: msg
			)
		}));
	},

	// Group Management
	cycleSidebarGroup: () => {
		set(state => {
			const groups = ['all', 'friends', 'work', 'family'];
			const currentIndex = groups.indexOf(state.currentGroup);
			return { currentGroup: groups[(currentIndex + 1) % groups.length] };
		});
	},

	setContactsGroup: (group) => set({ currentGroup: group }),

	toggleGroupMembership: async (userId, group) => {
		try {
			const { data } = await api.auth.groups(userId, { group });
			const propertyName = `is${group.charAt(0).toUpperCase() + group.slice(1)}`;

			set(state => ({
				users: state.users.map(u =>
					u._id === userId ? { ...u, [propertyName]: data[propertyName] } : u
				),
				selectedUser: state.selectedUser?._id === userId
					? { ...state.selectedUser, [propertyName]: data[propertyName] }
					: state.selectedUser
			}));
			toast.success(data.message);
		} catch (error) {
			displayError(error);
		}
	},

	// User Actions
	toggleBlockUser: async (userId) => {
		try {
			const { data } = await api.auth.block(userId);
			const isBlocked = data.blockedUsers.includes(userId);

			set(state => ({
				users: state.users.map(u =>
					u._id === userId ? { ...u, isBlocked } : u
				),
				selectedUser: state.selectedUser?._id === userId
					? { ...state.selectedUser, isBlocked }
					: state.selectedUser
			}));
			toast.success(data.message);
		} catch (error) {
			displayError(error);
		}
	},

	toggleUserMute: async (userId) => {
		try {
			const { data } = await api.auth.notifications.mute(userId);
			set(state => ({
				users: state.users.map(u =>
					u._id === userId ? { ...u, isMuted: !u.isMuted } : u
				),
				selectedUser: state.selectedUser?._id === userId
					? { ...state.selectedUser, isMuted: !state.selectedUser.isMuted }
					: state.selectedUser
			}));
			toast.success(data.message);
		} catch (error) {
			displayError(error);
		}
	},

	// Search
	searchUsers: async (query) => {
		if (!query.trim()) {
			set({ searchResults: [] });
			return;
		}

		try {
			const { data } = await api.users.search(query);
			set({ searchResults: data });
		} catch (error) {
			console.error('Search error:', error);
			set({ searchResults: [] });
		}
	},
}));