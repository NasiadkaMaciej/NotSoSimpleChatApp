import Sidebar from "../components/Sidebar";
import WelcomeChat from "../components/WelcomeChat";

const ChatPage = () => {

	return (
		<div className="h-screen bg-base-200">
			<div className="flex items-center justify-center pt-20 px-4">
				<div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
					<div className="flex h-full rounded-lg overflow-hidden">
						<Sidebar />
						{/* ToDo: Display chat */}
						<WelcomeChat />
					</div>
				</div>
			</div>
		</div>
	);
};
export default ChatPage;
