import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
    const [text, setText] = useState("");
    const inputRef = useRef(null);
    const { sendMessage, selectedUser } = useChatStore();
    
    // Focus on input when selecting a user
    useEffect(() => {
        if (selectedUser && inputRef.current)
            inputRef.current.focus();
    }, [selectedUser]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedText = text.trim();
        if (!trimmedText || !selectedUser) return;
        
        try {
            await sendMessage(trimmedText);
            setText("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="p-4 w-full">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 input input-bordered rounded-lg input-sm sm:input-md"
                    placeholder={selectedUser ? "Type a message..." : "Select a contact to start chatting"}
                    value={text}
                    onChange={(e) => { setText(e.target.value);}}
                    disabled={!selectedUser}
                />
                <button
                    type="submit"
                    className="btn btn-primary btn-sm btn-circle size-12 transition-all hover:scale-105"
					// Disable button if no text or no selected user
                    disabled={!text.trim() || !selectedUser}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;