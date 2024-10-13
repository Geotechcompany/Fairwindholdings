"use client"
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaPaperPlane } from 'react-icons/fa';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  isAdmin: boolean;
}

interface Conversation {
  userId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

function ChatManagement() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/chat/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        if (!selectedConversation && data.length > 0) {
          setSelectedConversation(data[0].userId);
        }
      } else {
        throw new Error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/admin/chat/messages/${conversationId}`);
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
    if (!message.trim() || !selectedConversation) return;

    try {
      const response = await fetch('/api/admin/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          userId: selectedConversation,
        }),
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

  if (isLoading) {
    return <div className="bg-[#1e2329] text-white flex h-full items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-[#1e2329] text-white flex h-full flex-col md:flex-row">
      {/* Conversations list */}
      <div className="w-full md:w-1/3 border-r border-gray-700 flex flex-col h-full">
        <div className="p-4 bg-[#1e2329] sticky top-0 z-10 border-b border-gray-700">
          <h2 className="text-xl font-bold mb-4">Conversations</h2>
        </div>
        <div className="overflow-y-auto flex-grow">
          {conversations.map((conv) => (
            <div
              key={conv.userId}
              className={`p-4 cursor-pointer ${
                selectedConversation === conv.userId ? 'bg-[#2c3035]' : 'hover:bg-[#2c3035]'
              }`}
              onClick={() => setSelectedConversation(conv.userId)}
            >
              <div className="flex items-center space-x-3">
                <Image
                  src={conv.profileImageUrl}
                  alt={`${conv.firstName} ${conv.lastName}`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{conv.firstName} {conv.lastName}</span>
                    <span className="text-sm text-gray-400">
                      {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedConversation ? (
          <>
            <div className="bg-[#2c3035] p-4 border-b border-gray-700 sticky top-0 z-10">
              <h2 className="text-xl font-bold">
                Chat with {conversations.find(c => c.userId === selectedConversation)?.firstName || 'User'}
              </h2>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.isAdmin ? 'bg-green-500 ml-auto' : 'bg-[#2c3035]'
                  } max-w-[70%]`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs text-gray-400 block mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="bg-[#2c3035] p-4 border-t border-gray-700 sticky bottom-0 z-10">
              <div className="flex items-center bg-[#1e2329] rounded-lg">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow bg-[#1e2329] text-white p-2 rounded-l-lg focus:outline-none"
                  placeholder="Type your reply..."
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded-r-lg"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatManagement;
