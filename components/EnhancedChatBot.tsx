"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  Calendar,
  DollarSign,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
  quickReplies?: string[];
}

interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  budget?: string;
  eventDate?: string;
  message?: string;
}

const FAQ_QUICK_REPLIES = [
  "Pricing information",
  "Wedding packages",
  "Portrait sessions",
  "Check availability",
  "What to expect",
  "Book a consultation",
];

const SERVICE_ICONS: Record<string, typeof Camera> = {
  wedding: Camera,
  portrait: Camera,
  event: Calendar,
  commercial: DollarSign,
};

export default function EnhancedChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [leadData, setLeadData] = useState<LeadData>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showFAQ, setShowFAQ] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      addBotMessage(
        "Hi! 👋 I'm here to help you with your photography needs at Studio37.\n\nWhat can I help you with today?",
        FAQ_QUICK_REPLIES
      );
    }
  };

  const addBotMessage = (text: string, quickReplies?: string[]) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
      quickReplies,
    };
    setMessages((prev) => [...prev, botMessage]);
    setShowFAQ(false);
  };

  const addUserMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  const handleAIResponse = async (userMessage: string) => {
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: messages
            .slice(-4)
            .map((m) => `${m.sender}: ${m.text}`)
            .join("\n"),
          leadData,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // Update lead data with detected info
        if (data.detectedInfo) {
          setLeadData((prev) => ({ ...prev, ...data.detectedInfo }));
        }

        // Determine quick replies based on conversation
        let quickReplies: string[] | undefined;
        if (!leadData.service && !data.detectedInfo?.service) {
          quickReplies = ["Wedding", "Portrait", "Event", "Commercial"];
        } else if (!leadData.email) {
          quickReplies = ["Book a consultation", "Tell me more"];
        }

        addBotMessage(data.response, quickReplies);
      } else {
        // Fallback response
        addBotMessage(
          "I'm here to help! Our team can answer any questions. Would you like to book a consultation or learn about our services?",
          ["Book consultation", "View services", "Pricing info"]
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      addBotMessage(
        "Let me connect you with our team. What's the best way to reach you?",
        ["Share email", "Share phone"]
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addUserMessage(userMessage);
    setInputValue("");

    // If message contains contact info, try to save lead
    const emailMatch = userMessage.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = userMessage.match(/(\d{3}[-.]?\d{3}[-.]?\d{4})/);

    if (emailMatch || phoneMatch || leadData.email || leadData.phone) {
      await saveLead({
        ...leadData,
        email: emailMatch?.[0] || leadData.email,
        phone: phoneMatch?.[1] || leadData.phone,
        message: userMessage,
      });
    }

    await handleAIResponse(userMessage);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    // Auto-submit
    setTimeout(() => {
      const form = document.getElementById("chat-form") as HTMLFormElement;
      form?.requestSubmit();
    }, 100);
  };

  const saveLead = async (data: LeadData) => {
    try {
      const { supabase } = await import("@/lib/supabase");

      await supabase.from("leads").insert([
        {
          name: data.name || "Chat Lead",
          email: data.email,
          phone: data.phone,
          service_interest: data.service,
          budget_range: data.budget,
          message: data.message || `Event date: ${data.eventDate || "TBD"}`,
          source: "chatbot",
          status: "new",
        },
      ]);
    } catch (error) {
      console.error("Error saving lead:", error);
    }
  };

  return (
    <>
      {/* Chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={startChat}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all z-50 group"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Sparkles className="h-6 w-6" />
                  <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 bg-green-400 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="font-semibold">Studio37 Assistant</h3>
                  <p className="text-xs text-purple-100">
                    AI-powered • Always here to help
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Lead info banner */}
            {(leadData.service || leadData.email) && (
              <div className="bg-purple-50 px-4 py-2 border-b border-purple-100 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  {leadData.service && (
                    <span className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full">
                      {leadData.service}
                    </span>
                  )}
                  {leadData.budget && (
                    <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full">
                      {leadData.budget}
                    </span>
                  )}
                  {leadData.email && (
                    <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full truncate max-w-[150px]">
                      {leadData.email}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-white text-gray-800 shadow-sm border border-gray-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">
                        {message.text}
                      </p>
                    </div>
                  </div>

                  {/* Quick replies */}
                  {message.quickReplies && message.sender === "bot" && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-1">
                      {message.quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1.5 bg-white hover:bg-purple-50 border border-purple-200 text-purple-700 rounded-full text-xs font-medium transition-colors shadow-sm"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      <span
                        className="h-2 w-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="h-2 w-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="h-2 w-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              id="chat-form"
              onSubmit={handleSubmit}
              className="p-4 bg-white border-t"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTyping ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
