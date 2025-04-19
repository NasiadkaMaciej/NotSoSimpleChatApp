const ImageMessage = ({ imageSrc }) => {
	return (
		<div className="relative">
			<img
				src={imageSrc}
				alt="Message"
				className="max-w-sm rounded-lg shadow cursor-pointer hover:opacity-90 transition-opacity"
				onClick={() => window.open(imageSrc, "_blank")}
			/>
		</div>
	);
};

export default ImageMessage;
