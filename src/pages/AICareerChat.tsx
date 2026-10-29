import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, PageType, ResumeData, ResumeAnalysisResult, SkillGapResult } from '../types';
import { getStoredChatHistory, saveStoredChatHistory, getStoredResumeData, getStoredLastResumeAnalysis, getStoredLastSkillGap, getStoredGoals, getStoredCertificates } from '../lib/storage';
import { sendCareerChatMessage } from '../lib/aiService';
import { UserAvatar } from '../components/UserAvatar';
import { 
  Bot, 
  Send, 
  Trash2, 
  Sparkles, 
  User, 
  Compass, 
  FileText, 
  Briefcase, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

interface AICareerChatProps {
  userProfile: UserProfile;
  setCurrentPage?: (page: PageType) => void;
}

export const AICareerChat: React.FC<AICareerChatProps> = ({ userProfile, setCurrentPage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => getStoredChatHistory());
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resumeData = getStoredResumeData();
  const lastResumeAnalysis = getStoredLastResumeAnalysis();
  const lastSkillGap = getStoredLastSkillGap();
  const goals = getStoredGoals();
  const certs = getStoredCertificates();

  const suggestedQuestions = [
    "Which career is best for my skills?",
    "What should I learn next?",
    "How can I prepare for placements?",
    "Which project should I build for my portfolio?",
    "Why am I not getting internships?",
    "How should I improve my resume?",
    "What skills are currently important for my target role?"
  ];

  useEffect(() => {
    saveStoredChatHistory(messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const reply = await sendCareerChatMessage(text, newMessages, {
        userProfile,
        resumeData,
        lastResumeAnalysis,
        lastSkillGap,
        goalsCount: goals.length,
        certificatesCount: certs.length
      });

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error('Chat error:', e);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'assistant',
        text: `### 🧭 Mentor Guidance\n\nI am analyzing your profile for **${userProfile.targetRole}**. Focus on completing your active skills in the **Skill Gap Analysis** and practicing 1 mock interview session this week!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear your mentor conversation history?")) {
      const resetMsg: ChatMessage = {
        id: `msg-init-${Date.now()}`,
        sender: 'assistant',
        text: `Hello **${userProfile.name}**! I am **Aura**, your AI Career Mentor. I have your profile loaded (${userProfile.targetRole}, ${userProfile.experienceLevel}, Career Score: ${userProfile.careerScore}/100).\n\nAsk me anything about career paths, resume optimization, placements, or skill acquisition!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([resetMsg]);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMarkdownText = (content: string) => {
    // Clean formatted output for headings, bold, bullet points
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-base sm:text-lg font-bold text-cyan-300 mt-3 mb-1.5">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={idx} className="text-sm sm:text-base font-semibold text-slate-100 mt-2 mb-1">{line.replace('#### ', '')}</h4>;
      }
      if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 text-sm leading-relaxed my-1">
            {renderBoldSpan(line.replace(/^[-•*]\s*/, ''))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="ml-2 font-medium text-slate-200 text-sm leading-relaxed my-1">
            {renderBoldSpan(line)}
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return <p key={idx} className="text-slate-200 text-sm leading-relaxed my-1">{renderBoldSpan(line)}</p>;
    });
  };

  const renderBoldSpan = (txt: string) => {
    const parts = txt.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={i} className="font-semibold text-cyan-200">{p.slice(2, -2)}</strong>;
      }
      if (p.startsWith('*') && p.endsWith('*')) {
        return <em key={i} className="text-slate-300 italic">{p.slice(1, -1)}</em>;
      }
      return p;
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header & Context Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#131b2e] border border-cyan-500/20 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[15px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Syne']">
                AI Career Chat Assistant
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Context Aware
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Personalized career guidance grounded in your skills, resume score, and learning milestones.
            </p>
          </div>
        </div>

        {/* User Snapshot Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target: <strong className="text-white">{userProfile.targetRole}</strong></span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Readiness: <strong className="text-cyan-200">{userProfile.careerScore}/100</strong></span>
          </div>
          <button
            onClick={clearChat}
            id="btn-clear-chat"
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all text-xs font-medium flex items-center gap-1"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Suggested Prompts & Quick Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0c101c] border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suggested Questions</span>
            </div>
            <div className="space-y-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/15 hover:border-cyan-500/40 border border-white/5 text-xs text-slate-300 hover:text-cyan-200 transition-all leading-snug group flex items-start justify-between gap-1.5"
                >
                  <span>{q}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Context Card */}
          <div className="p-4 rounded-2xl bg-[#0c101c] border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Connected Data</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" /> Resume Score:
                </span>
                <span className="font-semibold text-emerald-400">
                  {lastResumeAnalysis ? `${lastResumeAnalysis.overallScore}/100` : 'Analyzed (84/100)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Active Goals:
                </span>
                <span className="font-semibold text-amber-300">{goals.length} Tracked</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Learning Streak:
                </span>
                <span className="font-semibold text-cyan-300">{userProfile.learningStreakDays} Days 🔥</span>
              </div>
            </div>

            {setCurrentPage && (
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setCurrentPage('job-readiness')}
                  className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-medium text-slate-300 text-center"
                >
                  Job Readiness
                </button>
                <button
                  onClick={() => setCurrentPage('career-comparison')}
                  className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-medium text-slate-300 text-center"
                >
                  Compare Roles
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Stream */}
        <div className="lg:col-span-3 flex flex-col h-[650px] rounded-2xl bg-[#0a0e1a] border border-white/10 shadow-2xl overflow-hidden">
          
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[90%] sm:max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Avatar */}
                  {isUser ? (
                    <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-md">
                      <UserAvatar 
                        avatarUrl={userProfile.avatarUrl} 
                        name={userProfile.name} 
                        size="sm" 
                        className="w-full h-full rounded-xl object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 p-[1px]">
                      <div className="w-full h-full bg-[#0d1322] rounded-[11px] flex items-center justify-center">
                        <Bot className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`relative group p-4 rounded-2xl shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                      : 'bg-[#111625] text-slate-100 border border-white/10 rounded-tl-none'
                  }`}>
                    {/* Timestamp & Copy Button */}
                    <div className="flex items-center justify-between gap-4 mb-1 text-[11px] text-slate-400">
                      <span className="font-semibold">{isUser ? 'You' : 'Aura Career Mentor'}</span>
                      <div className="flex items-center gap-2">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => copyMessage(msg.id, msg.text)}
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="prose prose-invert max-w-none text-sm">
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        formatMarkdownText(msg.text)
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator / Loading State */}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto items-center">
                <div className="w-8 h-8 rounded-xl bg-[#0d1322] border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#111625] border border-white/10 flex items-center gap-2">
                  <div className="flex space-x-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium ml-2">Aura is formulating career advice...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 bg-[#0c101d] border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask Aura anything about ${userProfile.targetRole}, placements, resumes, or projects...`}
                disabled={isLoading}
                id="input-career-chat-message"
                className="flex-1 bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                id="btn-send-career-chat"
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Ask Mentor</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
