import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/chat/Sidebar";
import ChatContainer from "../components/chat/ChatContainer";
import WelcomeChat from "../components/chat/WelcomeChat";

const ChatPage = () => {
	const { selectedUser } = useChatStore();

	return (
		<div className="h-screen bg-base-200">
			<div className="flex items-center justify-center pt-20 px-4">
				<div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
					<div className="flex h-full rounded-lg overflow-hidden">
						<Sidebar />
						{selectedUser ? <ChatContainer /> : <WelcomeChat />}
					</div>
				</div>
			</div>
		</div>
	);
};
export default ChatPage;