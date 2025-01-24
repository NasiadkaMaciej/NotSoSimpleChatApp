import { MessageSquare } from "lucide-react";

const WelcomeChat = () => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center w-full p-16 bg-base-100/50">
			<div className="max-w-md text-center space-y-6">
				<div className="flex justify-center gap-4 mb-4">
					<div className="relative">
						<div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10 animate-bounce">
							<MessageSquare className="size-8 text-primary" />
						</div>
					</div>
				</div>
				<h2 className="text-2xl font-bold">Welcome to Simple Chat App!</h2>
				<p className="text-base-content/60">
					Simply select conversation and start chatting
				</p>
			</div>
		</div>
	);
};

export default WelcomeChat;