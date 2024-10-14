"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaPaperPlane } from "react-icons/fa";
import Image from "next/image";

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
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

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
      const fetchMessages = async (conversationId: string) => {
        try {
          const response = await fetch(
            `/api/admin/chat/messages/${conversationId}`
          );
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

      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

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

  if (isLoading) {
    return (
      <div className="bg-[#1e2329] text-white flex h-full items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#1e2329] text-white flex h-full flex-col md:flex-row">
      {/* Conversations list */}
      <div className="w-full md:w-1/3 border-r border-gray-700 flex flex-col h-full">
        {conversations.map((conv) => (
          <div
            key={conv.userId}
            onClick={() => setSelectedConversation(conv.userId)}
            className={`p-4 cursor-pointer ${
              selectedConversation === conv.userId ? "bg-[#3a3f45]" : ""
            }`}
          >
            <h3>{`${conv.firstName} ${conv.lastName}`}</h3>
            <p className="text-sm text-gray-400">{conv.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${msg.isAdmin ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`inline-block p-2 rounded ${
                      msg.isAdmin ? "bg-blue-500" : "bg-gray-700"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleSendMessage}
              className="bg-[#2c3035] p-4 border-t border-gray-700"
            >
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-[#1e2329] text-white p-2 rounded-l"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-r"
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
