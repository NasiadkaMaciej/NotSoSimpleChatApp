import { useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import UserCard from '../components/UserCard';
import { Search } from 'lucide-react';

const ContactsPage = () => {
	const {
		users,
		searchUsers,
		currentGroup,
		setContactsGroup,
		toggleGroupMembership,
		toggleUserMute,
		toggleBlockUser,
		searchResults
	} = useChatStore();
	const [searchQuery, setSearchQuery] = useState('');

	const filteredUsers = searchQuery
		? searchResults
		: users.filter(user => {
			if (currentGroup === 'all') return true;
			const groupProp = 'is' + currentGroup.charAt(0).toUpperCase() + currentGroup.slice(1);
			return user[groupProp];
		});

	const handleSearch = (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		searchUsers(query);
	};

	return (
		<div className="container mx-auto pt-20 p-4">
			<div className="flex flex-col gap-4">
				<div className="relative">
					<input
						type="text"
						placeholder="Search contacts..."
						className="input input-bordered w-full pl-10"
						value={searchQuery}
						onChange={handleSearch}
					/>
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/40" />
				</div>

				<div className="tabs tabs-boxed justify-center">
					{['All', 'Friends', 'Work', 'Family'].map(group => (
						<button
							key={group}
							className={`tab ${currentGroup === group.toLowerCase() ? 'tab-active' : ''}`}
							onClick={() => setContactsGroup(group.toLowerCase())}
						>
							{group}
						</button>
					))}
				</div>

				<div className="grid gap-4">
					{filteredUsers.map(user => (
						<UserCard
							key={user._id}
							user={user}
							onGroupToggle={toggleGroupMembership}
							onMuteToggle={toggleUserMute}
							onBlockToggle={toggleBlockUser}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default ContactsPage;