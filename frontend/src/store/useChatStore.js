// Manages chat messages, users, and real-time message subscriptions

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
	onlineUsers: [],
	showFriends: true,

	setOnlineUsers: (users) => { set({ onlineUsers: users }) },
	setProfileOpen: (isOpen) => { set({ isProfileOpen: isOpen }) },
	toggleShowFriends: () => set(state => ({ showFriends: !state.showFriends })),

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			// Timestamp to prevent caching
			const res = await axiosInstance.get(`/message/users?_=${Date.now()}`);
			set({ users: Array.isArray(res.data) ? res.data : [] });
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

	addFriend: async (userId) => {
		try {
		  await axiosInstance.post(`/auth/friends/add/${userId}`);
		  
		  set(state => ({ // Update users list and selected user
			users: state.users.map(user => 
			  user._id === userId ? {...user, isFriend: true} : user
			),
			selectedUser: state.selectedUser?._id === userId ? 
			  {...state.selectedUser, isFriend: true} : 
			  state.selectedUser
		  }));
		  
		  toast.success("Friend added successfully");
		} catch (error) {
		  displayError(error);
		}
	  },
	
	  removeFriend: async (userId) => {
		try {
		  await axiosInstance.post(`/auth/friends/remove/${userId}`);
		  
		  set(state => ({ // Update users list and selected user
			users: state.users.map(user => 
			  user._id === userId ? {...user, isFriend: false} : user
			),
			selectedUser: state.selectedUser?._id === userId ? 
			  {...state.selectedUser, isFriend: false} : 
			  state.selectedUser
		  }));
		  
		  toast.success("Friend removed successfully");
		} catch (error) {
		  displayError(error);
		}
	  }
}));