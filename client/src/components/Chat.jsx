import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUserCircle, FaBars, FaMoon, FaSun } from 'react-icons/fa';

const Chat = () => {
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Algebra Group',
      lastMessage: 'Please submit your assignment by Friday.',
      lastMessageTime: '10:30 AM',
      unreadCount: 2,
    },
    {
      id: 2,
      name: 'Chemistry Lab',
      lastMessage: 'Lab report deadline extended.',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
    },
    {
      id: 3,
      name: 'History Essay',
      lastMessage: 'Add more references to your essay.',
      lastMessageTime: '2 days ago',
      unreadCount: 1,
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample messages for the selected chat
  const sampleMessages = [
    { id: 1, sender: 'Teacher', text: 'Please submit your assignment by Friday.', timestamp: '10:30 AM' },
    { id: 2, sender: 'You', text: 'Understood, I will submit it on time.', timestamp: '10:35 AM' },
    { id: 3, sender: 'Teacher', text: 'Great! Let me know if you need any help.', timestamp: '10:40 AM' },
  ];

  // Load sample messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      setMessages(sampleMessages);
    }
  }, [selectedChat]);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send a new message
  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      } transition-colors duration-300`}
    >
      <div
        className={`w-full max-w-6xl mx-4 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } transition-colors duration-300`}
      >
        {/* Sidebar for Chats */}
        <div
          className={`w-full md:w-1/3 border-r ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } transition-colors duration-300 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}
        >
          <div className={`p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-green-500 text-white'}`}>
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Chats</h1>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-opacity-20 hover:bg-white"
              >
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-200px)]">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 flex items-center cursor-pointer ${
                  selectedChat?.id === chat.id
                    ? isDarkMode
                      ? 'bg-gray-700'
                      : 'bg-green-100'
                    : isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                } transition-colors duration-300`}
                onClick={() => {
                  setSelectedChat(chat);
                  setIsSidebarOpen(false); // Close sidebar on mobile after selecting a chat
                }}
              >
                <FaUserCircle className={`text-3xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-4`} />
                <div className="flex-1">
                  <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{chat.name}</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{chat.lastMessageTime}</div>
                {chat.unreadCount > 0 && (
                  <div className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-1">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className={`p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-green-500 text-white'}`}>
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden mr-4 p-2 rounded-full hover:bg-opacity-20 hover:bg-white"
              >
                <FaBars />
              </button>
              {selectedChat ? (
                <h2 className="text-xl font-bold">{selectedChat.name}</h2>
              ) : (
                <h2 className="text-xl font-bold">Select a chat to start messaging</h2>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === 'You' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'You'
                      ? isDarkMode
                        ? 'bg-green-600 text-white'
                        : 'bg-green-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Message Input */}
          {selectedChat && (
            <div className={`p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className={`flex-1 p-2 border ${
                    isDarkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                <button
                  onClick={sendMessage}
                  className={`ml-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-transform transform hover:scale-110`}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;