import React, { useState } from 'react';
import { careerRoadmaps } from '../data/initialData';
import { CareerRoadmap, PageType } from '../types';
import { Map, CheckCircle2, Circle, ArrowRight, Code, BookOpen, Award, Sparkles, FolderGit2 } from 'lucide-react';

interface RoadmapGeneratorProps {
  setCurrentPage: (page: PageType) => void;
}

export const RoadmapGenerator: React.FC<RoadmapGeneratorProps> = ({ setCurrentPage }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('full-stack');
  const [activeTab, setActiveTab] = useState<'roadmap' | 'projects' | 'certs' | 'interview'>('roadmap');

  const selectedRoadmap: CareerRoadmap = careerRoadmaps.find(r => r.roleId === selectedRoleId) || careerRoadmaps[0];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Map className="w-3.5 h-3.5 text-purple-400" />
          <span>Interactive Career Pathways</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">
          AI Tech Career Roadmaps
        </h1>
        <p className="text-slate-300 text-sm">
          Select your target role to view structured milestones from Beginner to Advanced, curated real-world projects, certifications, and interview preparation questions.
        </p>
      </div>

      {/* Role Picker Horizontal Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {careerRoadmaps.map((r) => {
          const isSelected = r.roleId === selectedRoleId;
          return (
            <button
              key={r.roleId}
              onClick={() => setSelectedRoleId(r.roleId)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 ring-2 ring-purple-400'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <span>{r.roleTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Role Header Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d121f] via-[#121828] to-[#0d121f] border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Selected Career Track
          </span>
          <h2 className="text-2xl font-extrabold text-white font-['Syne']">{selectedRoadmap.roleTitle}</h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{selectedRoadmap.description}</p>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roadmap' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Milestones
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'projects' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Projects ({selectedRoadmap.projects.length})
          </button>
          <button
            onClick={() => setActiveTab('certs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'certs' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Certificates
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'interview' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Interview Prep
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* 1. ROADMAP MILESTONES (Beginner, Intermediate, Advanced) */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8">
          
          {/* Beginner Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400">
                1. Beginner Phase (Foundations)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedRoadmap.beginner.map((stage) => (
                <div key={stage.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">{stage.title}</h4>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ~{stage.estimatedWeeks} Weeks
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{stage.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stage.topics.map((top, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded bg-white/10 text-slate-300">
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Intermediate Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-400">
                2. Intermediate Phase (Core Engineering)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedRoadmap.intermediate.map((stage) => (
                <div key={stage.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">{stage.title}</h4>
                    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      ~{stage.estimatedWeeks} Weeks
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{stage.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stage.topics.map((top, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded bg-white/10 text-slate-300">
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="w-3 h-3 rounded-full bg-purple-400"></span>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-purple-400">
                3. Advanced Phase (Production & Architecture)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedRoadmap.advanced.map((stage) => (
                <div key={stage.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-purple-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">{stage.title}</h4>
                    <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      ~{stage.estimatedWeeks} Weeks
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{stage.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stage.topics.map((top, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded bg-white/10 text-slate-300">
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedRoadmap.projects.map((p, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <FolderGit2 className="w-6 h-6 text-purple-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                  Portfolio Ready
                </span>
              </div>
              <h3 className="font-bold text-base text-white">{p.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {p.tags.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. CERTIFICATES TAB */}
      {activeTab === 'certs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedRoadmap.certificates.map((c, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{c.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Provider: {c.provider}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. INTERVIEW PREP TAB */}
      {activeTab === 'interview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Recommended Questions for {selectedRoadmap.roleTitle}</h3>
            <button
              onClick={() => setCurrentPage('interview')}
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              Launch Interactive AI Practice Simulator <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {selectedRoadmap.interviewPrep.map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-400">Question {idx + 1}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    {q.category}
                  </span>
                </div>
                <p className="text-xs font-medium text-white">{q.question}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
