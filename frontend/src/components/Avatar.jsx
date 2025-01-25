import { CircleUser } from "lucide-react";

const Avatar = ({ color, size = "12", overrideTailwind = false }) => {
	const sizeClass = `size-${size}`;
	const styles = {
		backgroundColor: color || "#ffffff",
		...(overrideTailwind && {
			width: `${size / 4}rem`,
			height: `${size / 4}rem`,
		}),
	};

	return (
		<CircleUser
			className={`rounded-full flex items-center justify-center ${sizeClass} text-base-200`}
			style={styles}
		/>
	);
};

export default Avatar;