import React, { useState } from 'react';
import { ResumeAnalysisResult, UserProfile } from '../types';
import { getStoredLastResumeAnalysis, saveStoredLastResumeAnalysis } from '../lib/storage';
import { 
  FileText, Upload, Sparkles, CheckCircle, AlertTriangle, 
  RefreshCw, Info, Trash2, RotateCcw 
} from 'lucide-react';

interface ResumeAnalyzerProps {
  userProfile: UserProfile;
}

const SAMPLE_DEMO_RESUME = `Jane Doe
Email: jane.doe@example.com | Location: Bengaluru, India
GitHub: github.com/example-candidate | LinkedIn: linkedin.com/in/example-candidate

PROFESSIONAL SUMMARY:
Aspiring Full Stack Engineer with strong foundational skills in TypeScript, React, Node.js, and RESTful API architecture. Passionate about performant web systems, clean modular code, and cloud integrations.

EDUCATION:
B.Tech in Artificial Intelligence & Data Science (2022 - 2026)
Coursework: Data Structures, Database Systems, Web Engineering, Machine Learning.

TECHNICAL SKILLS:
Languages: TypeScript, JavaScript, Python, SQL
Frontend: React, Tailwind CSS, HTML5/CSS3
Backend: Node.js, Express.js, PostgreSQL
Tools: Git, Docker, REST APIs, Postman

PROJECTS:
AI Career Mentoring Portal
• Developed responsive single-page application using React, TypeScript, and Tailwind CSS.
• Implemented client-side resume parsing and connected with backend Express REST endpoints.
• Added client-side offline storage caching using browser LocalStorage.

Collaborative Task Tracker
• Designed full-stack CRUD application with Node.js and PostgreSQL.
• Implemented JWT-based user authentication and role-based route protection.`;

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ userProfile }) => {
  const [resumeText, setResumeText] = useState<string>('');
  const [isDemoLoaded, setIsDemoLoaded] = useState<boolean>(false);
  const [targetRole, setTargetRole] = useState<string>(userProfile.targetRole || "Full Stack Developer");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(getStoredLastResumeAnalysis());

  const handleAnalyze = async () => {
    const trimmed = resumeText.trim();
    if (!trimmed) {
      setErrorMessage("Please paste your resume text or click 'Load Demo Resume' before analyzing.");
      return;
    }
    if (trimmed.length < 50) {
      setErrorMessage("The provided resume text is too brief for an ATS evaluation. Please provide complete sections including experience, skills, and projects.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: trimmed, targetRole })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      if (data && typeof data.overallScore === 'number') {
        const fullResult: ResumeAnalysisResult = {
          ...data,
          analyzedAt: new Date().toLocaleDateString(),
          targetRole
        };
        setAnalysisResult(fullResult);
        saveStoredLastResumeAnalysis(fullResult);
      } else {
        throw new Error("Received an incomplete evaluation from the AI service.");
      }
    } catch (err: any) {
      console.error('Resume audit error:', err);
      // Explain the limitation honestly instead of assigning fabricated scores
      setErrorMessage(
        "AI Resume Evaluation could not be completed. Please check your internet connection or verify the backend Gemini API service configuration. No speculative or artificial scores have been generated."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setResumeText(event.target.result as string);
          setIsDemoLoaded(false);
          setErrorMessage(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSampleResume = () => {
    setResumeText(SAMPLE_DEMO_RESUME);
    setIsDemoLoaded(true);
    setErrorMessage(null);
  };

  const handleClearResume = () => {
    setResumeText('');
    setIsDemoLoaded(false);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>ATS Resume Audit Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">
          AI Resume Scanner & Optimization
        </h1>
        <p className="text-slate-300 text-sm">
          Paste your resume plain text or upload a document file. The analyzer evaluates keyword coverage, formatting structure, and quantifiable accomplishments with AI feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            
            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, AI Engineer, Cloud Specialist"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* File Upload Zone & Demo Loader */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Resume Content
                </label>
                <button
                  type="button"
                  onClick={handleLoadSampleResume}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1"
                  title="Load synthetic candidate demo data to test the analyzer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Load Demo Resume (Sample Data)</span>
                </button>
              </div>

              <div className="border-2 border-dashed border-white/15 hover:border-cyan-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-white/[0.02]">
                <input
                  type="file"
                  accept=".txt,.md,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-file-input"
                />
                <label htmlFor="resume-file-input" className="cursor-pointer flex flex-col items-center gap-1">
                  <Upload className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">Click to upload TXT / MD file</span>
                  <span className="text-[10px] text-slate-400">or paste plain text directly into the area below</span>
                </label>
              </div>
            </div>

            {/* Resume Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Resume Plain Text Input
                </span>
                <div className="flex items-center gap-2">
                  {isDemoLoaded && (
                    <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      Fictional Demo Resume
                    </span>
                  )}
                  {resumeText && (
                    <button
                      type="button"
                      onClick={handleClearResume}
                      className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                      title="Clear resume input"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>
              
              <textarea
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setIsDemoLoaded(false);
                  if (errorMessage) setErrorMessage(null);
                }}
                rows={12}
                placeholder="Paste your resume sections here (Summary, Technical Skills, Projects, Experience, Education)..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none custom-scrollbar leading-relaxed"
              />
            </div>

            {/* Helpful Instruction Tip */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tips for an accurate ATS evaluation:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-1 text-[10px] text-slate-400">
                <li>Include explicit technical skill keywords (e.g. React, Node.js, SQL).</li>
                <li>Ensure project descriptions mention specific frameworks and tooling.</li>
                <li>Add quantifiable outcomes (e.g. latency, user counts, percentage improvements).</li>
              </ul>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Evaluating ATS Match with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume Now</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Audit Results */}
        <div className="lg:col-span-7 space-y-6">
          {analysisResult ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Overall Score Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d121f] via-[#121828] to-[#0d121f] border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs font-semibold text-cyan-400">ATS Match Evaluation</div>
                  <h3 className="text-2xl font-bold text-white font-['Syne']">
                    Target Role: {analysisResult.targetRole}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md">{analysisResult.summary}</p>
                </div>

                {/* Score Circle */}
                <div className="relative flex flex-col items-center justify-center w-28 h-28 rounded-full bg-slate-900 ring-4 ring-cyan-500/40 shrink-0">
                  <span className="text-3xl font-extrabold text-white font-['Syne']">{analysisResult.overallScore}%</span>
                  <span className="text-[10px] text-cyan-400 font-semibold uppercase">ATS Score</span>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-400">Formatting</span>
                  <div className="text-lg font-bold text-emerald-400">{analysisResult.formattingScore}%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-400">Keywords</span>
                  <div className="text-lg font-bold text-purple-400">{analysisResult.keywordsScore}%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-400">Impact Metrics</span>
                  <div className="text-lg font-bold text-amber-400">{analysisResult.impactScore}%</div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Strengths */}
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                  <h4 className="font-bold text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Key Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-200">
                    {analysisResult.strengths?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                  <h4 className="font-bold text-xs text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Gaps & Areas to Fix
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-200">
                    {analysisResult.weaknesses?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Missing Keywords Chips */}
              {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="font-bold text-xs text-cyan-300">Missing ATS Technical Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Line-by-Line Improvement Tips */}
              {analysisResult.actionableTips && analysisResult.actionableTips.length > 0 && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="font-bold text-xs text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Actionable Line Rewrites & Tips
                  </h4>
                  <div className="space-y-2 text-xs text-slate-200">
                    {analysisResult.actionableTips.map((tip, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5">
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <FileText className="w-12 h-12 text-cyan-400 mx-auto opacity-60" />
              <h3 className="font-bold text-lg text-white">No Analysis Output Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Paste your resume text on the left and click "Analyze Resume Now" to run your ATS evaluation.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
