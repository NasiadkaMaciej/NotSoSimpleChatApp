import { useState, useEffect, useRef } from "react";
import { Send, Smile } from "lucide-react";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
	const [text, setText] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const inputRef = useRef(null);
	const pickerRef = useRef(null);
	const { sendMessage, selectedUser } = useChatStore();

	// Close emoji picker
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target))
				setShowEmojiPicker(false);
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Focus on input after selecting a user
	useEffect(() => {
		if (selectedUser && inputRef.current)
			inputRef.current.focus();
	}, [selectedUser]);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		const trimmedText = text.trim();
		if (!trimmedText || !selectedUser) return;

		try {
			await sendMessage(convertTextWithEmojis(trimmedText));
			setText("");
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	const handleEmojiSelect = (emoji) => {
		setText(prev => prev + emoji.native);
		setShowEmojiPicker(false);
		inputRef.current?.focus();
	};

	const convertTextWithEmojis = (text) => {
		const emojiMap = { // When user types emoji instead of choosing it from the picker
			':)': '😊', ':-)': '😊', ':D': '😃', ':-D': '😃', ':(': '😞', ':-(': '😞',
			';)': '😉', ';-)': '😉', ':P': '😛', ':-P': '😛', ':O': '😮', ':-O': '😮',
			'<3': '❤️',
		};
		return text.replace(/:\)|:-\)|:D|:-D|:\(|:-\(|;\)|;-\)|:P|:-P|:O|:-O|<3/g, match => emojiMap[match]);
	};

	return (
		<div className="p-4 w-full relative">
			<form onSubmit={handleSendMessage} className="flex items-center gap-2">
				<div className="relative">
					<button
						type="button"
						className="btn btn-circle btn-sm"
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					>
						<Smile size={20} />
					</button>
					{showEmojiPicker && (
						<div
							ref={pickerRef}
							className="absolute bottom-12 left-0 z-50"
						>
							<Picker
								data={data}
								onEmojiSelect={handleEmojiSelect}
								theme={(() => {
								{ /* Convert DaisyUI themes to emoji-picker theme */}
									const darkThemes = [
										'dark', 'synthwave', 'cyberpunk', 'halloween',
										'forest', 'black', 'luxury', 'business',
										'dracula', 'nigth', 'coffee', 'dim', 'sunset'
									];
									const currentTheme = localStorage.getItem('theme');
									return darkThemes.includes(currentTheme) ? 'dark' : 'light';
								})()}
							/>
						</div>
					)}
				</div>
				<input
					ref={inputRef}
					type="text"
					className="flex-1 input input-bordered rounded-lg input-sm sm:input-md"
					placeholder={selectedUser ? "Type a message..." : "Select a contact to start chatting"}
					value={text}
					onChange={(e) => { setText(e.target.value); }}
					disabled={!selectedUser}
				/>
				<button
					type="submit"
					className="btn btn-primary btn-sm btn-circle size-12 transition-all hover:scale-105"
					disabled={!text.trim() || !selectedUser}
				>
					<Send size={20} />
				</button>
			</form>
		</div>
	);
};

export default MessageInput;