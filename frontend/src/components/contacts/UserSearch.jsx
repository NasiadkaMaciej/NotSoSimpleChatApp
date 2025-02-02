import { Search } from 'lucide-react';

const UserSearch = ({ onSearch }) => {
	return (
		<div className="relative">
			<input
				type="text"
				placeholder="Search contacts..."
				className="input input-bordered w-full pl-10"
				onChange={(e) => onSearch(e.target.value)}
			/>
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
		</div>
	);
};

export default UserSearch;