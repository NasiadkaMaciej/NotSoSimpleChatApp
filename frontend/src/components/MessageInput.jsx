import { useState, useEffect, useRef } from "react";
import { Send, Smile, Image as ImageIcon, X } from "lucide-react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
	const { selectedUser, sendMessage } = useChatStore();
	const [text, setText] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const inputRef = useRef(null);
	const imageInputRef = useRef(null);
	const pickerRef = useRef(null);

	// Close emoji picker
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target))
				setShowEmojiPicker(false);
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleImageSelect = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5242880) { // 50MB
				toast.error("Image size should be less than 50MB");
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
				setImagePreview(URL.createObjectURL(file));
			};
			reader.readAsDataURL(file);
		}
	};
	// Focus on input after selecting a user
	useEffect(() => {
		if (selectedUser && inputRef.current)
			inputRef.current.focus();
	}, [selectedUser]);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		const trimmedText = text.trim();
		if ((!trimmedText && !image) || !selectedUser) return;

		try {
			if (image) {
				await sendMessage(null, image);
				setImage(null);
				setImagePreview(null);
			} else await sendMessage(convertTextWithEmojis(trimmedText));
			setText("");
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	const clearImage = () => {
		setImage(null);
		setImagePreview(null);
		if (imageInputRef.current) {
			imageInputRef.current.value = '';
		}
	};

	const handleEmojiSelect = (emoji) => {
		setText(prev => prev + emoji.native);
		setShowEmojiPicker(false);
		inputRef.current?.focus();
	};

	// ToDo: Change name to: renderText?
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
			{imagePreview && (
				<div className="absolute bottom-full left-0 p-4 w-full">
					<div className="relative inline-block">
						<img
							src={imagePreview}
							alt="Preview"
							className="max-h-60 rounded-lg shadow-lg"
						/>
						<button
							onClick={clearImage}
							className="absolute -top-2 -right-2 btn btn-circle btn-error btn-xs"
						>
							<X size={14} />
						</button>
					</div>
				</div>
			)}
			<form onSubmit={handleSendMessage} className="flex items-center gap-2">
				<div className="relative flex gap-2">
					<button
						type="button"
						className="btn btn-circle btn-sm"
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					>
						<Smile size={20} />
					</button>
					<button
						type="button"
						className="btn btn-circle btn-sm"
						onClick={() => imageInputRef.current?.click()}
					>
						<ImageIcon size={20} />
					</button>
					<input
						type="file"
						ref={imageInputRef}
						className="hidden"
						accept="image/*"
						onChange={handleImageSelect}
					/>
					{showEmojiPicker && (
						<div ref={pickerRef} className="absolute bottom-12 left-0 z-50">
							<Picker
								data={data}
								onEmojiSelect={handleEmojiSelect}
								theme={localStorage.getItem('theme')}
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
					onChange={(e) => setText(e.target.value)}
					disabled={!selectedUser || image}
				/>
				<button
					type="submit"
					className="btn btn-primary btn-sm btn-circle size-12 transition-all hover:scale-105"
					disabled={(!text.trim() && !image) || !selectedUser}
				>
					<Send size={20} />
				</button>
			</form>
		</div>
	);
};

export default MessageInput;