import React, { useState, useEffect, useMemo } from 'react';
import { PageType } from '../types';
import { 
  getStoredGoals, 
  getStoredCertificates, 
  getStoredSavedProjects, 
  getStoredActionTasks,
  downloadBackupFile
} from '../lib/storage';
import { careerRoadmaps, sampleInterviewQuestions } from '../data/initialData';
import { 
  Search, X, Home, LayoutDashboard, FileText, Compass, Map, MessageSquareCode, 
  FileEdit, Award, CheckCircle2, Settings, Info, Mail, Sparkles, User,
  Flame, Download, Zap, Layers, ArrowRight, CornerDownLeft
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentPage: (page: PageType) => void;
  toggleAIChat: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'AI Tools' | 'Your Goals' | 'Your Projects' | 'Your Certs' | 'Roadmaps' | 'Interview Questions' | 'Quick Actions';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setCurrentPage,
  toggleAIChat
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset search state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Dynamic search index constructed from all static & user data
  const allItems: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [
      // Navigation & Core Pages
      { id: 'nav-home', title: 'Home Page & Hero Overview', subtitle: 'Platform overview, stats, and feature hub', category: 'Navigation', icon: <Home className="w-4 h-4 text-cyan-400" />, action: () => setCurrentPage('home') },
      { id: 'nav-dashboard', title: 'Career Readiness Dashboard', subtitle: 'Scores, metrics, recent activity & progress', category: 'Navigation', icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" />, action: () => setCurrentPage('dashboard') },
      { id: 'nav-profile', title: 'Candidate Profile & Settings', subtitle: 'Target role, degree, skills, social links', category: 'Navigation', icon: <User className="w-4 h-4 text-cyan-300" />, action: () => setCurrentPage('profile') },
      
      // AI Intelligence Suite
      { id: 'nav-ai-chat', title: 'AI Career Chat Assistant', subtitle: 'Deep mentor conversation grounded in your resume', category: 'AI Tools', icon: <Sparkles className="w-4 h-4 text-cyan-400" />, action: () => setCurrentPage('ai-career-chat') },
      { id: 'nav-readiness', title: 'Job Readiness Analyzer', subtitle: '8-dimension profile audit and gap analysis', category: 'AI Tools', icon: <Award className="w-4 h-4 text-purple-400" />, action: () => setCurrentPage('job-readiness') },
      { id: 'nav-comparison', title: 'Career Path Comparison', subtitle: 'Compare 2-3 tech roles side-by-side', category: 'AI Tools', icon: <Compass className="w-4 h-4 text-pink-400" />, action: () => setCurrentPage('career-comparison') },
      { id: 'nav-project-gen', title: 'Project Idea Generator', subtitle: 'Production portfolio blueprints with architecture', category: 'AI Tools', icon: <Layers className="w-4 h-4 text-emerald-400" />, action: () => setCurrentPage('project-generator') },
      { id: 'nav-job-match', title: 'ATS Job Matcher & Scanner', subtitle: 'Paste LinkedIn job descriptions for keyword scoring', category: 'AI Tools', icon: <FileText className="w-4 h-4 text-cyan-300" />, action: () => setCurrentPage('job-matcher') },
      { id: 'nav-action-center', title: 'Career Action Center', subtitle: 'Daily priorities and weekly strategic milestones', category: 'AI Tools', icon: <Zap className="w-4 h-4 text-amber-400" />, action: () => setCurrentPage('action-center') },
      { id: 'nav-insights', title: 'Career & Market Insights', subtitle: 'Recruiter expectations, interview traps, trends', category: 'AI Tools', icon: <Info className="w-4 h-4 text-indigo-300" />, action: () => setCurrentPage('career-insights') },
      
      // Core Functional Modules
      { id: 'nav-resume-analyzer', title: 'AI Resume ATS Scanner', subtitle: 'Upload and audit resume for ATS optimization', category: 'AI Tools', icon: <FileText className="w-4 h-4 text-emerald-400" />, action: () => setCurrentPage('resume-analyzer') },
      { id: 'nav-skill-gap', title: 'Skill Gap Matrix', subtitle: 'Discover missing high-impact technical skills', category: 'AI Tools', icon: <Compass className="w-4 h-4 text-amber-400" />, action: () => setCurrentPage('skill-gap') },
      { id: 'nav-roadmap', title: 'Career Roadmaps (10 Tech Roles)', subtitle: 'Beginner to advanced milestone tracks', category: 'Navigation', icon: <Map className="w-4 h-4 text-purple-400" />, action: () => setCurrentPage('roadmap') },
      { id: 'nav-interview', title: 'AI Mock Interview Simulator', subtitle: 'Practice with instant scoring and feedback', category: 'AI Tools', icon: <MessageSquareCode className="w-4 h-4 text-pink-400" />, action: () => setCurrentPage('interview') },
      { id: 'nav-resume-builder', title: 'ATS Resume Builder', subtitle: 'Interactive editor with Print & PDF download', category: 'Navigation', icon: <FileEdit className="w-4 h-4 text-cyan-400" />, action: () => setCurrentPage('resume-builder') },
      { id: 'nav-goals', title: 'Goal Tracker & Milestones', subtitle: 'Daily & monthly career habits', category: 'Navigation', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, action: () => setCurrentPage('goals') },
      { id: 'nav-certs', title: 'Certificates Vault', subtitle: 'Verified certifications & progress tracking', category: 'Navigation', icon: <Award className="w-4 h-4 text-yellow-400" />, action: () => setCurrentPage('certificates') },
      { id: 'nav-settings', title: 'Settings & Data Backup', subtitle: 'Export/import data, theme, AMOLED mode', category: 'Navigation', icon: <Settings className="w-4 h-4 text-slate-400" />, action: () => setCurrentPage('settings') },
      { id: 'nav-about', title: 'About & Specifications', subtitle: 'Product overview, tech stack and release matrix', category: 'Navigation', icon: <Info className="w-4 h-4 text-cyan-400" />, action: () => setCurrentPage('about') },
      { id: 'nav-contact', title: 'Contact & Support', subtitle: 'Reach out for help or feedback', category: 'Navigation', icon: <Mail className="w-4 h-4 text-pink-400" />, action: () => setCurrentPage('contact') },
      
      // Quick Actions
      { id: 'act-export-backup', title: 'Export Full Career Backup (JSON)', subtitle: 'Download all user data locally', category: 'Quick Actions', icon: <Download className="w-4 h-4 text-cyan-400" />, action: () => downloadBackupFile() },
      { id: 'act-ask-aura', title: 'Open Floating Aura Chat', subtitle: 'Quick question overlay', category: 'Quick Actions', icon: <Sparkles className="w-4 h-4 text-indigo-400" />, action: () => toggleAIChat() }
    ];

    // Add user's stored goals
    try {
      const goals = getStoredGoals();
      goals.slice(0, 5).forEach((g) => {
        items.push({
          id: `goal-${g.id}`,
          title: `Goal: ${g.title}`,
          subtitle: `Category: ${g.category} • Target: ${g.targetDate} (${g.isCompleted ? 'Completed' : 'Pending'})`,
          category: 'Your Goals',
          icon: <CheckCircle2 className={`w-4 h-4 ${g.isCompleted ? 'text-emerald-400' : 'text-amber-400'}`} />,
          action: () => setCurrentPage('goals')
        });
      });
    } catch {}

    // Add user's stored certificates
    try {
      const certs = getStoredCertificates();
      certs.slice(0, 4).forEach((c) => {
        items.push({
          id: `cert-${c.id}`,
          title: `Certificate: ${c.title}`,
          subtitle: `Provider: ${c.provider} • Status: ${c.status}`,
          category: 'Your Certs',
          icon: <Award className="w-4 h-4 text-yellow-400" />,
          action: () => setCurrentPage('certificates')
        });
      });
    } catch {}

    // Add career roadmaps
    careerRoadmaps.forEach((r) => {
      items.push({
        id: `roadmap-${r.roleId}`,
        title: `Roadmap: ${r.roleTitle}`,
        subtitle: r.description,
        category: 'Roadmaps',
        icon: <Map className="w-4 h-4 text-purple-400" />,
        action: () => setCurrentPage('roadmap')
      });
    });

    // Add sample interview questions
    sampleInterviewQuestions.slice(0, 6).forEach((q) => {
      items.push({
        id: `q-${q.id}`,
        title: `Question: ${q.question}`,
        subtitle: `${q.category} • ${q.role} • Difficulty: ${q.difficulty}`,
        category: 'Interview Questions',
        icon: <MessageSquareCode className="w-4 h-4 text-pink-400" />,
        action: () => setCurrentPage('interview')
      });
    });

    return items;
  }, [setCurrentPage, toggleAIChat]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    const q = query.toLowerCase();
    return allItems.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    setQuery('');
    item.action();
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered.length > 0 && filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  };

  // Critical safeguard: do not render DOM or backdrop overlay if closed
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-10 sm:pt-20 px-3 sm:px-4 overflow-y-auto"
      onClick={onClose}
      id="command-palette-backdrop"
    >
      <div 
        id="modal-command-palette"
        className="w-full max-w-2xl bg-[#0c111e] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto sm:my-0 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/10 bg-white/[0.02]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search anything: 'Resume', 'React', 'Interview', 'Docker', 'Goal'..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            id="btn-close-command-palette"
            aria-label="Close search" 
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer touch-manipulation"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-2.5 space-y-1 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-300">No matching items found for "{query}"</p>
              <p className="text-xs text-slate-500">Try searching for role titles, interview topics, goals, or roadmaps.</p>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                id={`cmd-item-${item.id}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all group cursor-pointer touch-manipulation active:scale-[0.99] ${
                  idx === selectedIndex 
                    ? 'bg-cyan-500/15 border border-cyan-500/30' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pointer-events-none">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 group-hover:border-cyan-500/40">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 truncate">
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-white/10 text-slate-400 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-[10px] font-semibold text-cyan-400/80 group-hover:text-cyan-300 shrink-0 pl-2 pointer-events-none">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-300">⌘K</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-300">Ctrl+K</kbd>
            </span>
          </div>
          <span className="text-slate-500">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
