import React, { useState, useEffect, useRef } from 'react';
import { PageType } from '../types';
import { generateRealUserNotifications } from '../lib/storage';
import { Bell, CheckCheck, Sparkles, Flame, Target, Award, MessageSquareCode, FileText, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface NotificationCenterProps {
  setCurrentPage: (page: PageType) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('aicm_read_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifications = generateRealUserNotifications();

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    localStorage.setItem('aicm_read_notifications', JSON.stringify(allIds));
  };

  const handleNotificationClick = (id: string, targetPage: string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      localStorage.setItem('aicm_read_notifications', JSON.stringify(updated));
    }
    setIsOpen(false);
    setCurrentPage(targetPage as PageType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'goal':
        return <Target className="w-4 h-4 text-purple-400" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-emerald-400" />;
      case 'interview':
        return <MessageSquareCode className="w-4 h-4 text-cyan-400" />;
      case 'task':
        return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="btn-notification-center-toggle"
        aria-label="Open notifications center"
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-cyan-500 text-black text-[10px] font-black flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          id="popover-notification-center"
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0d121f] border border-cyan-500/30 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-['Syne']">
                Career Action Alerts
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 p-1.5 space-y-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active notifications right now.
              </div>
            ) : (
              notifications.map((item) => {
                const isRead = readIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item.id, item.targetPage)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 text-left ${
                      isRead
                        ? 'bg-transparent hover:bg-white/5 opacity-70 hover:opacity-100'
                        : 'bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-500/20'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-white/5 shrink-0 mt-0.5">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{item.timeAgo}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                        {item.message}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-2" />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-black/40 border-t border-white/5 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                setCurrentPage('action-center');
              }}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Open Full Action Center →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
