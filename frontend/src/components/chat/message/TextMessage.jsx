import { formatMessageContent } from "../../../utils/messageFormatting";

const TextMessage = ({ text, isEdited, searchTerm, isHighlighted }) => {
	return (
		<>
			{formatMessageContent(text, searchTerm, isHighlighted)}
			{isEdited && <span className="text-xs text-base-content/40 ml-2">(edited)</span>}
		</>
	);
};

export default TextMessage;
