import React, { useState } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';

const LiveChat: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sending message logic here
    console.log('Message sent:', message);
    setMessage('');
  };

  return (
    <div className="bg-[#1e2329] text-white p-6 flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">LIVE CHAT</h1>
      
      <div className="flex-grow">
        {/* Chat messages will be displayed here */}
      </div>

      <form onSubmit={handleSendMessage} className="mt-4">
        <div className="flex items-center bg-[#2c3035] rounded-lg">
          <button type="button" className="p-2 text-gray-400 hover:text-white">
            <FaPaperclip />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send Message"
            className="flex-grow bg-transparent p-2 focus:outline-none text-white"
          />
          <button type="submit" className="p-2 text-gray-400 hover:text-white">
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveChat;