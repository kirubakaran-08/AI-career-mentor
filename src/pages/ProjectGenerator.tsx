import React, { useState } from 'react';
import { UserProfile, GeneratedProject, GoalItem, PageType } from '../types';
import { generateCareerProjects } from '../lib/aiService';
import { 
  getStoredSavedProjects, 
  saveStoredSavedProjects,
  getStoredGoals,
  saveStoredGoals
} from '../lib/storage';
import { 
  Layers, 
  Sparkles, 
  Code2, 
  Bookmark, 
  Check, 
  Copy, 
  ArrowRight, 
  RefreshCw, 
  FolderPlus, 
  ExternalLink, 
  FileText, 
  Cpu, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

interface ProjectGeneratorProps {
  userProfile: UserProfile;
  setCurrentPage: (page: PageType) => void;
}

export const ProjectGenerator: React.FC<ProjectGeneratorProps> = ({ userProfile, setCurrentPage }) => {
  const [targetCareer, setTargetCareer] = useState(userProfile.targetRole || 'Full Stack Developer');
  const [skillLevel, setSkillLevel] = useState<'Entry-Level / Fresher' | 'Junior (0-2 yrs)' | 'Mid-Level (2-5 yrs)'>(
    (userProfile.experienceLevel as any) || 'Entry-Level / Fresher'
  );
  const [preferredTech, setPreferredTech] = useState('React 19 & Node.js Express');
  const [difficulty, setDifficulty] = useState<'Entry Portfolio' | 'Industry Grade' | 'High-Scale Production'>('Industry Grade');
  
  const [projects, setProjects] = useState<GeneratedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedProjects, setSavedProjects] = useState<GeneratedProject[]>(() => getStoredSavedProjects());
  const [activeTab, setActiveTab] = useState<'generator' | 'saved'>('generator');
  
  const [copiedResumeId, setCopiedResumeId] = useState<string | null>(null);
  const [copiedReadmeId, setCopiedReadmeId] = useState<string | null>(null);
  const [addedGoalId, setAddedGoalId] = useState<string | null>(null);

  const careerOptions = [
    'Full Stack Developer',
    'AI & GenAI Engineer',
    'Data Scientist',
    'Data Analyst',
    'Machine Learning Engineer',
    'DevOps & Cloud Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Cyber Security Specialist'
  ];

  const techOptions = [
    'React 19 & Node.js Express',
    'Next.js 15 & PostgreSQL',
    'Python, FastAPI & Gemini API',
    'PyTorch & Scikit-Learn',
    'Docker, Kubernetes & AWS',
    'TypeScript, Redis & WebSockets',
    'Go, Docker & gRPC'
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const generated = await generateCareerProjects({
        targetCareer,
        skillLevel,
        preferredTech,
        difficulty
      });
      setProjects(generated);
    } catch (e) {
      console.error('Failed to generate projects:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate on initial load if empty
  React.useEffect(() => {
    if (projects.length === 0) {
      handleGenerate();
    }
  }, []);

  const toggleSaveProject = (project: GeneratedProject) => {
    const isSaved = savedProjects.some(p => p.id === project.id);
    let updated: GeneratedProject[];
    if (isSaved) {
      updated = savedProjects.filter(p => p.id !== project.id);
    } else {
      updated = [...savedProjects, project];
    }
    setSavedProjects(updated);
    saveStoredSavedProjects(updated);
  };

  const copyToClipboard = (text: string, type: 'resume' | 'readme', id: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'resume') {
      setCopiedResumeId(id);
      setTimeout(() => setCopiedResumeId(null), 2000);
    } else {
      setCopiedReadmeId(id);
      setTimeout(() => setCopiedReadmeId(null), 2000);
    }
  };

  const addProjectAsGoal = (project: GeneratedProject) => {
    const existingGoals = getStoredGoals();
    const newGoal: GoalItem = {
      id: `goal-proj-${Date.now()}`,
      title: `Build & deploy "${project.title}"`,
      type: 'Weekly',
      category: 'Projects',
      targetDate: 'Next 2 Weeks',
      isCompleted: false,
      progressPercentage: 0
    };
    const updated = [newGoal, ...existingGoals];
    saveStoredGoals(updated);
    setAddedGoalId(project.id);
    setTimeout(() => setAddedGoalId(null), 2500);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#131b2e] border border-cyan-500/20 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[15px] flex items-center justify-center">
              <Layers className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Syne']">
              Project Idea Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Generate standout, production-grade portfolio projects tailored for tech recruiter screening.
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'generator' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Project Generator
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'saved' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedProjects.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'generator' && (
        <>
          {/* Custom Controls Form */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0c101c] border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Customization Criteria</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Target Career */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Target Career</label>
                <select
                  value={targetCareer}
                  onChange={(e) => setTargetCareer(e.target.value)}
                  id="select-project-career"
                  className="w-full bg-[#111625] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                >
                  {careerOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Skill Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  id="select-project-level"
                  className="w-full bg-[#111625] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="Entry-Level / Fresher">Entry-Level / Fresher</option>
                  <option value="Junior (0-2 yrs)">Junior (0-2 yrs)</option>
                  <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                </select>
              </div>

              {/* Preferred Tech */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Preferred Tech Stack</label>
                <select
                  value={preferredTech}
                  onChange={(e) => setPreferredTech(e.target.value)}
                  id="select-project-tech"
                  className="w-full bg-[#111625] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                >
                  {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Project Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Target Complexity</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  id="select-project-difficulty"
                  className="w-full bg-[#111625] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="Entry Portfolio">Entry Portfolio</option>
                  <option value="Industry Grade">Industry Grade</option>
                  <option value="High-Scale Production">High-Scale Production</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                id="btn-generate-projects"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate Unique Project Ideas</span>
              </button>
            </div>
          </div>

          {/* Generated Projects List */}
          <div className="space-y-6">
            {projects.map((proj) => {
              const isSaved = savedProjects.some(p => p.id === proj.id);
              const isGoalAdded = addedGoalId === proj.id;

              return (
                <div
                  key={proj.id}
                  className="p-6 sm:p-7 rounded-2xl bg-[#0d121f] border border-white/10 hover:border-cyan-500/40 transition-all shadow-xl space-y-5"
                >
                  {/* Title & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] font-bold">
                          {proj.targetCareer}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] font-bold">
                          {proj.difficulty}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ~{proj.estimatedHours} Hours
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white font-['Syne']">
                        {proj.title}
                      </h3>
                    </div>

                    {/* Bookmark & Goal Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveProject(proj)}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isSaved 
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                            : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
                        }`}
                        title="Save to My Projects"
                      >
                        <Bookmark className="w-4 h-4" />
                        <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                      </button>

                      <button
                        onClick={() => addProjectAsGoal(proj)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isGoalAdded
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                        }`}
                      >
                        {isGoalAdded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FolderPlus className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>{isGoalAdded ? 'Added to Goals!' : 'Add as Goal'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Problem & Real-World Use Case */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block">
                        Problem Statement
                      </span>
                      <p className="text-slate-300 leading-relaxed">{proj.problemStatement}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                        Real-World Enterprise Use Case
                      </span>
                      <p className="text-slate-300 leading-relaxed">{proj.realWorldUseCase}</p>
                    </div>
                  </div>

                  {/* Key Features & Stack */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Core Architecture & Features
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {proj.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies & Dataset */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-slate-400 font-medium">Stack:</span>
                    {proj.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-slate-200 text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Resume Bullet Point & GitHub README Snippet */}
                  <div className="pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Resume Bullet Point */}
                    <div className="p-3.5 rounded-xl bg-[#090d16] border border-cyan-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          Resume Impact Bullet
                        </span>
                        <button
                          onClick={() => copyToClipboard(proj.resumeDescription, 'resume', proj.id)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedResumeId === proj.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedResumeId === proj.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 font-mono italic leading-relaxed">
                        "{proj.resumeDescription}"
                      </p>
                    </div>

                    {/* GitHub README Outline */}
                    <div className="p-3.5 rounded-xl bg-[#090d16] border border-purple-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-purple-400" />
                          GitHub README Outline
                        </span>
                        <button
                          onClick={() => copyToClipboard(proj.githubReadmeOutline, 'readme', proj.id)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedReadmeId === proj.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedReadmeId === proj.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="text-[11px] text-slate-400 font-mono whitespace-pre-wrap truncate h-12 overflow-hidden">
                        {proj.githubReadmeOutline}
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Saved Projects Tab */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedProjects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0c101c] border border-white/10 space-y-3">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Saved Projects Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Generate project blueprints above and bookmark the ones you plan to build for your portfolio.
              </p>
              <button
                onClick={() => setActiveTab('generator')}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
              >
                Browse Generator
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedProjects.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl bg-[#0d121f] border border-white/10 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-base font-['Syne']">{p.title}</h4>
                    <button
                      onClick={() => toggleSaveProject(p)}
                      className="text-rose-400 hover:text-rose-300 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">{p.problemStatement}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.technologies.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
