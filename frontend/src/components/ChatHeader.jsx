import { Menu, Search } from 'lucide-react';
import Avatar from './Avatar';
import { useChatStore } from '../store/useChatStore';

export default function ChatHeader({ onSearchOpen }) {
	const { selectedUser, setProfileOpen } = useChatStore();

	return (
		<div className="p-4 border-b border-base-300">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Avatar color={selectedUser?.avatarColor} size="10" />
					<h3 className="font-medium">{selectedUser?.username}</h3>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={onSearchOpen}
						className="btn btn-ghost btn-sm btn-circle"
					>
						<Search className="size-5" />
					</button>
					<button
						onClick={() => setProfileOpen(true)}
						className="btn btn-ghost btn-sm btn-circle"
					>
						<Menu className="size-5" />
					</button>
				</div>
			</div>
		</div>
	);
}