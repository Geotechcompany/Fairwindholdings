import React, { useState, useEffect } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support' | 'auto';
  timestamp: Date;
}

const LiveChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Trigger automatic response
    handleAutomaticResponse(message);
  };

  const handleAutomaticResponse = (userMessage: string) => {
    // Simple automatic response logic
    let responseText = "Thank you for your message. A support agent will be with you shortly.";

    if (userMessage.toLowerCase().includes('password')) {
      responseText = "For password-related issues, please visit our password reset page or contact security@example.com.";
    } else if (userMessage.toLowerCase().includes('billing')) {
      responseText = "For billing inquiries, please email billing@example.com or call our finance department at 555-123-4567.";
    }

    const autoResponse: Message = {
      id: Date.now(),
      text: responseText,
      sender: 'auto',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, autoResponse]);
  };

  return (
    <div className="bg-[#1e2329] text-white p-6 flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">LIVE CHAT</h1>
      
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${
              msg.sender === 'user' ? 'bg-blue-500' : 
              msg.sender === 'support' ? 'bg-green-500' : 'bg-gray-500'
            }`}>
              {msg.text}
            </span>
          </div>
        ))}
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