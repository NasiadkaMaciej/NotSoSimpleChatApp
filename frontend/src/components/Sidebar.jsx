// Sidebar component - Displays a list of users (ToDo: contact groups) and handles user selection
// Used as the left panel in the chat application

import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Users, Loader } from "lucide-react";
import UserItem from "./UserItem";

const Sidebar = () => {
	const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, onlineUsers, showFriends, toggleShowFriends } = useChatStore();

	const displayedUsers = showFriends
		? users.filter(user => user.isFriend)
		: users;

	useEffect(() => {
		getUsers();
		// Set up interval for user list update
		// ToDo: Socket.io for real-time updates?
		// ToDo: Cache?
		const interval = setInterval(getUsers, 10 * 1000);
		return () => clearInterval(interval);
	}, []);

	// If no users are found
	if (users.length === 0)
		return (
			<aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col items-center justify-center">
				{isUsersLoading ? (<> <Loader className="size-6 animate-spin" /> <span className="mt-2 text-sm">Loading contacts...</span> </>
				) : <span className="text-sm">No contacts found</span>}
			</aside>
		)

	return (
		<aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
			<div className="border-b border-base-300 w-full p-6">
				<button
					onClick={toggleShowFriends}
					className="flex items-center gap-2 lg:justify-start justify-center"
				>
					<Users className="size-6" />
					<span className="font-medium hidden lg:block">
						{showFriends ? "Friends" : "All users"}
					</span>
				</button>
			</div>

			<div className="overflow-y-auto w-full py-3">
				{isUsersLoading ? (
					<div className="flex justify-center items-center h-full">Loading...</div>
				) : (
					displayedUsers.map((user) => (
						<UserItem
							key={user._id}
							user={user}
							isSelected={selectedUser?._id === user._id}
							onClick={setSelectedUser}
							onlineUsers={onlineUsers}
						/>
					))
				)}
			</div>
		</aside>
	);
};

export default Sidebar;