import React from 'react';
import { PageType } from '../types';
import { Sparkles, Heart, Shield, Cpu, Github, Twitter, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-[#07090e] border-t border-white/10 text-slate-400 pt-12 pb-8 mt-20 relative overflow-hidden">
      {/* Background Subtle Mesh Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-white font-['Syne']">AI CAREER MENTOR</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering your career journey with AI-driven guidance.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://github.com/kirubakaran-in08" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                title="S. Kirubakaran GitHub"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/kiruba-k-348766357" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                title="S. Kirubakaran LinkedIn"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">Core Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentPage('resume-analyzer')} className="hover:text-cyan-400 transition-colors">Resume AI Analyzer</button></li>
              <li><button onClick={() => setCurrentPage('skill-gap')} className="hover:text-cyan-400 transition-colors">Skill Gap Matrix</button></li>
              <li><button onClick={() => setCurrentPage('roadmap')} className="hover:text-cyan-400 transition-colors">AI Roadmap Generator</button></li>
              <li><button onClick={() => setCurrentPage('interview')} className="hover:text-cyan-400 transition-colors">AI Mock Interview Simulator</button></li>
              <li><button onClick={() => setCurrentPage('resume-builder')} className="hover:text-cyan-400 transition-colors">ATS Resume Builder</button></li>
            </ul>
          </div>

          {/* Trackers & Preferences */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">Trackers & Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-cyan-400 transition-colors">Career Dashboard</button></li>
              <li><button onClick={() => setCurrentPage('certificates')} className="hover:text-cyan-400 transition-colors">Certificate Vault</button></li>
              <li><button onClick={() => setCurrentPage('goals')} className="hover:text-cyan-400 transition-colors">Goal Tracker & Streaks</button></li>
              <li><button onClick={() => setCurrentPage('settings')} className="hover:text-cyan-400 transition-colors">App Preferences & Themes</button></li>
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-cyan-400 transition-colors">About AI Career Mentor</button></li>
            </ul>
          </div>

          {/* Platform Status & Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">System Architecture</h4>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>AI Backend: Google Gemini API</span>
              </div>
              <p className="text-[11px] text-slate-400">
                PWA App Shell cached for offline browsing • Internet required for AI analysis
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('contact')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact Developer
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} AI Career Mentor · Built by S. Kirubakaran</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-cyan-400" /> Powered by Google GenAI SDK</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-purple-400" /> Local-First Data Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
