import React, { useState } from 'react';
import { GoalItem } from '../types';
import { fireCelebrationConfetti } from '../lib/confetti';
import { CheckCircle2, Plus, Flame, Target, Trash2, Trophy, Sparkles } from 'lucide-react';

interface GoalTrackerProps {
  goals: GoalItem[];
  setGoals: (goals: GoalItem[]) => void;
  toggleGoalCompletion: (id: string) => void;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({ goals, setGoals, toggleGoalCompletion }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Career'>('Daily');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: GoalItem = {
      id: Date.now().toString(),
      title,
      type,
      category: 'Learning',
      targetDate: 'This Week',
      isCompleted: false,
      progressPercentage: 0
    };

    setGoals([newGoal, ...goals]);
    setTitle('');
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleToggle = (id: string) => {
    toggleGoalCompletion(id);
    const goal = goals.find(g => g.id === id);
    if (goal && !goal.isCompleted) {
      fireCelebrationConfetti();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Accountability Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">
          Goal & Milestone Tracker
        </h1>
        <p className="text-slate-300 text-sm">
          Set daily coding objectives, weekly project goals, and long-term career targets. Earn streak badges and confetti celebration bursts upon completion!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Add Goal Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleAddGoal} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white">Create New Goal</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Description</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete 2 LeetCode Medium problems"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Time Horizon</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full bg-[#0d121f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Daily">Daily Goal</option>
                <option value="Weekly">Weekly Goal</option>
                <option value="Monthly">Monthly Goal</option>
                <option value="Career">Career Milestone</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </button>
          </form>
        </div>

        {/* Goals List */}
        <div className="lg:col-span-8 space-y-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                goal.isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400'
                  : 'bg-white/5 border-white/10 text-slate-200 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={goal.isCompleted}
                  onChange={() => handleToggle(goal.id)}
                  className="w-5 h-5 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                />
                <div>
                  <h4 className={`font-bold text-sm text-white ${goal.isCompleted ? 'line-through text-slate-400' : ''}`}>
                    {goal.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span className="px-2 py-0.2 rounded bg-white/10 text-slate-300 font-semibold">{goal.type}</span>
                    <span>Target: {goal.targetDate}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => handleDeleteGoal(goal.id)} className="text-slate-500 hover:text-rose-400 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
