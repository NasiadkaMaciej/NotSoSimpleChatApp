import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import WelcomeChat from "../components/WelcomeChat";

const ChatPage = () => {
    const { selectedUser } = useChatStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
		// Use /socket.io/socket.io.js from the server
        const socket = window.io({
            path: '/socket.io/',
            query: { userId: authUser._id }
			// ToDo: Reconnections?
        });

        socket.on("newMessage", (message) => {
            if (selectedUser?._id === message.senderId) {
                useChatStore.getState().getMessages(selectedUser._id);
            }
        });

        return () => socket.disconnect();
    }, [authUser._id, selectedUser]);

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