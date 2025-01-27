import { X } from 'lucide-react'
import Avatar from './Avatar'
import { useChatStore } from '../store/useChatStore'
import { formatLastSeen } from '../utils/lastSeen';

export default function UserProfile() {
	const { selectedUser, setProfileOpen, onlineUsers, addFriend, removeFriend } = useChatStore();
	const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

	const handleFriendAction = async () => {
		if (selectedUser.isFriend) await removeFriend(selectedUser._id);
		else await addFriend(selectedUser._id);
	};

	return (
		<div className="w-80 h-full border-l border-base-300 bg-base-100 flex flex-col">
			<div className="p-5 border-b border-base-300 flex justify-between items-center">
				<h2 className="text-lg font-semibold">Profile</h2>
				<button
					onClick={() => setProfileOpen(false)}
					className="btn btn-ghost btn-sm btn-circle"
				>
					<X className="size-5" />
				</button>
			</div>

			<div className="p-6 flex flex-col items-center gap-4">
				<Avatar color={selectedUser?.avatarColor} size="40" overrideTailwind="true" />
				<h3 className="text-xl font-semibold">{selectedUser?.username}</h3>
				<span className="text-sm text-base-content/60">
					{isOnline ? 'Online' : selectedUser?.lastSeen ? `Last seen: ${formatLastSeen(selectedUser.lastSeen)}` : 'Offline'}
				</span>
			</div>

			{selectedUser?.aboutMe && (
				<div className="px-6 pb-6">
					<h4 className="text-sm font-medium text-base-content/60 mb-2">About</h4>
					<p className="text-sm break-all">{selectedUser.aboutMe}</p>
				</div>
			)}

			<div className="mt-auto p-6 border-t border-base-300">
				<h4 className="text-sm font-medium text-base-content/60 mb-4">
					Conversation settings
				</h4>
				<div className="space-y-4">
					<button className="btn btn-outline w-full btn-sm" disabled>
						Mute notifications
					</button>
					<button
						className={`btn w-full btn-sm ${selectedUser.isFriend ? 'btn-error' : 'btn-primary'}`}
						onClick={handleFriendAction}
					>
						{selectedUser.isFriend ? 'Remove from Friends' : 'Add to Friends'}
					</button>
					<button className="btn btn-outline btn-error w-full btn-sm" disabled>
						Block user
					</button>
				</div>
			</div>
		</div>
	)
}