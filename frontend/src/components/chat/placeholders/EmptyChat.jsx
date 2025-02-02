import { MessageSquare, Send } from "lucide-react";

const EmptyChat = ({ username }) => {
	return (
		<div className="flex-1 flex items-center justify-center p-4 mt-20">
			<div className="text-center space-y-10 animate-fade-in">
				<div className="flex justify-center mb-6">
					<div className="relative">
						<div className="size-24 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg animate-bounce">
							<MessageSquare className="size-12 text-primary" />
						</div>
					</div>
				</div>

				<h3 className="text-2xl text-base-content/80 font-semibold bg-clip-text">
					Start chatting with {username}
				</h3>
				<p className="text-base-content/80 text-lg">
					Begin your conversation journey
				</p>

				<div className="flex items-center justify-center gap-3 text-base text-base-content/80 bg-base-200/50 p-4 rounded-xl backdrop-blur-sm">
					<span>Type a message and click</span>
					<div className="size-10 rounded-full flex items-center justify-center shadow-md group cursor-pointer bg-primary hover:scale-110 transition-transform">
						<Send className="size-5 text-white" />
					</div>
					<span>to send</span>
				</div>
			</div>
		</div>
	);
};

export default EmptyChat;