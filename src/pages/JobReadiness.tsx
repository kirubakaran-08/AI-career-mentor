import React, { useMemo, useEffect, useState } from 'react';
import { UserProfile, GoalItem, CertificateRecord, PageType, JobReadinessReport } from '../types';
import { 
  getStoredResumeData, 
  getStoredLastResumeAnalysis, 
  getStoredLastSkillGap,
  getStoredLastInterviewFeedback,
  saveStoredLastReadinessReport
} from '../lib/storage';
import { computeJobReadiness } from '../lib/aiService';
import { 
  Gauge, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Code2, 
  Briefcase, 
  MessageSquare, 
  Award, 
  Flame, 
  Globe, 
  Zap,
  RefreshCw,
  Info
} from 'lucide-react';

interface JobReadinessProps {
  userProfile: UserProfile;
  goals: GoalItem[];
  certificates: CertificateRecord[];
  setCurrentPage: (page: PageType) => void;
}

export const JobReadiness: React.FC<JobReadinessProps> = ({
  userProfile,
  goals = [],
  certificates = [],
  setCurrentPage
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Safely read stored artifacts with defensive defaults
  const resumeData = useMemo(() => getStoredResumeData(), [refreshTrigger]);
  const lastResumeAnalysis = useMemo(() => getStoredLastResumeAnalysis(), [refreshTrigger]);
  const lastSkillGap = useMemo(() => getStoredLastSkillGap(), [refreshTrigger]);
  const lastInterviewFeedback = useMemo(() => getStoredLastInterviewFeedback(), [refreshTrigger]);

  // Compute live readiness report purely (no side effects in render)
  const report: JobReadinessReport = useMemo(() => {
    return computeJobReadiness(
      userProfile,
      resumeData,
      lastResumeAnalysis,
      lastSkillGap,
      goals,
      certificates,
      lastInterviewFeedback
    );
  }, [userProfile, resumeData, lastResumeAnalysis, lastSkillGap, goals, certificates, lastInterviewFeedback]);

  // Persist computed report in useEffect, preventing recursive re-renders
  useEffect(() => {
    if (report) {
      saveStoredLastReadinessReport(report);
    }
  }, [report]);

  const isInterviewEvaluated = Boolean(lastInterviewFeedback && typeof lastInterviewFeedback.score === 'number');
  const isResumeEvaluated = Boolean(lastResumeAnalysis && typeof lastResumeAnalysis.impactScore === 'number');

  // Accurately deduplicate skills across resume and profile for display
  const uniqueSkills = useMemo(() => {
    const resumeSkills = Array.isArray(resumeData?.skills) ? resumeData.skills : [];
    const profileSkills = Array.isArray(userProfile?.skills) ? userProfile.skills : [];
    return Array.from(new Set([...resumeSkills, ...profileSkills].map(s => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)));
  }, [resumeData?.skills, userProfile?.skills]);
  const totalSkillsCount = uniqueSkills.length;

  const dimensionCards = [
    { 
      key: 'resume', 
      name: 'ATS Resume Score', 
      weight: '20%',
      score: report?.scores?.resume ?? 0, 
      icon: <FileText className="w-4 h-4 text-cyan-400" />, 
      desc: lastResumeAnalysis ? `ATS audit score: ${lastResumeAnalysis.overallScore}/100` : (resumeData?.personalInfo?.summary ? 'Draft resume logged (ATS unanalyzed)' : 'No resume uploaded yet'), 
      page: 'resume-analyzer' as PageType 
    },
    { 
      key: 'technicalSkills', 
      name: 'Technical Skills Alignment', 
      weight: '20%',
      score: report?.scores?.technicalSkills ?? 0, 
      icon: <Code2 className="w-4 h-4 text-indigo-400" />, 
      desc: totalSkillsCount > 0 ? `${totalSkillsCount} unique verified skills tracked` : 'No skills recorded', 
      page: 'skill-gap' as PageType 
    },
    { 
      key: 'projects', 
      name: 'Portfolio Projects', 
      weight: '15%',
      score: report?.scores?.projects ?? 0, 
      icon: <Briefcase className="w-4 h-4 text-emerald-400" />, 
      desc: `${(resumeData?.projects || []).length} documented projects`, 
      page: 'project-generator' as PageType 
    },
    { 
      key: 'interviewPrep', 
      name: 'Interview Preparation', 
      weight: '15%',
      score: report?.scores?.interviewPrep ?? 0, 
      icon: <MessageSquare className="w-4 h-4 text-purple-400" />, 
      desc: isInterviewEvaluated 
        ? `Evaluated AI mock interview: ${lastInterviewFeedback!.score}/100 evaluation score` 
        : (goals.filter(g => g.category?.toLowerCase().includes('interview')).length > 0 
            ? `${goals.filter(g => g.category?.toLowerCase().includes('interview')).length} prep goals tracked (mock interview simulation pending)` 
            : 'No mock interview simulation completed'), 
      page: 'interview' as PageType 
    },
    { 
      key: 'certifications', 
      name: 'Certifications', 
      weight: '10%',
      score: report?.scores?.certifications ?? 0, 
      icon: <Award className="w-4 h-4 text-amber-400" />, 
      desc: `${(certificates || []).length} verified credentials tracked`, 
      page: 'certificates' as PageType 
    },
    { 
      key: 'careerConsistency', 
      name: 'Career Consistency', 
      weight: '10%',
      score: report?.scores?.careerConsistency ?? 0, 
      icon: <Flame className="w-4 h-4 text-rose-400" />, 
      desc: `${userProfile?.learningStreakDays || 0}-day streak & daily milestones`, 
      page: 'goals' as PageType 
    },
    { 
      key: 'communication', 
      name: 'Communication & Impact', 
      weight: '5%',
      score: report?.scores?.communication ?? 0, 
      icon: <Zap className="w-4 h-4 text-cyan-300" />, 
      desc: isResumeEvaluated ? 'Evaluated resume STAR & metric impact' : 'Estimated proxy based on resume & project structure', 
      page: 'resume-builder' as PageType 
    },
    { 
      key: 'portfolio', 
      name: 'Public Portfolio & GitHub', 
      weight: '5%',
      score: report?.scores?.portfolio ?? 0, 
      icon: <Globe className="w-4 h-4 text-blue-400" />, 
      desc: 'Validated repository and portfolio web presence', 
      page: 'resume-builder' as PageType 
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const isProfileEmpty = (report?.scores?.overall ?? 0) === 0 && totalSkillsCount === 0;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#131b2e] border border-cyan-500/20 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/25 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[15px] flex items-center justify-center">
              <Gauge className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Syne']">
              Job Readiness Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              8-dimension career audit evaluating your readiness for <strong>{userProfile?.targetRole || 'Software Engineer'}</strong>.
            </p>
          </div>
        </div>

        {/* Actions & Level Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            id="btn-refresh-readiness"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            title="Recalculate Audit from latest data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalculate Audit</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Level:</span>
            <span className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 font-extrabold text-xs">
              {report?.level ?? 'Initial Setup Phase'}
            </span>
          </div>
        </div>
      </div>

      {/* Onboarding Banner for Empty Profiles */}
      {isProfileEmpty && (
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3.5 shadow-lg">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-cyan-200 font-['Syne']">
              Initial Profile Setup Detected — Not Enough Data For Assessment
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your preliminary score is at baseline (0/100) because you have not yet supplied enough career profile data (no skills, resume, projects, or certifications recorded). Complete your profile details, upload your draft resume, or run a skill gap analysis to generate your holistic 8-dimension readiness index.
            </p>
          </div>
        </div>
      )}

      {/* Main Overall Readiness Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Overall Circular Score Gauge */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0e1424] to-[#0a0e1a] border border-cyan-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
          <div className="relative flex items-center justify-center">
            {/* SVG Circular Progress Meter */}
            <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-800/80 fill-none"
              />
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="url(#readiness-gradient)"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - Math.min(100, Math.max(0, report?.scores?.overall ?? 0)) / 100)}
                strokeLinecap="round"
                className="fill-none transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="readiness-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-black text-white font-['Syne'] tracking-tight">
                {report?.scores?.overall ?? 0}
              </span>
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">/ 100 Index</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mt-4 font-['Syne']">{report?.level ?? 'Initial Setup Phase'}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            Estimated career-preparation indicator synthesized across your 8 profile dimensions. Not an ATS pass/fail guarantee or recruitment warranty.
          </p>
        </div>

        {/* Right: Recommended Action & Top 3 Improvements */}
        <div className="lg:col-span-2 space-y-4">
          {/* Top Priority Action */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1628] border border-cyan-500/30 relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Next Career Action</span>
            </div>
            <h4 className="text-lg font-bold text-white font-['Syne']">
              {report?.recommendedNextAction?.title || 'Explore Career Roadmap'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {report?.recommendedNextAction?.description || 'Select a learning roadmap to begin tracking skills.'}
            </p>
            <div className="mt-4">
              <button
                onClick={() => setCurrentPage(report?.recommendedNextAction?.targetPage || 'roadmap')}
                id="btn-launch-recommended-action"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{report?.recommendedNextAction?.buttonLabel || 'Open Roadmap'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Top 3 Things to Improve */}
          <div className="p-5 rounded-2xl bg-[#0c101c] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Top 3 High-Impact Improvements</span>
              </h4>
              <span className="text-[11px] text-slate-500">Live Diagnosis</span>
            </div>
            <div className="space-y-2">
              {(report?.top3ToImprove || []).map((tip, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 8-Dimension Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-['Syne'] flex items-center gap-2">
              <span>8-Dimensional Career Qualification Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Defensible scoring weighted to 100% total (Resume 20%, Tech Skills 20%, Projects 15%, Interview 15%, Certs 10%, Consistency 10%, Communication 5%, Portfolio 5%). Click any dimension to boost its score.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 self-start sm:self-auto shrink-0">
            Total Weight: 100%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dimensionCards.map((card) => (
            <div
              key={card.key}
              onClick={() => setCurrentPage(card.page)}
              className="p-4 rounded-2xl bg-[#0d121f] border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer group shadow-md hover:shadow-cyan-500/10 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-mono">wt: {card.weight}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-extrabold border ${getScoreColor(card.score)}`}>
                      {card.score}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {card.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {card.desc}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-cyan-300">
                <span>Boost Score</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strong & Weak Breakdown Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strong Areas */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101c] border border-emerald-500/20 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Strengths</span>
          </div>
          <div className="space-y-3">
            {report?.strongAreas && report.strongAreas.length > 0 ? (
              report.strongAreas.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-emerald-300 font-semibold">{item.name}</strong>
                    <span className="font-mono text-emerald-400 font-bold">{item.score}/100</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.highlight}</p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-400 text-center">
                All dimensions currently scored below 50. Follow the high-impact actions to start building your baseline strengths.
              </div>
            )}
          </div>
        </div>

        {/* Weak Areas & Remediation */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101c] border border-rose-500/20 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Priority Weak Areas to Target</span>
          </div>
          <div className="space-y-3">
            {report?.weakAreas && report.weakAreas.length > 0 ? (
              report.weakAreas.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-rose-300 font-semibold">{item.name}</strong>
                    <span className="font-mono text-rose-400 font-bold">{item.score}/100</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{item.fixAction}</p>
                  <button
                    onClick={() => setCurrentPage(item.targetPage)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 pt-0.5 cursor-pointer"
                  >
                    <span>Resolve in {item.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-400 text-center">
                All tracked dimensions are meeting or exceeding readiness targets!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
