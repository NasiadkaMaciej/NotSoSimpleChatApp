import { memo } from "react";
import Avatar from "./Avatar";

const UserItem = memo(({ user, isSelected, onClick }) => {
	return (
		<button
			onClick={() => onClick(user)}
			className={`
        w-full p-3 flex items-center gap-3
        hover:bg-base-300 transition-colors
        ${isSelected ? "bg-base-300 ring-1 ring-base-300" : ""}
      `}
		>
			<div className="relative mx-auto lg:mx-0">
				<Avatar color={user.avatarColor} />
			</div>

			<div className="hidden lg:block text-left min-w-0">
				<div className="font-medium truncate">{user.username}</div>
			</div>
		</button>
	);
});

export default UserItem;