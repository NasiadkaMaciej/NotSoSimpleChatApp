const StatusIndicator = ({ isOnline }) => {
	return (
		<div
			className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-100 
		${isOnline ? 'bg-success' : 'bg-base-300'}`}
		/>
	);
};

export default StatusIndicator;