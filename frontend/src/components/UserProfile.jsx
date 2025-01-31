import { X } from 'lucide-react'
import Avatar from './Avatar'
import { useChatStore } from '../store/useChatStore'
import { formatLastSeen } from '../utils/lastSeen';
import BlockButton from './BlockButton';

export default function UserProfile() {
	const { selectedUser, setProfileOpen, onlineUsers, toggleGroupMembership, toggleBlockUser } = useChatStore();
	const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);
	const isBlocked = selectedUser?.isBlocked;

	const groupButtons = [
		{ group: 'friends', label: 'Friends' },
		{ group: 'work', label: 'Work' },
		{ group: 'family', label: 'Family' }
	];

	return (
		<div className="w-full md:w-80 h-full fixed md:static inset-0 bg-base-100 border-l border-base-300 z-[60]">
			<div className="p-5 border-b border-base-300 flex justify-between items-center">
				<h2 className="text-lg font-semibold">Profile</h2>
				<button onClick={() => setProfileOpen(false)} className="btn btn-ghost btn-sm btn-circle">
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
				<h4 className="text-sm font-medium text-base-content/60 mb-4">Conversation settings</h4>
				<div className="space-y-4">
					{groupButtons.map(({ group, label }) => {
						const isInGroup = selectedUser?.[`is${group.charAt(0).toUpperCase() + group.slice(1)}`];

						return (
							<button
								key={group}
								className={`btn w-full btn-sm ${isInGroup ? 'btn-error' : 'btn-primary'}`}
								onClick={() => toggleGroupMembership(selectedUser._id, group)}
							>
								{isInGroup ? `Remove from ${label}` : `Add to ${label}`}
							</button>
						);
					})}
					<BlockButton
						isBlocked={isBlocked}
						onClick={() => toggleBlockUser(selectedUser._id)}
					/>
				</div>
			</div>
		</div>
	)
}
