import { CircleUser } from "lucide-react";

const Avatar = ({ color, size = "12" }) => {
	const sizeClass = `size-${size}`;
	return (
		<CircleUser
			className={`rounded-full flex items-center justify-center ${sizeClass} text-base-200`}
			style={{ backgroundColor: color || "#ffffff" }}
		/>
	);
};

export default Avatar;