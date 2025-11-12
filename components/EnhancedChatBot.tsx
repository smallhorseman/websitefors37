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
  budgetInquiry?: boolean;
  eventDate?: string;
  intent?: string;
  message?: string;
}

const FAQ_QUICK_REPLIES = [
  "Wedding packages",
  "Portrait sessions",
  "Event coverage",
  "View portfolio",
  "Check availability",
  "Get pricing",
];

const SERVICE_ICONS: Record<string, typeof Camera> = {
  wedding: Camera,
  portrait: Camera,
  event: Calendar,
  commercial: DollarSign,
};

// Helper to render text with clickable links
function renderMessageWithLinks(text: string) {
  // Match markdown-style links [text](url) and plain URLs
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const urlRegex = /(https?:\/\/[^\s]+)/g
  
  let lastIndex = 0
  const parts: React.ReactNode[] = []
  
  // First, process markdown-style links
  const textWithMarkers = text.replace(markdownLinkRegex, (full, linkText, url) => {
    return `___MARKDOWN_LINK___${linkText}|||${url}___END_LINK___`
  })
  
  // Split by markers and process each part
  const segments = textWithMarkers.split(/___MARKDOWN_LINK___|___END_LINK___/)
  
  segments.forEach((segment, index) => {
    if (segment.includes('|||')) {
      // This is a markdown link
      const [linkText, url] = segment.split('|||')
      parts.push(
        <a
          key={`link-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 underline hover:text-purple-800 font-medium"
        >
          {linkText}
        </a>
      )
    } else {
      // Process plain URLs in this segment
      const urlParts = segment.split(urlRegex)
      urlParts.forEach((part, i) => {
        if (urlRegex.test(part)) {
          parts.push(
            <a
              key={`url-${index}-${i}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 underline hover:text-purple-800 font-medium"
            >
              {part}
            </a>
          )
        } else if (part) {
          parts.push(<span key={`text-${index}-${i}`}>{part}</span>)
        }
      })
    }
  })
  
  return parts.length > 0 ? parts : text
}

export default function EnhancedChatBot() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [leadData, setLeadData] = useState<LeadData>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showFAQ, setShowFAQ] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Avoid hydration issues by only rendering after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hide chatbot entirely on admin pages (e.g., page builder)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname || "";
      if (path.startsWith("/admin")) {
        // Ensure chat is closed if previously opened
        setIsOpen(false);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Don't render until mounted client-side
  if (!isMounted) {
    return null;
  }

  // Do not render on admin routes
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return null;
  }

  const startChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      addBotMessage(
        "Hi! 👋 I'm the Studio37 AI assistant. I'm here to help you find the perfect photography package.\n\nWhat brings you here today?",
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
            .slice(-8) // Increased from 4 to 8 for better context
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

        // Determine quick replies based on conversation state and detected info
        let quickReplies: string[] | undefined;
        
        if (data.detectedInfo?.intent === 'booking' && !leadData.email) {
          quickReplies = ["Share my email", "Call me instead", "Check calendar"];
        } else if (data.detectedInfo?.intent === 'pricing' && !leadData.service) {
          quickReplies = ["Wedding packages", "Portrait pricing", "Event rates"];
        } else if (!leadData.service && !data.detectedInfo?.service) {
          quickReplies = ["Wedding", "Portrait", "Event", "Commercial"];
        } else if (leadData.service && !leadData.email && !leadData.phone) {
          quickReplies = ["Get a quote", "See portfolio", "Book consultation"];
        } else if ((leadData.email || leadData.phone) && !leadData.eventDate) {
          quickReplies = ["Schedule in next 3 months", "Later this year", "Just browsing"];
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

      // Build detailed message from conversation context
      const conversationSummary = messages
        .slice(-6)
        .map(m => `[${m.sender}] ${m.text}`)
        .join("\n");

      await supabase.from("leads").insert([
        {
          name: data.name || "Chat Lead",
          email: data.email,
          phone: data.phone,
          service_interest: data.service,
          budget_range: data.budget,
          message: data.message 
            ? `${data.message}\n\nEvent date: ${data.eventDate || "TBD"}\nIntent: ${data.intent || "general inquiry"}\n\n--- Conversation ---\n${conversationSummary}`
            : `Event date: ${data.eventDate || "TBD"}\nIntent: ${data.intent || "general inquiry"}\n\n--- Conversation ---\n${conversationSummary}`,
          source: "chatbot",
          status: "new",
        },
      ]);
      
      console.log("Lead saved successfully");
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
            {(leadData.service || leadData.email || leadData.name || leadData.intent) && (
              <div className="bg-purple-50 px-4 py-2 border-b border-purple-100 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  {leadData.name && (
                    <span className="px-2 py-0.5 bg-indigo-200 text-indigo-800 rounded-full font-medium">
                      {leadData.name}
                    </span>
                  )}
                  {leadData.service && (
                    <span className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full">
                      {leadData.service}
                    </span>
                  )}
                  {leadData.intent && (
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full">
                      {leadData.intent === 'booking' ? '📅 Wants to book' : 
                       leadData.intent === 'pricing' ? '💰 Pricing info' :
                       leadData.intent === 'portfolio' ? '🖼️ Viewing work' : leadData.intent}
                    </span>
                  )}
                  {leadData.budget && (
                    <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full">
                      {leadData.budget}
                    </span>
                  )}
                  {leadData.eventDate && (
                    <span className="px-2 py-0.5 bg-pink-200 text-pink-800 rounded-full">
                      {leadData.eventDate}
                    </span>
                  )}
                  {leadData.email && (
                    <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full truncate max-w-[150px]">
                      ✉️ {leadData.email}
                    </span>
                  )}
                  {leadData.phone && (
                    <span className="px-2 py-0.5 bg-teal-200 text-teal-800 rounded-full">
                      📞 {leadData.phone}
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
