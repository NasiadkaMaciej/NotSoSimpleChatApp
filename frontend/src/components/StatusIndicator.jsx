const StatusIndicator = ({ status }) => {
	const getStatusColor = () => {
		switch (status) {
			case 'online':
				return 'bg-success';
			case 'busy':
				return 'bg-error';
			case 'offline':
			default:
				return 'bg-base-300';
		}
	};

	return (
		<div
			className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-100
		${getStatusColor()}`}
		/>
	);
};

export default StatusIndicator;