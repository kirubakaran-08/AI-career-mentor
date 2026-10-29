import React, { useState, useEffect } from 'react';
import { UserProfile, ActionCenterTask, PageType } from '../types';
import { 
  getStoredActionTasks, 
  saveStoredActionTasks, 
  getStoredResumeData, 
  getStoredLastSkillGap, 
  getStoredLastResumeAnalysis,
  getStoredGoals 
} from '../lib/storage';
import { triggerConfetti } from '../lib/confetti';
import { 
  CheckCircle2, 
  Calendar, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Code2, 
  MessageSquare, 
  FileText, 
  Briefcase, 
  RefreshCw, 
  Zap,
  Check
} from 'lucide-react';

interface ActionCenterProps {
  userProfile: UserProfile;
  setCurrentPage: (page: PageType) => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ userProfile, setCurrentPage }) => {
  const [tasks, setTasks] = useState<ActionCenterTask[]>(() => getStoredActionTasks());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const resumeData = getStoredResumeData();
  const lastSkillGap = getStoredLastSkillGap();
  const lastResumeAnalysis = getStoredLastResumeAnalysis();
  const goals = getStoredGoals();

  useEffect(() => {
    saveStoredActionTasks(tasks);
  }, [tasks]);

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        const nextState = !t.isCompleted;
        if (nextState) {
          triggerConfetti();
        }
        return { ...t, isCompleted: nextState };
      }
      return t;
    });
    setTasks(updated);
  };

  const regenerateSmartActions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const dynamicTasks: ActionCenterTask[] = [];
      const roleName = userProfile.targetRole || "Target Engineering Role";

      // 1. Skill Gap task: use real missing skill if analysis exists; otherwise recommend initial analysis
      if (lastSkillGap && Array.isArray(lastSkillGap.missingSkills) && lastSkillGap.missingSkills.length > 0) {
        const topMissing = lastSkillGap.missingSkills[0];
        dynamicTasks.push({
          id: `act-${Date.now()}-skill`,
          title: `Study ${topMissing.name} Core Concepts`,
          subtitle: `Identified as priority skill gap from your ${lastSkillGap.role} skill analysis`,
          category: 'Skill',
          timeframe: 'today',
          priority: topMissing.priority === 'Critical' ? 'Critical' : 'High',
          isCompleted: false,
          targetPage: 'skill-gap',
          actionText: 'Review Skill Gap'
        });
      } else {
        dynamicTasks.push({
          id: `act-${Date.now()}-skill-init`,
          title: `Run Skill Gap Analysis for ${roleName}`,
          subtitle: 'No skill gap assessment recorded yet — evaluate your competencies against standard benchmarks',
          category: 'Skill',
          timeframe: 'today',
          priority: 'Critical',
          isCompleted: false,
          targetPage: 'skill-gap',
          actionText: 'Run Skill Gap'
        });
      }

      // 2. Mock Interview task
      dynamicTasks.push({
        id: `act-${Date.now()}-interview`,
        title: 'Complete 1 Behavioral or Technical Mock Interview',
        subtitle: 'Practice real questions with Gemini AI feedback and STAR evaluation',
        category: 'Interview',
        timeframe: 'today',
        priority: 'High',
        isCompleted: false,
        targetPage: 'interview',
        actionText: 'Start Interview'
      });

      // 3. Project Blueprint task
      const existingProjectsCount = (resumeData.projects || []).length;
      dynamicTasks.push({
        id: `act-${Date.now()}-project`,
        title: existingProjectsCount > 0 ? 'Review & Enhance Portfolio Repository' : 'Generate Standout Portfolio Project Blueprint',
        subtitle: existingProjectsCount > 0 ? `${existingProjectsCount} projects documented — verify live links and READMEs` : 'Create production-grade project specifications tailored for recruiters',
        category: 'Project',
        timeframe: 'today',
        priority: 'Medium',
        isCompleted: false,
        targetPage: 'project-generator',
        actionText: existingProjectsCount > 0 ? 'Open Builder' : 'Generate Blueprint'
      });

      // 4. Resume task: use real resume analysis score if present; otherwise recommend first scan
      if (lastResumeAnalysis && typeof lastResumeAnalysis.overallScore === 'number') {
        dynamicTasks.push({
          id: `act-${Date.now()}-resume`,
          title: `Improve ATS Resume Score (Current: ${lastResumeAnalysis.overallScore}/100)`,
          subtitle: `Target: 90%+ by addressing missing keywords: ${lastResumeAnalysis.missingKeywords?.slice(0, 3).join(', ') || 'quantifiable metrics'}`,
          category: 'Resume',
          timeframe: 'this_week',
          priority: 'High',
          isCompleted: false,
          targetPage: 'resume-analyzer',
          actionText: 'Audit Resume'
        });
      } else {
        dynamicTasks.push({
          id: `act-${Date.now()}-resume-init`,
          title: 'Perform Initial ATS Resume Analysis',
          subtitle: 'No ATS resume scan recorded yet — audit your formatting, keyword density, and metrics',
          category: 'Resume',
          timeframe: 'this_week',
          priority: 'High',
          isCompleted: false,
          targetPage: 'resume-analyzer',
          actionText: 'Analyze Resume'
        });
      }

      // 5. Milestone task
      dynamicTasks.push({
        id: `act-${Date.now()}-milestone`,
        title: `Explore Career Growth Pathways for ${roleName}`,
        subtitle: 'Compare related roles, daily responsibilities, and market salary curves',
        category: 'Milestone',
        timeframe: 'this_week',
        priority: 'Medium',
        isCompleted: false,
        targetPage: 'career-comparison',
        actionText: 'Compare Roles'
      });

      setTasks(dynamicTasks);
      setIsRefreshing(false);
    }, 400);
  };

  const todayTasks = tasks.filter(t => t.timeframe === 'today');
  const weekTasks = tasks.filter(t => t.timeframe === 'this_week');

  const completedTodayCount = todayTasks.filter(t => t.isCompleted).length;
  const completedWeekCount = weekTasks.filter(t => t.isCompleted).length;
  const overallCompletedCount = tasks.filter(t => t.isCompleted).length;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#131b2e] border border-cyan-500/20 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[15px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Syne']">
              Career Action Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Intelligent recommendation engine converting your resume gaps, scores, and roadmaps into daily high-impact actions.
            </p>
          </div>
        </div>

        {/* Refresh & Streak Actions */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{userProfile.learningStreakDays} Day Streak</span>
          </div>

          <button
            onClick={regenerateSmartActions}
            disabled={isRefreshing}
            id="btn-refresh-action-center"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition-all flex items-center gap-1.5"
            title="Recalculate Actions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Recalculate Actions</span>
          </button>
        </div>
      </div>

      {/* Overview Progress Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0c101c] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-medium block">Today's Execution</span>
            <strong className="text-white text-lg font-bold font-['Syne']">{completedTodayCount} of {todayTasks.length} Completed</strong>
          </div>
          <span className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-sm font-mono">
            {todayTasks.length > 0 ? Math.round((completedTodayCount / todayTasks.length) * 100) : 0}%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c101c] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-medium block">Weekly Target Pace</span>
            <strong className="text-white text-lg font-bold font-['Syne']">{completedWeekCount} of {weekTasks.length} Done</strong>
          </div>
          <span className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-sm font-mono">
            {weekTasks.length > 0 ? Math.round((completedWeekCount / weekTasks.length) * 100) : 0}%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c101c] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-medium block">Career Readiness Impact</span>
            <strong className="text-emerald-400 text-lg font-bold font-['Syne']">+{overallCompletedCount * 2}% Momentum</strong>
          </div>
          <Sparkles className="w-6 h-6 text-emerald-400" />
        </div>
      </div>

      {/* EMPTY STATE OR TASK LIST */}
      {tasks.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-['Syne']">No Action Tasks Queued</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate daily and weekly focus tasks tailored to your target role ({userProfile.targetRole || 'Software Engineer'}) and current skill profile.
            </p>
          </div>
          <button
            onClick={regenerateSmartActions}
            id="btn-generate-first-tasks"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Recommended Actions</span>
          </button>
        </div>
      ) : (
        <>
          {/* TODAY'S ACTIONS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-white font-['Syne'] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>TODAY'S HIGH-PRIORITY ACTIONS</span>
              </h2>
              <span className="text-xs text-slate-400">Action items curated from your skill profile</span>
            </div>

            <div className="space-y-3">
              {todayTasks.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-400 text-center">
                  All daily tasks completed! Click "Recalculate Actions" above to generate new targets.
                </div>
              ) : (
                todayTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.isCompleted 
                  ? 'bg-[#090d16] border-emerald-500/30 opacity-75' 
                  : 'bg-[#0d121f] border-white/10 hover:border-cyan-500/40'
              }`}
            >
              {/* Checkbox & Title */}
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => toggleTask(task.id)}
                  id={`check-task-${task.id}`}
                  className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                    task.isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-white/20 hover:border-cyan-400 bg-white/5'
                  }`}
                >
                  {task.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {task.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priority === 'Critical' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold transition-all ${
                    task.isCompleted ? 'line-through text-slate-400' : 'text-white'
                  }`}>
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {task.subtitle}
                  </p>
                </div>
              </div>

              {/* Direct Launch Button */}
              {task.targetPage && (
                <button
                  onClick={() => setCurrentPage(task.targetPage!)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/10 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 self-end sm:self-center shrink-0"
                >
                  <span>{task.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
      </div>

      {/* THIS WEEK'S ACTIONS SECTION */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white font-['Syne'] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>THIS WEEK'S STRATEGIC MILESTONES</span>
          </h2>
          <span className="text-xs text-slate-400">Weekly progression targets</span>
        </div>

        <div className="space-y-3">
          {weekTasks.length === 0 ? (
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-400 text-center">
              All weekly targets achieved! Click "Recalculate Actions" above to set new milestone goals.
            </div>
          ) : (
            weekTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.isCompleted 
                    ? 'bg-[#090d16] border-emerald-500/30 opacity-75' 
                    : 'bg-[#0d121f] border-white/10 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleTask(task.id)}
                    id={`check-task-${task.id}`}
                    className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                      task.isCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-white/20 hover:border-indigo-400 bg-white/5'
                    }`}
                  >
                    {task.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {task.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-300">
                        This Week
                      </span>
                    </div>
                    <h3 className={`text-sm sm:text-base font-bold transition-all ${
                      task.isCompleted ? 'line-through text-slate-400' : 'text-white'
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {task.subtitle}
                    </p>
                  </div>
                </div>

                {task.targetPage && (
                  <button
                    onClick={() => setCurrentPage(task.targetPage!)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-200 border border-white/10 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 self-end sm:self-center shrink-0 cursor-pointer"
                  >
                    <span>{task.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      </>
      )}

    </div>
  );
};
