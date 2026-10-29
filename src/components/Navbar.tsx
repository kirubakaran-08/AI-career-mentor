import React, { useState, useRef, useEffect } from 'react';
import { PageType, UserProfile } from '../types';
import { NotificationCenter } from './NotificationCenter';
import { UserAvatar } from './UserAvatar';
import { 
  Sparkles, 
  Search, 
  Bot, 
  Download, 
  Menu, 
  X, 
  LayoutDashboard, 
  FileText, 
  Compass, 
  Map, 
  MessageSquareCode, 
  FileEdit, 
  Award, 
  CheckCircle2, 
  Settings as SettingsIcon, 
  Info, 
  Mail,
  Home,
  ChevronDown,
  GitCompare,
  Gauge,
  Layers,
  FileCheck,
  Zap,
  TrendingUp,
  User
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  userProfile: UserProfile;
  toggleAIChat: () => void;
  openCommandPalette: () => void;
  showPWAInstallPrompt: boolean;
  onInstallPWA: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  userProfile,
  toggleAIChat,
  openCommandPalette,
  showPWAInstallPrompt,
  onInstallPWA,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const aiDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aiDropdownRef.current && !aiDropdownRef.current.contains(event.target as Node)) {
        setAiMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const aiIntelligenceItems: { id: PageType; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'ai-career-chat', label: 'AI Career Chat', desc: 'Personalized mentor conversation', icon: <Bot className="w-4 h-4 text-cyan-400" /> },
    { id: 'job-readiness', label: 'Job Readiness', desc: '8-dimension profile audit', icon: <Gauge className="w-4 h-4 text-purple-400" /> },
    { id: 'career-comparison', label: 'Career Comparison', desc: 'Compare 2–3 tech roles', icon: <GitCompare className="w-4 h-4 text-pink-400" /> },
    { id: 'project-generator', label: 'Project Generator', desc: 'Standout portfolio blueprints', icon: <Layers className="w-4 h-4 text-emerald-400" /> },
    { id: 'job-matcher', label: 'ATS Job Matcher', desc: 'Job description keyword scanner', icon: <FileCheck className="w-4 h-4 text-cyan-300" /> },
    { id: 'action-center', label: 'Action Center', desc: 'Today & weekly tasks', icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { id: 'career-insights', label: 'Career Insights', desc: 'Hiring trends & interview traps', icon: <TrendingUp className="w-4 h-4 text-indigo-300" /> },
  ];

  const mainNavItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'resume-analyzer', label: 'Resume AI', icon: <FileText className="w-4 h-4" /> },
    { id: 'skill-gap', label: 'Skill Gap', icon: <Compass className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Roadmaps', icon: <Map className="w-4 h-4" /> },
    { id: 'interview', label: 'Interview', icon: <MessageSquareCode className="w-4 h-4" /> },
    { id: 'resume-builder', label: 'Builder', icon: <FileEdit className="w-4 h-4" /> },
    { id: 'goals', label: 'Goals', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const secondaryNavItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  const isAiIntelligenceActive = aiIntelligenceItems.some(item => item.id === currentPage);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setAiMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0a0d14]/85 border-b border-white/10 transition-all duration-300 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Startup Identity */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('home')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d121f] rounded-[15px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-['Syne']">
                  AI CAREER
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Mentor
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Main Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavItems.slice(0, 2).map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* AI Intelligence Dropdown Button */}
            <div className="relative" ref={aiDropdownRef}>
              <button
                onClick={() => setAiMenuOpen(!aiMenuOpen)}
                id="btn-nav-ai-intelligence-menu"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isAiIntelligenceActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                <span>AI Intelligence</span>
                <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  7
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${aiMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Panel */}
              {aiMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-[#0c101d] border border-cyan-500/30 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400 border-b border-white/5 mb-1 font-['Syne']">
                    AI Career Intelligence Suite
                  </div>
                  <div className="space-y-0.5">
                    {aiIntelligenceItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => navigateTo(item.id)}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                          currentPage === item.id 
                            ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30' 
                            : 'hover:bg-white/5 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-white/5 shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {mainNavItems.slice(2).map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools (Search, Notifications, PWA, AI Chat, Profile) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick Command Palette Search */}
            <button
              onClick={openCommandPalette}
              id="btn-quick-search"
              aria-label="Open command palette search"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-white text-xs font-medium transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded text-slate-300">⌘K</kbd>
            </button>

            <button
              onClick={openCommandPalette}
              id="btn-quick-search-mobile"
              aria-label="Open command palette search"
              className="sm:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer touch-manipulation"
            >
              <Search className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Notification Center */}
            <NotificationCenter setCurrentPage={setCurrentPage} />

            {/* PWA Install Button */}
            {showPWAInstallPrompt && (
              <button
                onClick={onInstallPWA}
                id="btn-pwa-install-nav"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition-all shadow-md shadow-emerald-500/10 animate-pulse"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {/* AI Assistant Floating Chat Toggle */}
            <button
              onClick={toggleAIChat}
              id="btn-toggle-ai-chat"
              className="relative flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-100" />
              <span className="hidden xs:inline">Ask AI</span>
            </button>

            {/* User Profile Thumbnail */}
            <button
              onClick={() => navigateTo('profile')}
              id="btn-user-avatar-nav"
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-cyan-500/30 hover:ring-cyan-400 transition-all overflow-hidden bg-slate-800 shrink-0 flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
              title={userProfile.name ? `${userProfile.name} - Career Profile` : 'Career Profile'}
            >
              <UserAvatar 
                avatarUrl={userProfile.avatarUrl} 
                name={userProfile.name || 'Candidate'} 
                size="sm" 
                className="w-full h-full rounded-full object-cover" 
              />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="btn-mobile-menu-toggle"
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0d121f]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Mobile Search Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openCommandPalette();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Search modules, roadmaps, goals...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 rounded font-mono">⌘K</kbd>
          </button>

          {/* AI Intelligence Suite Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block px-1 font-['Syne']">
              AI Career Intelligence Suite
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {aiIntelligenceItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === item.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Navigation Items */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 font-['Syne']">
              Core Modules
            </span>
            <div className="grid grid-cols-2 gap-2">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Items (Profile, Settings, About, Contact) */}
          <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
            {secondaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium ${
                  currentPage === item.id ? 'bg-white/10 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
