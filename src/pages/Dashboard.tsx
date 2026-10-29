import React, { useState } from 'react';
import { PageType, UserProfile, GoalItem, CertificateRecord } from '../types';
import { UserAvatar } from '../components/UserAvatar';
import { getStoredLastResumeAnalysis } from '../lib/storage';
import { 
  TrendingUp, Award, CheckCircle2, Flame, Calendar, Clock, 
  ArrowUpRight, Target, Sparkles, BookOpen, FileText, ChevronRight, BarChart3,
  Camera
} from 'lucide-react';

interface DashboardProps {
  setCurrentPage: (page: PageType) => void;
  userProfile: UserProfile;
  goals: GoalItem[];
  certificates: CertificateRecord[];
  toggleGoalCompletion: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setCurrentPage,
  userProfile,
  goals,
  certificates,
  toggleGoalCompletion
}) => {
  const completedGoalsCount = goals.filter(g => g.isCompleted).length;
  const pendingGoals = goals.filter(g => !g.isCompleted);
  const completedCertificates = certificates.filter(c => c.status === 'Completed').length;
  const lastAnalysis = getStoredLastResumeAnalysis();

  const weeklyActivityData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.8 },
    { day: 'Wed', hours: 4.2 },
    { day: 'Thu', hours: 1.5 },
    { day: 'Fri', hours: 5.0 },
    { day: 'Sat', hours: 3.2 },
    { day: 'Sun', hours: 2.8 }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-[#0d121f] to-purple-950/60 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('profile')}
              className="relative w-16 h-16 rounded-2xl ring-2 ring-cyan-500/40 hover:ring-cyan-400 p-1 bg-slate-900 shrink-0 cursor-pointer transition-all overflow-hidden group focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none flex items-center justify-center"
              title="Go to Career Profile to manage photo and credentials"
            >
              <UserAvatar 
                avatarUrl={userProfile.avatarUrl} 
                name={userProfile.name || 'Candidate'} 
                size="lg" 
                className="w-full h-full object-cover rounded-xl" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-cyan-300">
                <Camera className="w-4 h-4" />
              </div>
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Syne']">
                  {userProfile.name ? `Welcome back, ${userProfile.name}!` : 'Welcome to AI Career Mentor!'}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {userProfile.experienceLevel || 'Entry-Level / Fresher'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {userProfile.targetRole ? (
                  <>
                    Targeting <span className="text-cyan-400 font-semibold">{userProfile.targetRole}</span> • Keep building momentum today.
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setCurrentPage('profile')}
                      className="text-cyan-400 hover:text-cyan-300 underline font-semibold cursor-pointer"
                    >
                      Complete your Career Profile
                    </button>{' '}
                    to personalize your AI career advice and roadmaps.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('resume-analyzer')}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Scan Resume</span>
            </button>
            <button
              onClick={() => setCurrentPage('interview')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Practice Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Career Readiness Score */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Career Score</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white font-['Syne']">{userProfile.careerScore}/100</div>
            <span className="text-xs font-medium text-slate-400">Target: 100</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${userProfile.careerScore}%` }}></div>
          </div>
        </div>

        {/* Skill Gap Score */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Skill Score</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white font-['Syne']">{userProfile.skillScore}%</div>
            <span className="text-xs font-medium text-slate-400">Role Alignment</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: `${userProfile.skillScore}%` }}></div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-amber-400 font-['Syne']">{userProfile.learningStreakDays} Days</div>
            <span className="text-xs font-bold text-amber-300">🔥 Active</span>
          </div>
          <p className="text-[10px] text-slate-400">Complete 1 goal today to keep streak</p>
        </div>

        {/* Certificates */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Certificates Vault</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white font-['Syne']">{completedCertificates} Verified</div>
            <button onClick={() => setCurrentPage('certificates')} className="text-[11px] text-cyan-400 hover:underline">View All</button>
          </div>
          <p className="text-[10px] text-slate-400">{certificates.length - completedCertificates} currently in progress</p>
        </div>

      </div>

      {/* Phase 3: AI Career Intelligence Suite Quick-Access Hub */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c1424] via-[#0f1a30] to-[#121829] border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <h2 className="text-base sm:text-lg font-bold text-white font-['Syne']">
              AI Career Intelligence Suite
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Phase 3 Live
            </span>
          </div>
          <span className="text-xs text-slate-400">Context-aware tools grounded in your active profile</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setCurrentPage('ai-career-chat')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 transition-all text-left group flex flex-col justify-between h-24"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🤖</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-200">AI Career Chat</div>
              <div className="text-[10px] text-slate-400 truncate">Deep mentorship</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('job-readiness')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 transition-all text-left group flex flex-col justify-between h-24"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🎯</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-purple-200">Job Readiness</div>
              <div className="text-[10px] text-slate-400 truncate">8-dimension audit</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('action-center')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 transition-all text-left group flex flex-col justify-between h-24"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">⚡</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-300 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-200">Action Center</div>
              <div className="text-[10px] text-slate-400 truncate">Today's priorities</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('career-comparison')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/40 transition-all text-left group flex flex-col justify-between h-24"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">⚖️</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-300 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-pink-200">Compare Roles</div>
              <div className="text-[10px] text-slate-400 truncate">Salaries & difficulty</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('project-generator')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 transition-all text-left group flex flex-col justify-between h-24"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🚀</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-300 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-200">Project Ideas</div>
              <div className="text-[10px] text-slate-400 truncate">Portfolio blueprints</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('job-matcher')}
            className="p-3 rounded-2xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 transition-all text-left group flex flex-col justify-between h-24"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">📄</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-200">ATS Matcher</div>
              <div className="text-[10px] text-slate-400 truncate">Paste job posting</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Weekly Hours & Goals */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Weekly Learning Activity Chart */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Weekly Learning Log (Hours)
                </h3>
                <p className="text-xs text-slate-400">Sample tracking breakdown (23.8 hrs logged)</p>
              </div>
              <span className="text-xs text-cyan-400 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                Demo Breakdown
              </span>
            </div>

            {/* Custom Bar Visualizer */}
            <div className="pt-4 pb-2 flex items-end justify-between gap-2 h-40">
              {weeklyActivityData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hours}h
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                    style={{ height: `${(item.hours / 5) * 100}%` }}
                  ></div>
                  <span className="text-xs font-medium text-slate-400">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals Checklist */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Upcoming Learning Goals ({completedGoalsCount}/{goals.length})
                </h3>
                <p className="text-xs text-slate-400">Click checkboxes to mark complete and earn streak XP</p>
              </div>
              <button onClick={() => setCurrentPage('goals')} className="text-xs text-cyan-400 hover:underline">Manage All Goals</button>
            </div>

            <div className="space-y-2">
              {goals.slice(0, 4).map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoalCompletion(goal.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    goal.isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400 line-through'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={goal.isCompleted}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-cyan-500 accent-cyan-500 pointer-events-none"
                    />
                    <span className="text-xs font-medium">{goal.title}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    {goal.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Recommended Actions & Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Recommended Next Steps */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-[#0d121f] border border-purple-500/30 space-y-4">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Recommended Next Steps</span>
            </div>

            <div className="space-y-3">
              <div 
                onClick={() => setCurrentPage('skill-gap')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Complete Skill Gap Audit</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-[11px] text-slate-400">Discover missing tools for {userProfile.targetRole}</p>
              </div>

              <div 
                onClick={() => setCurrentPage('interview')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Practice 2 Coding Questions</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400">Prepare STAR framework answers</p>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Recent Activity</h3>
              <span className="text-[10px] text-slate-400">Activity Log</span>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              {lastAnalysis ? (
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                  <div>
                    <p className="font-semibold text-white">Resume Analyzed</p>
                    <p className="text-[10px] text-slate-400">
                      Scored {lastAnalysis.overallScore}/100 for {lastAnalysis.targetRole} • {lastAnalysis.analyzedAt || 'Recently'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400/60 mt-1.5 shrink-0"></span>
                  <div>
                    <p className="font-semibold text-slate-300">Resume Audit Ready</p>
                    <p className="text-[10px] text-slate-400">Run an ATS scan in Resume Analyzer to view results here</p>
                  </div>
                </div>
              )}
              {completedGoalsCount > 0 ? (
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <div>
                    <p className="font-semibold text-white">Goals Completed</p>
                    <p className="text-[10px] text-slate-400">{completedGoalsCount} learning milestones achieved</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400/60 mt-1.5 shrink-0"></span>
                  <div>
                    <p className="font-semibold text-slate-300">Goal Tracking Active</p>
                    <p className="text-[10px] text-slate-400">Check off your next task in Goal Tracker</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0"></span>
                <div>
                  <p className="font-semibold text-white">Career Roadmap</p>
                  <p className="text-[10px] text-slate-400">{userProfile.targetRole ? `Tracking ${userProfile.targetRole}` : '10+ tech domains available'}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
