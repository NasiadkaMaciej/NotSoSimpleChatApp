import { X, User } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
	const { selectedUser, setSelectedUser } = useChatStore();
	// ToDo: Replace with actual online users list
	return (
		<div className="p-2.5 border-b border-base-300">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-full flex items-center justify-center bg-primary/10">
						<User className="size-6" style={{ color: selectedUser.avatarColor || "#ffffff" }} />
					</div>
					<div>
						<h3 className="font-medium">{selectedUser.username}</h3>
					</div>
				</div>
				{ /* ToDo: Add a button to open user profile */ }
				{ /* ToDo: Display conversation options */ }

			</div>
		</div>
	);
};

export default ChatHeader;