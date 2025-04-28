import React, { useState, useEffect, useRef } from "react";
import {
    FaPaperPlane,
    FaUserCircle,
    FaBars,
    FaMoon,
    FaSun,
} from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

const Chat = () => {
    const [chatGroups, setChatGroups] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const messagesEndRef = useRef(null);

    // Fetch chat groups
    useEffect(() => {
        const fetchChatGroups = async () => {
            try {
                const response = await axiosInstance.get("/chat/groups");
                setChatGroups(response.data);
            } catch (error) {
                console.error("Error fetching chat groups:", error);
            }
        };
        fetchChatGroups();
    }, []);

    // Fetch messages when a chat is selected
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                try {
                    const response = await axiosInstance.get(
                        `/chat/messages/${selectedChat.chatGroupId}`
                    );
                    setMessages(response.data);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            }
        };
        fetchMessages();
    }, [selectedChat]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send a new message
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        try {
            const response = await axiosInstance.post("/chat/send", {
                chatGroupId: selectedChat.chatGroupId,
                message: newMessage,
            });

            setMessages([...messages, response.data]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-[#1a1a1a]/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
            {/* Sidebar for Chats */}
            <div
                className={`w-full md:w-1/3 border-r border-gray-700 transition-colors duration-300 ${
                    isSidebarOpen ? "block" : "hidden"
                } md:block`}
            >
                <div className="p-4 bg-[#FB773C]">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-white">
                            Assignment Chats
                        </h1>
                    </div>
                </div>
                <div className="overflow-y-auto h-[calc(100vh-200px)]">
                    {chatGroups.map((group) => (
                        <div
                            key={group.chatGroupId}
                            className={`p-4 flex items-center cursor-pointer ${
                                selectedChat?.chatGroupId === group.chatGroupId
                                    ? "bg-[#EB3678]/20"
                                    : "hover:bg-gray-800/50"
                            } transition-colors duration-300`}
                            onClick={() => {
                                setSelectedChat(group);
                                setIsSidebarOpen(false);
                            }}
                        >
                            <FaUserCircle className="text-3xl text-gray-400 mr-4" />
                            <div className="flex-1">
                                <h2 className="font-semibold text-white">
                                    {group.assignmentTitle}
                                </h2>
                                {group.recentMessages?.[0] && (
                                    <p className="text-sm text-gray-400">
                                        {group.recentMessages[0].message}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Expires: {formatDate(group.expiryDate)}
                                </p>
                            </div>
                            {!group.isActive && (
                                <div className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                    Expired
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Window */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 bg-[#FB773C]">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden mr-4 p-2 rounded-full hover:bg-opacity-20 hover:bg-white"
                        >
                            <FaBars className="text-white" />
                        </button>
                        {selectedChat ? (
                            <h2 className="text-xl font-bold text-white">
                                {selectedChat.assignmentTitle}
                            </h2>
                        ) : (
                            <h2 className="text-xl font-bold text-white">
                                Select a chat to start messaging
                            </h2>
                        )}
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    {messages.map((message) => (
                        <div
                            key={message.chatMessageId}
                            className={`mb-4 flex ${
                                message.role === "Teacher"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-xs p-3 rounded-lg ${
                                    message.role === "Teacher"
                                        ? "bg-[#FB773C] text-white"
                                        : "bg-gray-800 text-white"
                                }`}
                            >
                                <p className="font-semibold">
                                    {message.userName}
                                </p>
                                <p>{message.message}</p>
                                <p className="text-xs mt-1 text-gray-300">
                                    {formatDate(message.sentAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {selectedChat && selectedChat.isActive && (
                    <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 p-2 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB773C] "
                            />
                            <button
                                onClick={sendMessage}
                                className="ml-2 bg-[#FB773C] hover:bg-[#FB773C]/80 text-white p-3 rounded-lg transition-transform transform hover:scale-110"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                )}
                {selectedChat && !selectedChat.isActive && (
                    <div className="p-4 text-center text-red-400 bg-red-900/20 border-t border-gray-700">
                        This chat has expired as the assignment deadline has
                        passed.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
