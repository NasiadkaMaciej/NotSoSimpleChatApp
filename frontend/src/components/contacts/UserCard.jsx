import { Ban, Bell, BellOff } from 'lucide-react';
import Avatar from '../shared/Avatar';

const UserCard = ({ user, onGroupToggle, onMuteToggle, onBlockToggle }) => {
	const groups = ['Friends', 'Work', 'Family'];

	const handleGroupToggle = (userId, group) => {
		onGroupToggle(userId, group.toLowerCase());
	};

	return (
		<div className="card bg-base-200 shadow-xl">
			<div className="card-body flex-col sm:flex-row items-center gap-4">
				<div className="flex items-center gap-4">
					<Avatar color={user.avatarColor} size="12" />
					<div>
						<h3 className="font-bold">{user.username}</h3>
						<p className="text-sm opacity-70">{user.email}</p>
					</div>
				</div>

				<div className="flex flex-wrap gap-2 justify-end flex-1">
					{/* Group buttons */}
					<div className="flex flex-wrap gap-2">
						{groups.map(group => (
							<button
								key={group}
								onClick={() => handleGroupToggle(user._id, group)}
								className={`btn btn-sm ${user[`is${group}`] ? 'btn-primary' : 'btn-ghost'}`}
							>
								{group}
							</button>
						))}
					</div>

					{/* Mute/Block buttons */}
					<div className="flex gap-2">
						<button
							onClick={() => onMuteToggle(user._id)}
							className={`btn btn-sm ${user.isMuted ? 'btn-error' : 'btn-ghost'}`}
							title={user.isMuted ? 'Unmute notifications' : 'Mute notifications'}
						>
							{user.isMuted ? <BellOff className="size-4" /> : <Bell className="size-4" />}
						</button>
						<button
							onClick={() => onBlockToggle(user._id)}
							className={`btn btn-sm ${user.isBlocked ? 'btn-error' : 'btn-ghost'}`}
							title={user.isBlocked ? 'Unblock user' : 'Block user'}
						>
							<Ban className="size-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserCard;