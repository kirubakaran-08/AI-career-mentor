import React from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  CheckCircle, 
  ExternalLink,
  BookOpen,
  Map,
  FileText,
  MessageSquare,
  Award,
  Layers,
  Github,
  Linkedin,
  Mail,
  Lock
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
          <span>About AI Career Mentor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne'] tracking-tight">
          AI Career Mentor
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
          An AI-assisted career mentoring web application designed to help technology students, freshers, and job seekers evaluate technical readiness through resume feedback, skill-gap identification, structured learning roadmaps, and mock interview practice.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium">
            Open Source Web App
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium">
            Google Gemini API Powered
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
            Local-First Browser Storage
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 font-medium">
            PWA App Shell
          </span>
        </div>
      </div>

      {/* Core Application Capabilities */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white font-['Syne']">Core Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
              <FileText className="w-4 h-4" />
              <span>Resume Analysis & Job Matching</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Provides constructive formatting and keyword feedback on technical resumes, comparing candidate experience against industry job descriptions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
              <Map className="w-4 h-4" />
              <span>Curated Learning Roadmaps</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Presents structured topic roadmaps across 10 technology domains (Full Stack, AI/ML, Cloud, DevOps, Cyber Security) from foundational to advanced milestones.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <MessageSquare className="w-4 h-4" />
              <span>Interactive Mock Interviews</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Simulates technical and behavioral interview questions with multi-turn responses and AI-assisted qualitative feedback on structure and accuracy.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <Award className="w-4 h-4" />
              <span>Skill Diagnostics & Project Ideas</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Identifies missing competencies for target roles, benchmarks career tracks, and generates portfolio-ready project specifications.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Technology Stack */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white font-['Syne']">Verified Technology Stack</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Frontend Core</span>
            <h3 className="text-sm font-bold text-white">React 19 & TypeScript</h3>
            <p className="text-[11px] text-slate-400 leading-snug">Strict TypeScript type safety, custom hooks, and modular component architecture.</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Styling & UI</span>
            <h3 className="text-sm font-bold text-white">Tailwind CSS v4</h3>
            <p className="text-[11px] text-slate-400 leading-snug">Utility-first dark theme, responsive grid layouts, and Lucide icons.</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Server Proxy</span>
            <h3 className="text-sm font-bold text-white">Node.js & Express</h3>
            <p className="text-[11px] text-slate-400 leading-snug">Express backend proxying AI queries on port 3000 with rate limiting and request validation.</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">AI Integration</span>
            <h3 className="text-sm font-bold text-white">Google GenAI SDK</h3>
            <p className="text-[11px] text-slate-400 leading-snug">Google Gemini API integration with server-side API key protection and fallback handling.</p>
          </div>
        </div>
      </div>

      {/* Privacy, Data Storage & Limitations */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white font-['Syne']">Privacy & Service Architecture</h2>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">Local-First Storage:</strong> Your personal user profile, certificates, goals, and saved resume data are stored directly in your browser's LocalStorage. No user database is maintained on the server.
          </p>
          <p>
            <strong className="text-white">AI Processing:</strong> When an AI feature is requested (such as resume analysis, skill-gap evaluation, or interview feedback), the submitted text is securely proxied through the backend to the Google Gemini API. No credentials or API keys are ever exposed to the client.
          </p>
          <p>
            <strong className="text-white">Offline Scope:</strong> The Progressive Web App (PWA) caches the application shell and static content for offline navigation. An active internet connection and configured API key are required to run live AI evaluations.
          </p>
        </div>
      </div>

      {/* Discreet Creator Credit */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-bold text-white text-sm">
            Created by S. Kirubakaran
          </div>
          <p className="text-slate-400 text-[11px]">
            AI Career Mentor is maintained as an open-source educational project.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a 
            href="https://github.com/kirubakaran-in08" 
            target="_blank" 
            rel="noopener noreferrer"
            id="btn-about-github"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a 
            href="https://www.linkedin.com/in/kiruba-k-348766357" 
            target="_blank" 
            rel="noopener noreferrer"
            id="btn-about-linkedin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5 text-blue-400" />
            <span>LinkedIn</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a 
            href="mailto:kirubakaran.in08@gmail.com" 
            id="btn-about-email"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-rose-400" />
            <span>Email</span>
          </a>
        </div>
      </div>

    </div>
  );
};
