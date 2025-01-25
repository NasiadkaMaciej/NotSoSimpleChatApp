// Sidebar component - Displays a list of users (ToDo: contact groups) and handles user selection
// Used as the left panel in the chat application

import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Users, User, Loader } from "lucide-react";

const Sidebar = () => {
	const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

	useEffect(() => {
		getUsers();
		// Get users list every 30 seconds
		// ToDo: Socket.io for real-time updates?
		// ToDo: Cache?
		const interval = setInterval(() => {
			getUsers();
		}, 30000);
		return () => clearInterval(interval);
	}, []);

	// If no users are found
	if (users.length === 0) {
		return isUsersLoading ? (
			<aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col items-center justify-center">
				<Loader className="size-6 animate-spin" />
				<span className="mt-2 text-sm">Loading contacts...</span>
			</aside>
		) : (
			<aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col items-center justify-center">
				<span className="text-sm">No contacts found</span>
			</aside>
		)
	}

	return (
		<aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
			<div className="border-b border-base-300 w-full p-5">
				<div className="flex items-center gap-2">
					<Users className="size-6" />
					{ /* ToDo: after clicking, show only from friends/work etc. groups */}
					<span className="font-medium hidden lg:block">Contacts</span>
				</div>
			</div>

			{/* Users list */}
			<div className="overflow-y-auto w-full py-3">
				{isUsersLoading ? (
					<div className="flex justify-center items-center h-full">Loading...</div>
				) : (
					// Map through users and create buttons for selection
					users.map((user) => (
						<button
							key={user._id}
							onClick={() => setSelectedUser(user)}
							className={`
								w-full p-3 flex items-center gap-3
								hover:bg-base-300 transition-colors
								${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
							`}
						>
							{/* User avatar */}
							<div className="relative mx-auto lg:mx-0">
								<div
									className="size-12 rounded-full flex items-center justify-center bg-primary/10"
								>
									<User className="size-8" style={{ color: user.avatarColor || "#ffffff" }} />
								</div>
							</div>

							{/* User name - only visible on larger screens */}
							<div className="hidden lg:block text-left min-w-0">
								<div className="font-medium truncate">{user.username}</div>
							</div>
						</button>
					))
				)}
			</div>
		</aside>
	);
};

export default Sidebar;