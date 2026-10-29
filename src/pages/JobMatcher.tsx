import React, { useState } from 'react';
import { UserProfile, JobMatchResult, PageType } from '../types';
import { getStoredResumeData, getStoredLastJobMatch, saveStoredLastJobMatch } from '../lib/storage';
import { matchJobDescriptionWithResume } from '../lib/aiService';
import { 
  FileCheck, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  Check, 
  Briefcase, 
  FileText, 
  Compass, 
  GraduationCap, 
  Info 
} from 'lucide-react';

interface JobMatcherProps {
  userProfile: UserProfile;
  setCurrentPage: (page: PageType) => void;
}

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: "Full Stack Engineer (React + Node.js)",
    company: "Stripe / Scale AI Partner",
    text: `We are looking for a Full Stack Software Engineer to build reactive web apps and scalable microservices.

Requirements:
- Strong proficiency in React, TypeScript, Node.js, and Express.
- Experience with PostgreSQL, SQL database optimization, and Redis caching.
- Familiarity with Docker containerization, CI/CD pipelines, and cloud hosting (AWS / Cloud Run).
- Solid grasp of RESTful APIs, JWT authentication, and WebSockets.
- BS in Computer Science or equivalent practical experience.
- Passion for writing clean, testable code and building high-performance UIs.`
  },
  {
    title: "AI / GenAI Application Engineer",
    company: "Frontier AI Lab",
    text: `Join our team to build next-generation Generative AI applications and autonomous agents.

Requirements:
- Hands-on experience with LLM APIs (Gemini API, OpenAI SDK) and prompt engineering.
- Proficiency in Python or TypeScript, vector databases (ChromaDB, Pinecone), and RAG architectures.
- Experience building full-stack interfaces with React, Tailwind CSS, and REST/FastAPI endpoints.
- Understanding of embeddings, cosine similarity, and evaluation guardrails.
- Demonstrated portfolio projects showcasing real-world GenAI integration.`
  }
];

export const JobMatcher: React.FC<JobMatcherProps> = ({ userProfile, setCurrentPage }) => {
  const resumeData = getStoredResumeData();
  const [jobText, setJobText] = useState('');
  const [targetRole, setTargetRole] = useState(userProfile.targetRole || 'Full Stack Developer');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(() => getStoredLastJobMatch());
  const [copiedTip, setCopiedTip] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!jobText.trim()) return;
    setIsLoading(true);
    try {
      const matchResult = await matchJobDescriptionWithResume(jobText, resumeData, targetRole);
      setResult(matchResult);
      saveStoredLastJobMatch(matchResult);
    } catch (e) {
      console.error('Job match analysis error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleJD = (sample: { title: string; text: string }) => {
    setTargetRole(sample.title);
    setJobText(sample.text);
  };

  const copyTipToClipboard = (tip: string, idx: number) => {
    navigator.clipboard.writeText(tip);
    setCopiedTip(idx);
    setTimeout(() => setCopiedTip(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#131b2e] border border-cyan-500/20 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[15px] flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Syne']">
              ATS Job Description Matcher
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Paste a real job posting to calculate your estimated compatibility score and uncover missing keywords.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Connected Resume:</span>
          <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30">
            {resumeData.personalInfo.fullName} ({resumeData.skills.length} skills)
          </span>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Paste Area */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#0c101c] border border-white/10 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Paste Job Description
            </label>
            
            {/* Quick Sample Fill Buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Quick Samples:</span>
              {SAMPLE_JOB_DESCRIPTIONS.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => loadSampleJD(sample)}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-cyan-300 font-medium border border-white/10 transition-colors"
                >
                  {sample.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            rows={8}
            placeholder="Paste the complete job description text here (including requirements, responsibilities, and qualifications)..."
            id="textarea-job-description"
            className="w-full bg-[#111625] border border-white/10 focus:border-cyan-500/50 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Info className="w-4 h-4 text-slate-500" />
              <span>Resume details are automatically synced from your profile.</span>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!jobText.trim() || isLoading}
              id="btn-match-job-description"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isLoading ? 'Auditing Match...' : 'Calculate Compatibility'}</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Disclaimer & Instructions */}
        <div className="p-5 rounded-2xl bg-[#0c101c] border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>ATS Compatibility Transparency</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This tool provides an <strong>estimated compatibility evaluation</strong> using semantic keyword density, technical overlap, and industry requirements.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              No software can guarantee proprietary employer ATS screening outcomes, but addressing identified keywords and qualifications helps ensure your resume accurately reflects relevant skills.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 space-y-1">
            <strong>Pro Tip:</strong>
            <p className="text-[11px] text-cyan-200/80">
              Copy missing high-priority keywords into your Resume Builder project descriptions before sending your application.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Score & Compatibility Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1322] via-[#101728] to-[#121c32] border-2 border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[2px] shadow-xl flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#0a0f1d] rounded-[14px] flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white font-['Syne']">{result.matchPercentage}%</span>
                  <span className="text-[9px] font-bold text-cyan-300 uppercase">Compatibility</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-['Syne']">
                    {result.jobRole}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                    {result.estimatedAtsCompatibility} Match
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Estimated match rating across technical skills, keywords, and qualifications.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCurrentPage('resume-builder')}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/40 transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Update in Resume Builder</span>
              </button>
              <button
                onClick={() => setCurrentPage('skill-gap')}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs border border-white/10 transition-all flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View Skill Gaps</span>
              </button>
            </div>
          </div>

          {/* Matched vs Missing Skills Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Matching Skills */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101c] border border-emerald-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Matching Skills Found ({result.matchingSkills.length})</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.matchingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101c] border border-rose-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  <span>Missing Keywords & Skills ({result.missingSkills.length})</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <XCircle className="w-3 h-3 text-rose-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Important Keywords Breakdown */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101c] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Keyword Density Breakdown</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {result.importantKeywords.map((kw, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    kw.presentInResume 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200' 
                      : 'bg-rose-500/5 border-rose-500/20 text-slate-400'
                  }`}
                >
                  <div>
                    <span className="font-semibold block">{kw.keyword}</span>
                    <span className="text-[10px] text-slate-500">{kw.category}</span>
                  </div>
                  {kw.presentInResume ? (
                    <span className="text-[10px] font-bold text-emerald-400">Present</span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-400">Missing</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Experience & Education Match */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Experience Gaps */}
            <div className="p-5 rounded-2xl bg-[#0c101c] border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Experience & Scope Gaps</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                {result.experienceGaps.map((gap, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Match */}
            <div className="p-5 rounded-2xl bg-[#0c101c] border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Education Match</span>
              </h4>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Required:</span>
                  <span className="text-white font-medium">{result.educationMatch.required}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Your Status:</span>
                  <span className="text-emerald-300 font-semibold">{result.educationMatch.userStatus}</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-white/5">
                  {result.educationMatch.note}
                </p>
              </div>
            </div>

          </div>

          {/* Recommended Resume Changes */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101c] border border-cyan-500/30 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Recommended High-Impact Resume Adjustments</span>
            </h3>

            <div className="space-y-3">
              {result.recommendedResumeChanges.map((change, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3 text-xs text-slate-200">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{change}</span>
                  </div>
                  <button
                    onClick={() => copyTipToClipboard(change, idx)}
                    className="text-slate-400 hover:text-white shrink-0 p-1 rounded hover:bg-white/10"
                    title="Copy recommendation"
                  >
                    {copiedTip === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer Footer */}
          <p className="text-[11px] text-slate-500 text-center italic">
            {result.disclaimer}
          </p>

        </div>
      )}

    </div>
  );
};
