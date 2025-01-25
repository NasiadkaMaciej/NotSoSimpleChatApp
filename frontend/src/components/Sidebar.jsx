// Sidebar component - Displays a list of users (ToDo: contact groups) and handles user selection
// Used as the left panel in the chat application

import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Users, Loader } from "lucide-react";
import UserItem from "./UserItem";

const Sidebar = () => {
	const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

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
			<div className="border-b border-base-300 w-full p-5">
				<div className="flex items-center gap-2 lg:justify-start justify-center">
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
						<UserItem
							key={user._id}
							user={user}
							isSelected={selectedUser?._id === user._id}
							onClick={setSelectedUser}
						/>
					))
				)}
			</div>
		</aside>
	);
};

export default Sidebar;