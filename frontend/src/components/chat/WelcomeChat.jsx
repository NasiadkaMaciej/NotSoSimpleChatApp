import { MessageSquare, Users, Image, Smile, Settings, Lock } from "lucide-react";

const WelcomeChat = () => {
	const features = [
		{
			icon: <MessageSquare className="size-6 text-primary" />,
			title: "Messaging",
			description: "Send messages with emojis, photos and clickable links"
		},
		{
			icon: <Users className="size-6 text-secondary" />,
			title: "Contact Groups",
			description: "Organize contacts into Friends, Work & Family groups"
		},
		{
			icon: <Image className="size-6 text-success" />,
			title: "Photo Sharing",
			description: "Share photos and view them in full-screen mode"
		},
		{
			icon: <Smile className="size-6 text-warning" />,
			title: "Emoji Support",
			description: "Express yourself with a wide selection of emojis"
		},
		{
			icon: <Settings className="size-6 text-accent" />,
			title: "Profile Settings",
			description: "Customize your avatar color and about section"
		},
		{
			icon: <Lock className="size-6 text-info" />,
			title: "Secure Chat",
			description: "End-to-end encryption and email verification"
		}
	];

	return (
		<div className="flex-1 overflow-y-auto">
			<div className="min-h-full flex flex-col items-center justify-center p-4 md:p-8 bg-base-100/50">
				<div className="max-w-4xl w-full text-center space-y-6 md:space-y-8 py-4">
					<div className="space-y-3 md:space-y-4">
						<h1 className="text-3xl md:text-4xl font-bold">Welcome to Simple Chat</h1>
						<p className="text-base md:text-lg text-base-content/60">
							Select a contact from the sidebar to start chatting
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
						{features.map((feature, index) => (
							<div
								key={index}
								className="card bg-base-200 hover:bg-base-300 transition-all hover:scale-105 cursor-default"
							>
								<div className="card-body items-center text-center space-y-2 md:space-y-3 p-4 md:p-6">
									<div className="size-10 md:size-12 rounded-lg bg-base-100 flex items-center justify-center">
										{feature.icon}
									</div>
									<h2 className="card-title text-lg md:text-xl">{feature.title}</h2>
									<p className="text-sm md:text-base text-base-content/60">{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WelcomeChat;