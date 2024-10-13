import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaPaperPlane } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Avatar from 'boring-avatars';

interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  isAdmin: boolean;
  isRead: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  unreadCount: number;
  timestamp: string;
}

function LiveChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    const intervalId = setInterval(fetchConversations, 30000); // Fetch every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        if (!selectedConversation && data.length > 0) {
          setSelectedConversation(data[0].id);
        }
      } else {
        throw new Error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !selectedConversation) return;

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message, conversationId: selectedConversation }),
      });

      if (response.ok) {
        setMessage('');
        fetchMessages(selectedConversation);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#1e2329] text-white flex h-full flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 border-r border-gray-700 flex flex-col h-full">
        <div className="p-4 bg-[#1e2329] sticky top-0 z-10 border-b border-gray-700">
          <h2 className="text-xl font-bold mb-4">All Inbox</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full bg-[#2c3035] p-2 pl-8 rounded-md text-white"
            />
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto flex-grow">
          {conversations.map((conv) => (
            <motion.div
              key={conv.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedConversation(conv.id)}
              className={`flex items-center space-x-3 p-4 cursor-pointer ${
                selectedConversation === conv.id ? 'bg-[#2c3035]' : ''
              }`}
            >
              <Avatar
                size={40}
                name={conv.id}
                variant="beam"
                colors={['#1e2329', '#2c3035', '#3498db', '#2980b9', '#34495e']}
              />
              <div className="flex-grow">
                <p className="font-semibold">{conv.name}</p>
                <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
              </div>
              <div className="text-xs text-gray-400">{new Date(conv.timestamp).toLocaleTimeString()}</div>
              {conv.unreadCount > 0 && (
                <div className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                  {conv.unreadCount}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedConversation ? (
          <>
            <div className="bg-[#2c3035] p-4 border-b border-gray-700 sticky top-0 z-10">
              <h3 className="text-lg font-semibold">
                {conversations.find(c => c.id === selectedConversation)?.name}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] ${msg.isAdmin ? 'bg-[#2c3035]' : 'bg-green-500'} rounded-lg p-3`}>
                    <p>{msg.content}</p>
                    <span className="text-xs opacity-50 mt-1 block">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="bg-[#2c3035] p-4 border-t border-gray-700 sticky bottom-0 z-10">
              <div className="flex items-center bg-[#1e2329] rounded-lg">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 rounded-l-lg focus:outline-none bg-[#1e2329] text-white"
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded-r-lg">
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveChat;