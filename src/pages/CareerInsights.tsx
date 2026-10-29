import React, { useState } from 'react';
import { UserProfile, CareerInsightReport, PageType } from '../types';
import { 
  TrendingUp, 
  Sparkles, 
  AlertOctagon, 
  CheckCircle2, 
  DollarSign, 
  Briefcase, 
  Code2, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  Flame, 
  Search, 
  Bookmark, 
  Award,
  Zap
} from 'lucide-react';

interface CareerInsightsProps {
  userProfile: UserProfile;
  setCurrentPage: (page: PageType) => void;
}

export const CareerInsights: React.FC<CareerInsightsProps> = ({ userProfile, setCurrentPage }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const topInDemandSkills = [
    { name: "TypeScript & React 19 / Next.js", demandGrowth: "Core Standard", category: "Frontend / Full Stack", whyImportant: "Universal standard for modern production web applications and design systems.", hiringSignal: "Very High" },
    { name: "FastAPI, Python & Gemini API / LLM Integrations", demandGrowth: "Surging Demand", category: "AI & GenAI", whyImportant: "Enterprises need engineers who can ground LLMs in internal databases and production APIs.", hiringSignal: "Critical" },
    { name: "PostgreSQL, Drizzle & Vector Indexing (pgvector)", demandGrowth: "High Priority", category: "Backend & Data", whyImportant: "Replaces legacy ORMs with type safety and powers hybrid lexical/vector search.", hiringSignal: "High" },
    { name: "Docker, Kubernetes & CI/CD GitHub Actions", demandGrowth: "Essential", category: "Cloud & DevOps", whyImportant: "Automated container builds and zero-downtime microservice deployments.", hiringSignal: "High" },
    { name: "System Design & Distributed Caching (Redis)", demandGrowth: "Key Differentiator", category: "Architecture", whyImportant: "Core differentiator during Mid/Senior placement screens to demonstrate scale awareness.", hiringSignal: "High" }
  ];

  const resumeMistakes = [
    {
      mistake: "Listing generic responsibilities without quantified business outcomes",
      dontExample: "Helped develop backend API endpoints for the company application.",
      doExample: "Architected 12 REST API microservices in Express & Redis, reducing endpoint latency by 42% for 15,000+ daily active users.",
      fixTip: "Always use: [Action Verb] + [Technology Used] + [What You Built] + [Quantified Metric / Scale]."
    },
    {
      mistake: "Unparsable multi-column or graphic-heavy resume formats",
      dontExample: "Multi-column Photoshop/Canva template with skill rating progress bars (e.g. 'Python: 90%').",
      doExample: "Single-column clean ATS-friendly layout with text headings and comma-separated technical keywords.",
      fixTip: "ATS scanners fail on graphical skill bars. Use standard text category groupings."
    },
    {
      mistake: "Burying relevant technical skills at the bottom of page 2",
      dontExample: "Placing Education and Hobbies on top, with Technical Skills at the very footer.",
      doExample: "Place 'Technical Skills' directly beneath your contact header and summary.",
      fixTip: "Recruiters spend 6 seconds on first scan; skills must be visible without scrolling."
    }
  ];

  const interviewMistakes = [
    {
      mistake: "Diving into code immediately without asking clarifying edge-case questions",
      whyFails: "Interviewers want to see how you dissect ambiguity, not just if you memorized syntax.",
      remedy: "Spend the first 2 minutes clarifying inputs, expected outputs, constraints (e.g. data bounds), and edge cases (empty lists, duplicates)."
    },
    {
      mistake: "Vague behavioral answers lacking the STAR structure",
      whyFails: "Stories without measurable results or individual accountability sound fabricated.",
      remedy: "Structure every story: Situation (15%), Task (15%), Action YOU took (50%), Result & Metric (20%)."
    },
    {
      mistake: "Silent coding without thinking out loud",
      whyFails: "If you get stuck while silent, the interviewer has no visibility to help or evaluate your problem-solving.",
      remedy: "Narrate your thought process: 'I am first considering a hash map approach for O(N) lookup...'"
    }
  ];

  const hiringTrends = [
    {
      title: "Demonstrated Proof of Work > Academic Pedigree Alone",
      desc: "Engineering hiring teams strongly value demonstrated proof-of-work: live GitHub repositories with clear READMEs, deployed application URLs, and unit tests alongside coursework.",
      tag: "Recruiting Paradigm"
    },
    {
      title: "The Rise of Full-Stack GenAI Builders",
      desc: "Companies are prioritizing developers who can build both the interactive user interface and the underlying generative AI backend orchestrations.",
      tag: "Market Trend"
    },
    {
      title: "High Value for Practical SQL & Data Intuition",
      desc: "Across backend and full-stack positions, candidates who demonstrate practical SQL query execution, indexing knowledge, and schema migration skills stand out in technical evaluations.",
      tag: "Skill Surge"
    }
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#131b2e] border border-cyan-500/20 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[15px] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Syne']">
              Career & Tech Market Insights
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Recruiter intelligence, hiring trends, resume pitfalls, and placement strategies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> Market Q3/Q4 Updated
          </span>
        </div>
      </div>

      {/* TOP IN-DEMAND SKILLS FOR PLACEMENTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white font-['Syne'] flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span>Top 5 In-Demand Skills Companies Are Looking For</span>
          </h2>
          <span className="text-xs text-slate-400">Recruiter search volume surges</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topInDemandSkills.map((skill, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0d121f] border border-white/10 hover:border-cyan-500/40 transition-all shadow-md flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {skill.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {skill.demandGrowth}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">
                  {skill.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {skill.whyImportant}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-500">Recruiter Signal:</span>
                <span className="font-bold text-cyan-300">{skill.hiringSignal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMMON RESUME MISTAKES IN TECH (DON'T VS DO) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white font-['Syne'] flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <span>Common Tech Resume Mistakes & Instant Fixes</span>
          </h2>
          <button
            onClick={() => setCurrentPage('resume-builder')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Fix in Resume Builder</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-4">
          {resumeMistakes.map((item, idx) => (
            <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-[#0c101c] border border-white/10 space-y-4 shadow-lg">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item.mistake}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Don't */}
                <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                  <span className="text-rose-400 font-bold uppercase tracking-wider text-[11px] block">
                    ❌ What Not To Do
                  </span>
                  <p className="text-slate-300 italic font-mono">"{item.dontExample}"</p>
                </div>

                {/* Do */}
                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] block">
                    ✅ Recruiter Approved STAR Example
                  </span>
                  <p className="text-slate-200 font-medium font-mono leading-relaxed">"{item.doExample}"</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-xs text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>Key Formula:</strong> {item.fixTip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMMON INTERVIEW PITFALLS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white font-['Syne'] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <span>Technical & Behavioral Interview Traps</span>
          </h2>
          <button
            onClick={() => setCurrentPage('interview')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Practice in AI Interview</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interviewMistakes.map((trap, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#0d121f] border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Trap #{idx + 1}
                </span>
                <h4 className="font-bold text-white text-sm">
                  {trap.mistake}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Why it fails:</strong> {trap.whyFails}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-cyan-200 leading-snug">
                <strong className="text-cyan-400 block mb-0.5">Recommended Strategy:</strong>
                {trap.remedy}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HIRING TRENDS SUMMARY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0e172a] via-[#101b33] to-[#0c1322] border border-cyan-500/20 shadow-xl space-y-5">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Industry Shift Report</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Syne']">
          Key Hiring Realities for Tech Placements in 2026
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {hiringTrends.map((trend, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                {trend.tag}
              </span>
              <h4 className="font-bold text-white text-sm">{trend.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{trend.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
