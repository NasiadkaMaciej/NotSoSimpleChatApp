import Avatar from "./Avatar";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
	const { selectedUser, setSelectedUser } = useChatStore();
	// ToDo: Replace with actual online users list
	return (
		<div className="p-5 border-b border-base-300">
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-3">
					<Avatar color={selectedUser.avatarColor} size="6" />
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