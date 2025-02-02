import { Search, X, ArrowUp, ArrowDown } from "lucide-react";

const SearchBar = ({
	searchTerm,
	onSearchChange,
	onClose,
	currentMatch,
	totalMatches,
	onPrevMatch,
	onNextMatch
}) => {
	return (
		<div className="p-2 border-b border-base-300 flex items-center gap-2">
			<div className="relative flex-1">
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search in conversation..."
					className="input input-sm input-bordered w-full pl-9"
					autoFocus
				/>
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
			</div>

			{searchTerm && totalMatches > 0 && (
				<div className="flex items-center gap-2">
					<span className="text-sm">
						{currentMatch + 1} of {totalMatches}
					</span>
					<button
						onClick={onPrevMatch}
						className="btn btn-sm btn-ghost btn-circle"
						disabled={currentMatch === 0}
					>
						<ArrowUp className="size-4" />
					</button>
					<button
						onClick={onNextMatch}
						className="btn btn-sm btn-ghost btn-circle"
						disabled={currentMatch === totalMatches - 1}
					>
						<ArrowDown className="size-4" />
					</button>
				</div>
			)}

			<button onClick={onClose} className="btn btn-sm btn-ghost btn-circle">
				<X className="size-4" />
			</button>
		</div>
	);
};

export default SearchBar;