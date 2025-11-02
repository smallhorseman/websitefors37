"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Sparkles,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  MessageSquare,
  Brain,
} from "lucide-react";

interface TrainingExample {
  id: string;
  question: string;
  answer: string;
  category: string;
  created_at: string;
}

interface ChatbotSettings {
  personality: string;
  tone: string;
  greeting_message: string;
  fallback_message: string;
  system_instructions: string;
}

export default function ChatbotTrainingPage() {
  const [trainingExamples, setTrainingExamples] = useState<TrainingExample[]>(
    []
  );
  const [settings, setSettings] = useState<ChatbotSettings>({
    personality: "friendly",
    tone: "professional",
    greeting_message:
      "Hi! 👋 I'm here to help you with your photography needs at Studio37.\n\nWhat can I help you with today?",
    fallback_message:
      "I'm here to help! Our team can answer any questions. Would you like to book a consultation or learn about our services?",
    system_instructions:
      "You are a friendly customer service assistant for Studio37 Photography in Pinehurst, TX.",
  });
  const [newExample, setNewExample] = useState({
    question: "",
    answer: "",
    category: "general",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const categories = [
    "general",
    "pricing",
    "services",
    "booking",
    "packages",
    "availability",
    "portfolio",
    "contact",
  ];

  const personalityOptions = [
    { value: "friendly", label: "Friendly & Warm" },
    { value: "professional", label: "Professional & Formal" },
    { value: "casual", label: "Casual & Relaxed" },
    { value: "enthusiastic", label: "Enthusiastic & Energetic" },
  ];

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "conversational", label: "Conversational" },
    { value: "helpful", label: "Helpful" },
    { value: "concise", label: "Concise" },
  ];

  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    setLoading(true);

    try {
      // Load training examples
      const { data: examples, error: examplesError } = await supabase
        .from("chatbot_training")
        .select("*")
        .order("created_at", { ascending: false });

      if (examplesError) throw examplesError;
      setTrainingExamples(examples || []);

      // Load settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("chatbot_settings")
        .select("*")
        .single();

      if (settingsData) {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error("Error loading training data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTrainingExample = async () => {
    if (!newExample.question.trim() || !newExample.answer.trim()) {
      setMessage("Please fill in both question and answer");
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await supabase
        .from("chatbot_training")
        .insert([newExample])
        .select()
        .single();

      if (error) throw error;

      setTrainingExamples([data, ...trainingExamples]);
      setNewExample({ question: "", answer: "", category: "general" });
      setMessage("Training example added successfully! ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error adding example:", error);
      setMessage("Error adding example ❌");
    } finally {
      setSaving(false);
    }
  };

  const deleteExample = async (id: string) => {
    try {
      const { error } = await supabase
        .from("chatbot_training")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTrainingExamples(trainingExamples.filter((ex) => ex.id !== id));
      setMessage("Example deleted ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting example:", error);
      setMessage("Error deleting example ❌");
    }
  };

  const saveSettings = async () => {
    setSaving(true);

    try {
      const { error } = await supabase
        .from("chatbot_settings")
        .upsert([settings]);

      if (error) throw error;

      setMessage("Settings saved successfully! ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("Error saving settings ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              AI Chatbot Training
            </h1>
          </div>
          <p className="text-gray-600">
            Train your chatbot with custom Q&A pairs and configure its
            personality
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("❌")
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Settings Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Chatbot Personality
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personality Style
              </label>
              <select
                value={settings.personality}
                onChange={(e) =>
                  setSettings({ ...settings, personality: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {personalityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Tone
              </label>
              <select
                value={settings.tone}
                onChange={(e) =>
                  setSettings({ ...settings, tone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {toneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Greeting Message
              </label>
              <textarea
                value={settings.greeting_message}
                onChange={(e) =>
                  setSettings({ ...settings, greeting_message: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="First message users see..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fallback Message
              </label>
              <textarea
                value={settings.fallback_message}
                onChange={(e) =>
                  setSettings({ ...settings, fallback_message: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="When AI can't understand..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Instructions
              </label>
              <textarea
                value={settings.system_instructions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    system_instructions: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tell the AI who it is and how to behave..."
              />
            </div>
          </div>

          <button
            onClick={saveSettings}
            disabled={saving}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {/* Add Training Example */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Add Training Example
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newExample.category}
                onChange={(e) =>
                  setNewExample({ ...newExample, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question / User Input
              </label>
              <input
                type="text"
                value={newExample.question}
                onChange={(e) =>
                  setNewExample({ ...newExample, question: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder='e.g., "How much do wedding packages cost?"'
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer / Bot Response
              </label>
              <textarea
                value={newExample.answer}
                onChange={(e) =>
                  setNewExample({ ...newExample, answer: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="The bot's response to this question..."
              />
            </div>

            <button
              onClick={addTrainingExample}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {saving ? "Adding..." : "Add Example"}
            </button>
          </div>
        </div>

        {/* Training Examples List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Training Examples ({trainingExamples.length})
              </h2>
            </div>
            <button
              onClick={loadTrainingData}
              disabled={loading}
              className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading training data...
            </div>
          ) : trainingExamples.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No training examples yet. Add your first one above! 👆
            </div>
          ) : (
            <div className="space-y-4">
              {trainingExamples.map((example) => (
                <div
                  key={example.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {example.category}
                    </span>
                    <button
                      onClick={() => deleteExample(example.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        QUESTION:
                      </div>
                      <div className="text-gray-900">{example.question}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        ANSWER:
                      </div>
                      <div className="text-gray-700">{example.answer}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Added {new Date(example.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Brain className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                How Training Works
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  ✨ Training examples help the AI understand your business
                  better
                </li>
                <li>
                  🎯 The AI uses these examples as context when answering
                  similar questions
                </li>
                <li>💡 More examples = smarter, more accurate responses</li>
                <li>🔄 Changes take effect immediately after saving</li>
                <li>
                  📊 Best practice: Add 10-20 examples covering common questions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
