import React, { useState } from 'react';
import { PageType, UserProfile } from '../types';
import { popularSkills } from '../data/initialData';
import { UserAvatar } from '../components/UserAvatar';
import { 
  Sparkles, ArrowRight, FileText, Compass, Map, MessageSquareCode, 
  FileEdit, CheckCircle2, TrendingUp, Users, ShieldCheck, Zap, 
  BrainCircuit, ChevronRight, Award, Play, HelpCircle, Target, Briefcase
} from 'lucide-react';

interface HomeProps {
  setCurrentPage: (page: PageType) => void;
  userProfile: UserProfile;
  toggleAIChat: () => void;
}

export const Home: React.FC<HomeProps> = ({ setCurrentPage, userProfile, toggleAIChat }) => {
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('All');
  const [interactiveScore, setInteractiveScore] = useState<number>(userProfile.careerScore);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const skillCategories = ['All', 'AI / ML', 'Frontend', 'Backend', 'Cloud & DevOps', 'Databases'];

  const filteredSkills = selectedSkillCategory === 'All' 
    ? popularSkills 
    : popularSkills.filter(s => s.category.toLowerCase().includes(selectedSkillCategory.toLowerCase()) || selectedSkillCategory.includes(s.category));

  const coreFeatures = [
    {
      id: 'ai-career-chat' as PageType,
      title: 'AI Career Chat Assistant',
      tag: 'Deep Mentorship',
      description: 'Ask Aura anything about career transitions, placement prep, resume feedback, and personalized skill plans with full context of your profile.',
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-500/20 to-indigo-500/10',
      border: 'hover:border-cyan-500/50',
      stat: 'Context-Aware AI'
    },
    {
      id: 'job-readiness' as PageType,
      title: 'Job Readiness Analyzer',
      tag: '8-Dimension Audit',
      description: 'Holistic evaluation of your Resume, Projects, Interview scores, Technical Skills, and Streaks with personalized next-step guidance.',
      icon: <Award className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-500/20 to-indigo-500/10',
      border: 'hover:border-purple-500/50',
      stat: '8-Dimension Audit'
    },
    {
      id: 'project-generator' as PageType,
      title: 'Project Idea Generator',
      tag: 'Portfolio Blueprints',
      description: 'Generate production-grade portfolio projects tailored for target tech roles with architecture specs, README outlines, and resume bullet points.',
      icon: <BrainCircuit className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'hover:border-emerald-500/50',
      stat: 'Recruiter-Targeted'
    },
    {
      id: 'job-matcher' as PageType,
      title: 'ATS Job Matcher',
      tag: 'Keyword Gap Scanner',
      description: 'Paste real job descriptions from LinkedIn or portals to calculate estimated compatibility, missing keywords, and experience alignment.',
      icon: <FileText className="w-6 h-6 text-cyan-300" />,
      color: 'from-cyan-500/20 to-blue-500/10',
      border: 'hover:border-cyan-500/50',
      stat: 'Keyword Density'
    },
    {
      id: 'action-center' as PageType,
      title: 'Career Action Center',
      tag: 'Daily & Weekly Focus',
      description: 'Intelligent daily recommendations that transform your skill gaps into immediate high-priority actions and strategic weekly targets.',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'hover:border-amber-500/50',
      stat: 'Smart Daily Tasks'
    },
    {
      id: 'career-comparison' as PageType,
      title: 'Career Path Comparison',
      tag: 'Multi-Role Trajectory',
      description: 'Compare 2–3 tech careers side-by-side across coding intensity, mathematical rigor, learning timelines, difficulty, and salary benchmarks.',
      icon: <Compass className="w-6 h-6 text-pink-400" />,
      color: 'from-pink-500/20 to-purple-500/10',
      border: 'hover:border-pink-500/50',
      stat: 'Salary Trajectories'
    },
    {
      id: 'resume-analyzer' as PageType,
      title: 'AI Resume Analyzer',
      tag: 'ATS Optimization',
      description: 'Upload your resume for instant ATS score audit, strength highlights, missing technical keywords, and actionable line-by-line rewrites.',
      icon: <FileText className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-500/20 to-blue-500/10',
      border: 'hover:border-cyan-500/50',
      stat: 'Format & Keyword Audit'
    },
    {
      id: 'skill-gap' as PageType,
      title: 'Skill Gap Analysis',
      tag: 'Job Fit Matrix',
      description: 'Select target roles (e.g., AI Engineer, Full Stack) and compare against your current stack to uncover critical gaps, priority, and study time.',
      icon: <Compass className="w-6 h-6 text-indigo-400" />,
      color: 'from-indigo-500/20 to-purple-500/10',
      border: 'hover:border-indigo-500/50',
      stat: '10+ Tech Roles'
    },
    {
      id: 'roadmap' as PageType,
      title: 'AI Roadmap Generator',
      tag: 'Structured Learning',
      description: 'Personalized step-by-step career milestones from Beginner to Advanced with curated projects, certifications, and interview preparation kits.',
      icon: <Map className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-500/20 to-pink-500/10',
      border: 'hover:border-purple-500/50',
      stat: 'Interactive Milestones'
    },
    {
      id: 'interview' as PageType,
      title: 'AI Mock Interview',
      tag: 'Real-Time Evaluation',
      description: 'Practice Technical, Coding, HR, and Behavioral questions with real Gemini AI evaluation, hint prompts, STAR scoring, and model answers.',
      icon: <MessageSquareCode className="w-6 h-6 text-pink-400" />,
      color: 'from-pink-500/20 to-rose-500/10',
      border: 'hover:border-pink-500/50',
      stat: 'Instant AI Hints'
    },
    {
      id: 'resume-builder' as PageType,
      title: 'ATS Resume Builder',
      tag: 'Portfolio Ready',
      description: 'Craft beautiful, clean, single-page ATS compliant resumes with structured sections for projects, skills, education, and achievements.',
      icon: <FileEdit className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'hover:border-emerald-500/50',
      stat: 'Live Formatting'
    },
    {
      id: 'goals' as PageType,
      title: 'Goal & Streak Tracker',
      tag: 'Daily Progress',
      description: 'Stay accountable with daily coding goals, weekly project sprints, milestone celebration confetti, and consecutive learning streak counters.',
      icon: <CheckCircle2 className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'hover:border-amber-500/50',
      stat: 'Milestone Tracking'
    }
  ];

  const faqs = [
    {
      q: "How does the AI Resume Analyzer evaluate my resume?",
      a: "Our analyzer connects to the Google Gemini API to examine your experience, keywords, and formatting structure against standard technical screening criteria, generating actionable suggestions line-by-line."
    },
    {
      q: "Are the learning roadmaps customizable for my current background?",
      a: "Yes. You can explore curated roadmaps across 10 tech domains (Full Stack, AI Engineer, Cloud, Cyber Security, etc.) and complete milestones at your own pace. Progress is saved locally in your browser PWA."
    },
    {
      q: "Can I use the app offline when traveling or without internet?",
      a: "The Progressive Web App (PWA) caches the application shell, roadmap guides, saved resumes, and habit trackers for offline review. Generating new AI evaluations requires an active internet connection."
    },
    {
      q: "How is my personal resume and profile data handled?",
      a: "Your career profile, certificates, and goal progress are saved locally in your browser (LocalStorage). When you request an AI analysis, the submitted text is transmitted securely via our server proxy to the Gemini API to generate responses. We do not maintain central tracking databases or sell your data."
    }
  ];

  return (
    <div className="space-y-24 pb-12">
      
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/20 via-purple-600/15 to-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left animate-in fade-in duration-500">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-indigo-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-lg shadow-cyan-500/10">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>Next-Gen AI Career Mentorship</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Syne'] leading-[1.1]">
                Build Your Next Career Step with <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  AI
                </span>
              </h1>

              {/* Description */}
              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Get AI-assisted resume feedback, identify skill gaps, create career learning roadmaps and practise interview questions in one place.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentPage('resume-analyzer')}
                  id="btn-hero-analyze-resume"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Analyze Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPage('dashboard')}
                  id="btn-hero-view-dashboard"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white font-semibold text-sm transition-all"
                >
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>View Career Score</span>
                </button>

                <button
                  onClick={toggleAIChat}
                  id="btn-hero-talk-aura"
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-semibold transition-all"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Ask Aura AI Mentor</span>
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Local Data Storage & Privacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Google Gemini API Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>PWA Offline App Shell</span>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Glassmorphism Widget */}
            <div className="lg:col-span-5 relative animate-in fade-in duration-500">
              <div className="relative rounded-3xl p-6 bg-[#0d121f]/90 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-2xl space-y-6">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <button 
                    onClick={() => setCurrentPage('profile')}
                    className="flex items-center gap-3 text-left group cursor-pointer"
                    title="Go to Profile & Settings"
                  >
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] group-hover:scale-105 transition-transform overflow-hidden">
                      <UserAvatar 
                        avatarUrl={userProfile.avatarUrl} 
                        name={userProfile.name || 'Candidate'} 
                        size="md" 
                        className="w-full h-full object-cover rounded-[11px]" 
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {userProfile.name || 'Your Career Profile'}
                      </h3>
                      <p className="text-xs text-cyan-400">
                        {userProfile.targetRole || 'Set your target tech role →'}
                      </p>
                    </div>
                  </button>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Evaluation
                  </span>
                </div>

                {/* Interactive Career Readiness Score Meter */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Demo Career Readiness Simulator</span>
                    <span className="font-extrabold text-cyan-400 text-base">{interactiveScore}%</span>
                  </div>
                  
                  {/* Progress Ring Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 shadow-sm shadow-cyan-500/50" 
                      style={{ width: `${interactiveScore}%` }}
                    ></div>
                  </div>

                  {/* Interactive slider simulation */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">Illustrative Score Adjustment:</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setInteractiveScore(Math.min(100, interactiveScore + 5))}
                        className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-semibold border border-cyan-500/30 transition-all"
                      >
                        + Add Skills
                      </button>
                      <button 
                        onClick={() => setInteractiveScore(userProfile.careerScore || 75)}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Live Tip Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                      <span>Aura AI Mentor Insight</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {userProfile.targetRole ? 'Profile Grounded' : 'Setup Required'}
                    </span>
                  </div>
                  {userProfile.targetRole && userProfile.skills && userProfile.skills.length > 0 ? (
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Targeting <strong>{userProfile.targetRole}</strong>: Focus on structuring your projects with measurable outcomes and completing milestone roadmaps for your core stack ({userProfile.skills.slice(0, 3).join(', ')}).
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Your career profile is currently empty. Complete your target role and technical skills in your profile to receive personalized recommendations and skill gap insights.
                      </p>
                      <button
                        onClick={() => setCurrentPage('profile')}
                        className="text-[11px] text-cyan-300 hover:text-cyan-200 font-bold underline flex items-center gap-1"
                      >
                        Complete Career Profile <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Feature Launcher Links */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setCurrentPage('resume-analyzer')}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left transition-all group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-400">ATS Scan</div>
                      <div className="text-[10px] text-slate-400">Check keyword score</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => setCurrentPage('interview')}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left transition-all group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-400">Mock Interview</div>
                      <div className="text-[10px] text-slate-400">Practice questions</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* REAL IMPLEMENTED FEATURES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d121f] via-[#121828] to-[#0d121f] border border-white/10 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          
          <div 
            onClick={() => setCurrentPage('resume-analyzer')}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/40 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">Module</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">Resume Feedback</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ATS keyword matching, formatting audits, and structured bullet recommendations.
            </p>
          </div>

          <div 
            onClick={() => setCurrentPage('roadmap')}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/40 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                <Map className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Module</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">Career Roadmaps</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Step-by-step milestones across 10 tech domains with practical portfolio projects.
            </p>
          </div>

          <div 
            onClick={() => setCurrentPage('interview')}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-pink-500/40 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
                <MessageSquareCode className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">Module</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">Mock Interview Practice</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Role-specific technical and behavioral questions with instant AI-assisted feedback.
            </p>
          </div>

          <div 
            onClick={() => setCurrentPage('skill-gap')}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/40 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Module</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">Skill Gap Analysis</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compare current skills against target role requirements to prioritize what to learn next.
            </p>
          </div>

        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">COMPLETE CAREER ECOSYSTEM</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">
            Everything You Need to Land Your Dream Tech Role
          </h3>
          <p className="text-slate-400 text-sm">
            Modular, startup-ready tools designed to guide you from initial resume creation to final offer negotiations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat) => (
            <div
              key={feat.id}
              onClick={() => setCurrentPage(feat.id)}
              className={`p-6 rounded-2xl bg-gradient-to-b ${feat.color} border border-white/10 ${feat.border} transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-white/10 border border-white/10 group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/10 text-slate-300 border border-white/10">
                    {feat.tag}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {feat.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-cyan-400">{feat.stat}</span>
                <span className="flex items-center gap-1 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all">
                  Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR SKILLS DEMAND GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400">IN-DEMAND SKILLS MATRIX</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Syne'] mt-1">
              Top Tech Skills Hiring Managers Seek
            </h3>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {skillCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSkillCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  selectedSkillCategory === cat
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">{skill.category}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">{skill.popularity}</span>
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">{skill.name}</h4>
              <button
                onClick={() => setCurrentPage('roadmap')}
                className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors pt-1"
              >
                Learn Roadmap <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS FOR YOUR CAREER JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">EXPLORE THE PLATFORM</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Syne']">
            Tools for Your Career Journey
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Modular tools built to support your preparation step-by-step from resume creation to mock interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <FileEdit className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">ATS Resume Builder</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Build clean, structured, single-page resumes formatted for applicant tracking systems, complete with live editing and printable export.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => setCurrentPage('resume-builder')}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Launch Resume Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">ATS Job Matcher</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Paste real job descriptions to identify keyword overlap, spot missing skills, and calculate estimated qualification alignment.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => setCurrentPage('job-matcher')}
                className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Launch Job Matcher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">Career Action Center</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Convert identified skill gaps into immediate daily focus tasks, weekly milestone targets, and productive study streaks.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => setCurrentPage('action-center')}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Open Action Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">FAQ</h2>
          <h3 className="text-2xl font-extrabold text-white font-['Syne']">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-cyan-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  {faq.q}
                </span>
                <span className="text-slate-400 font-mono text-sm">{faqOpen === idx ? '−' : '+'}</span>
              </button>
              {faqOpen === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-cyan-900/60 via-purple-900/60 to-indigo-900/60 border border-cyan-500/40 shadow-2xl overflow-hidden text-center space-y-6">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">
              Ready to Upgrade Your Career Score?
            </h3>
            <p className="text-slate-200 text-sm">
              Start analyzing your resume now and get personalized recommendations in under 10 seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => setCurrentPage('resume-analyzer')}
              className="px-8 py-3.5 rounded-xl bg-white text-black font-extrabold text-sm shadow-xl hover:bg-slate-100 hover:scale-105 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-600" />
              <span>Get Started Now</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('roadmap')}
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <Map className="w-4 h-4 text-purple-300" />
              <span>Explore Roadmaps</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
