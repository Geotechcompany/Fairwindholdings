"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { FaPaperPlane, FaSearch } from "react-icons/fa";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/admin/chat/conversations");
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
          if (!selectedConversation && data.length > 0) {
            setSelectedConversation(data[0].userId);
          }
        } else {
          throw new Error("Failed to fetch conversations");
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/admin/chat/messages/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        throw new Error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;

    try {
      const response = await fetch("/api/admin/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
          userId: selectedConversation,
        }),
      });

      if (response.ok) {
        setMessage("");
        fetchMessages(selectedConversation);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredConversations = conversations.filter((conv) =>
    `${conv.firstName} ${conv.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="bg-[#1e2329] text-white flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e2329] text-white flex h-full flex-col md:flex-row">
      {/* Conversations list */}
      <div className="w-full md:w-1/3 border-r border-gray-700 flex flex-col h-full">
        <div className="p-4 bg-[#2c3035] sticky top-0 z-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#3a3f45] p-2 pl-8 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto flex-grow">
          <AnimatePresence>
            {filteredConversations.map((conv) => (
              <motion.div
                key={conv.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedConversation(conv.userId)}
                className={`flex items-center p-4 cursor-pointer hover:bg-[#3a3f45] transition-colors duration-200 ${
                  selectedConversation === conv.userId ? "bg-[#3a3f45]" : ""
                }`}
              >
                <Image
                  src={conv.profileImageUrl}
                  alt={`${conv.firstName} ${conv.lastName}`}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{`${conv.firstName} ${conv.lastName}`}</h3>
                  <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                </div>
                <div className="text-xs text-gray-400">{new Date(conv.timestamp).toLocaleTimeString()}</div>
                {conv.unread && (
                  <div className="ml-2 bg-blue-500 rounded-full w-3 h-3"></div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedConversation ? (
          <>
            <div className="bg-[#2c3035] p-4 sticky top-0 z-10 flex items-center">
              <Image
                src={conversations.find((c) => c.userId === selectedConversation)?.profileImageUrl || ""}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <h3 className="text-lg font-semibold">
                {`${
                  conversations.find((c) => c.userId === selectedConversation)?.firstName
                } ${
                  conversations.find((c) => c.userId === selectedConversation)?.lastName
                }`}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.isAdmin
                          ? "bg-blue-500 text-white"
                          : "bg-[#3a3f45] text-white"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span className="text-xs opacity-50 mt-1 block">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSendMessage}
              className="bg-[#2c3035] p-4 sticky bottom-0 z-10"
            >
              <div className="flex items-center bg-[#3a3f45] rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-transparent p-3 text-white focus:outline-none"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-3 hover:bg-blue-600 transition-colors duration-200"
                >
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

export default ChatManagement;