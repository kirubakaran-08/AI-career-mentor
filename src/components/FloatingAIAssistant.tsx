import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { getStoredChatHistory, saveStoredChatHistory } from '../lib/storage';
import { UserAvatar } from './UserAvatar';
import { Bot, X, Send, Sparkles, User, RefreshCw, Maximize2, Minimize2, Lightbulb } from 'lucide-react';

interface FloatingAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({ isOpen, onClose, userProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(getStoredChatHistory());
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveStoredChatHistory(messages);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      // Prepare history format
      const history = newMessages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, history, userProfile })
      });

      const data = await res.json();
      const botReply = data.text || data.fallbackText || "Keep focusing on building projects and practicing core technical principles!";

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "I am currently synthesizing recommendations offline. Key Tip: Structure your resume achievements with action verbs + quantitative metrics (e.g., 'Reduced response latency by 40%').",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const initial: ChatMessage[] = [
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: "Chat cleared. I am Aura, your AI Career Mentor. What would you like to discuss?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(initial);
  };

  const quickPrompts = [
    "How to pass ATS resume filters?",
    "Roadmap for Full Stack Developer",
    "Top 5 AI Engineer interview questions",
    "How to write impact statements on resume?"
  ];

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        expanded
          ? 'inset-2 sm:inset-6 md:inset-10'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px]'
      }`}
    >
      <div className="w-full h-full bg-[#0d121f]/95 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 backdrop-blur-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-950/80 via-[#0d121f] to-purple-950/80 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white font-['Syne']">Aura</span>
                <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">AI Mentor</span>
              </div>
              <p className="text-[10px] text-slate-400">Powered by Google Gemini API</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Clear chat history"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors hidden sm:block"
              title={expanded ? "Minimize" : "Expand"}
            >
              {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.sender === 'user' ? (
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 shadow-sm">
                  <UserAvatar 
                    avatarUrl={userProfile?.avatarUrl} 
                    name={userProfile?.name} 
                    size="xs" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.text}
                <div className={`text-[9px] mt-1 opacity-60 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs italic bg-white/5 p-2.5 rounded-xl border border-white/10 w-fit animate-pulse">
              <Bot className="w-3.5 h-3.5 animate-spin" />
              <span>Aura is typing response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-3 py-2 bg-white/[0.02] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-[10px] text-slate-300 whitespace-nowrap transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-3 bg-[#0a0d14] border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Aura about resumes, skills, roadmaps..."
            className="flex-1 bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 text-white transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
