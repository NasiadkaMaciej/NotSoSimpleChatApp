import {
	MessageSquare, Users, Image, Smile, Settings, Lock,
	Bell, Ban, Search, Palette, Mail, CheckCircle,
	UserPlus, Heart, Briefcase, Home, Clock, Link
} from "lucide-react";

const WelcomeChat = () => {
	const features = [
		{
			category: "Messaging",
			items: [
				{
					icon: <MessageSquare className="size-6 text-primary" />,
					title: "Real-time Chat",
					description: "Send and receive messages instantly with online status indicators"
				},
				{
					icon: <Image className="size-6 text-success" />,
					title: "Media Sharing",
					description: "Share photos up to 50MB with fullscreen preview"
				},
				{
					icon: <Smile className="size-6 text-warning" />,
					title: "Rich Messages",
					description: "Use emojis and clickable links in messages"
				},
				{
					icon: <Clock className="size-6 text-info" />,
					title: "Message Management",
					description: "Edit messages within 15 minutes, delete within 1 hour"
				},
				{
					icon: <Link className="size-6 text-secondary" />,
					title: "Smart Links",
					description: "Auto-detect and format URLs as clickable links"
				},
				{
					icon: <Search className="size-6 text-accent" />,
					title: "Message Search",
					description: "Search through chat history with highlight matches"
				}
			]
		},
		{
			category: "Contacts",
			items: [
				{
					icon: <Users className="size-6 text-primary" />,
					title: "Contact Groups",
					description: "Organize contacts into Friends, Work & Family"
				},
				{
					icon: <UserPlus className="size-6 text-success" />,
					title: "User Search",
					description: "Find users by username or email"
				},
				{
					icon: <Heart className="size-6 text-error" />,
					title: "Friends List",
					description: "Add favorite contacts to Friends group"
				},
				{
					icon: <Briefcase className="size-6 text-info" />,
					title: "Work Contacts",
					description: "Keep professional contacts organized"
				},
				{
					icon: <Home className="size-6 text-warning" />,
					title: "Family Circle",
					description: "Stay connected with family members"
				},
				{
					icon: <CheckCircle className="size-6 text-primary" />,
					title: "Online Status",
					description: "See when your contacts are online or last active"
				}
			]
		},
		{
			category: "Privacy & Settings",
			items: [
				{
					icon: <Lock className="size-6 text-error" />,
					title: "Account Security",
					description: "Email verification and secure password rules"
				},
				{
					icon: <Bell className="size-6 text-warning" />,
					title: "Notifications",
					description: "Customize notifications per contact"
				},
				{
					icon: <Ban className="size-6 text-error" />,
					title: "User Blocking",
					description: "Block unwanted contacts"
				},
				{
					icon: <Palette className="size-6 text-success" />,
					title: "Themes",
					description: "Choose from 30+ beautiful themes"
				},
				{
					icon: <Settings className="size-6 text-secondary" />,
					title: "Profile Settings",
					description: "Customize avatar color and about section"
				},
				{
					icon: <Mail className="size-6 text-info" />,
					title: "Email Settings",
					description: "Verified email ensures account security"
				}
			]
		}
	];

	return (
		<div className="flex-1 overflow-y-auto">
			<div className="min-h-full flex flex-col items-center justify-center p-4 md:p-8">
				<div className="max-w-6xl w-full text-center space-y-8 md:space-y-12">
					<div className="space-y-4">
						<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							Welcome to Simple Chat
						</h1>
						<p className="text-lg md:text-xl text-base-content/60">
							A feature-rich chat application with real-time messaging, contact management, and customizable settings
						</p>
					</div>

					{features.map((category, index) => (
						<div key={index} className="space-y-4">
							<h2 className="text-2xl font-semibold">{category.category}</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{category.items.map((feature, featureIndex) => (
									<div
										key={featureIndex}
										className="card bg-base-200 hover:bg-base-300 transition-all hover:scale-105 cursor-default"
									>
										<div className="card-body items-center text-center space-y-3 p-6">
											<div className="size-14 rounded-xl bg-base-100 flex items-center justify-center">
												{feature.icon}
											</div>
											<h3 className="card-title text-lg">{feature.title}</h3>
											<p className="text-sm text-base-content/60">{feature.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default WelcomeChat;