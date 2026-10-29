import React, { useState } from 'react';
import { ResumeData, UserProfile } from '../types';
import { getStoredResumeData, saveStoredResumeData, getStoredUserProfile } from '../lib/storage';
import { sampleResumeData, emptyResumeData } from '../data/initialData';
import { 
  FileEdit, Plus, Trash2, Printer, CheckCircle, Sparkles, User, 
  Briefcase, GraduationCap, FolderGit2, Wrench, Award, FileText, 
  Layers, RefreshCw, Download, ExternalLink
} from 'lucide-react';

export const ResumeBuilder: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(getStoredResumeData());
  const [activeSection, setActiveSection] = useState<'personal' | 'education' | 'experience' | 'projects' | 'skills' | 'certifications'>('personal');
  const [template, setTemplate] = useState<'ats-classic' | 'modern-tech' | 'minimal-executive'>('ats-classic');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateResume = (updated: ResumeData) => {
    setResumeData(updated);
    saveStoredResumeData(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleChangePersonal = (field: keyof ResumeData['personalInfo'], value: string) => {
    const updated = {
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [field]: value }
    };
    updateResume(updated);
  };

  // Sync from user profile
  const syncFromProfile = () => {
    const profile = getStoredUserProfile();
    const updated: ResumeData = {
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        fullName: profile.name || resumeData.personalInfo.fullName,
        email: profile.email || resumeData.personalInfo.email,
        summary: profile.bio || resumeData.personalInfo.summary,
        github: profile.githubUrl || resumeData.personalInfo.github,
        linkedin: profile.linkedinUrl || resumeData.personalInfo.linkedin,
        location: profile.location || resumeData.personalInfo.location
      },
      skills: profile.skills && profile.skills.length > 0 ? profile.skills : resumeData.skills
    };
    updateResume(updated);
  };

  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      highlights: ['']
    };
    const updated = { ...resumeData, experience: [...resumeData.experience, newExp] };
    updateResume(updated);
  };

  const handleDeleteExperience = (id: string) => {
    const updated = { ...resumeData, experience: resumeData.experience.filter(e => e.id !== id) };
    updateResume(updated);
  };

  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: '',
      technologies: '',
      description: '',
      link: ''
    };
    const updated = { ...resumeData, projects: [...resumeData.projects, newProj] };
    updateResume(updated);
  };

  const handleDeleteProject = (id: string) => {
    const updated = { ...resumeData, projects: resumeData.projects.filter(p => p.id !== id) };
    updateResume(updated);
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: ''
    };
    const updated = { ...resumeData, education: [...resumeData.education, newEdu] };
    updateResume(updated);
  };

  const handleDeleteEducation = (id: string) => {
    const updated = { ...resumeData, education: resumeData.education.filter(e => e.id !== id) };
    updateResume(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadSample = () => {
    if (window.confirm("Load sample resume template with demonstration data? Any unsaved edits will be replaced.")) {
      updateResume(sampleResumeData);
    }
  };

  const handleClearResume = () => {
    if (window.confirm("Clear all resume fields to start completely fresh?")) {
      updateResume(emptyResumeData);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner (hidden during print) */}
      <div className="text-center max-w-3xl mx-auto space-y-3 print:hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <FileEdit className="w-3.5 h-3.5 text-emerald-400" />
          <span>ATS Compliant Resume Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">
          Interactive ATS Resume Builder
        </h1>
        <p className="text-slate-300 text-sm">
          Design clean, recruiter-optimized single-page resumes. Real-time side-by-side paper preview with direct browser PDF generation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={syncFromProfile}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync from Career Profile
          </button>
          
          <button
            onClick={handleLoadSample}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Load synthetic sample template"
          >
            <Sparkles className="w-3.5 h-3.5" /> Load Sample Demo Resume
          </button>

          <button
            onClick={handleClearResume}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs font-semibold text-slate-400 hover:text-rose-300 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Clear all fields"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All Fields
          </button>

          <button
            onClick={handlePrint}
            id="btn-print-resume"
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>

        {/* Demo Template Active Warning */}
        {Boolean(resumeData.personalInfo.fullName === "Jane Doe" || resumeData.personalInfo.email === "jane.doe@example.com") && (
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3 text-left max-w-2xl mx-auto mt-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 font-mono text-[10px] font-bold uppercase">DEMO DATA</span>
              <span>Sample template data is currently loaded. Replace all placeholder achievements and metrics with your genuine background.</span>
            </div>
            <button
              onClick={handleClearResume}
              className="underline text-[11px] text-amber-300 hover:text-white shrink-0 cursor-pointer"
            >
              Clear Demo Data
            </button>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2 print:hidden animate-in fade-in">
          <CheckCircle className="w-4 h-4" /> Changes saved to local storage!
        </div>
      )}

      {/* Grid Layout: Controls on Left, Document on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Controls (hidden during print) */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          
          {/* Template Switcher */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <label className="block text-xs font-bold text-slate-300">Resume Format Template</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ats-classic', label: 'ATS Classic' },
                { id: 'modern-tech', label: 'Modern Tech' },
                { id: 'minimal-executive', label: 'Clean Minimal' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id as any)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    template === t.id
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-sm'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Section Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveSection('personal')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSection === 'personal' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Personal
            </button>
            <button
              onClick={() => setActiveSection('experience')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSection === 'experience' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Experience
            </button>
            <button
              onClick={() => setActiveSection('projects')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSection === 'projects' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" /> Projects
            </button>
            <button
              onClick={() => setActiveSection('education')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSection === 'education' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Education
            </button>
            <button
              onClick={() => setActiveSection('skills')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSection === 'skills' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" /> Skills
            </button>
          </div>

          {/* Active Section Editor */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            
            {/* Personal Details */}
            {activeSection === 'personal' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white border-b border-white/10 pb-2">Header & Contact Details</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => handleChangePersonal('fullName', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Email</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handleChangePersonal('email', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handleChangePersonal('phone', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => handleChangePersonal('location', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => handleChangePersonal('linkedin', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">GitHub</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => handleChangePersonal('github', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Professional Summary</label>
                  <textarea
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => handleChangePersonal('summary', e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Experience Editor */}
            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="font-bold text-sm text-white">Work Experience</h3>
                  <button
                    onClick={handleAddExperience}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3 h-3" /> Add Role
                  </button>
                </div>

                {resumeData.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Role #{idx + 1}</span>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].company = e.target.value;
                          updateResume({ ...resumeData, experience: updated });
                        }}
                        className="bg-black/30 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].role = e.target.value;
                          updateResume({ ...resumeData, experience: updated });
                        }}
                        className="bg-black/30 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Dates (e.g. 2024 - Present)"
                        value={`${exp.startDate} - ${exp.endDate}`}
                        onChange={(e) => {
                          const parts = e.target.value.split('-');
                          const updated = [...resumeData.experience];
                          updated[idx].startDate = parts[0]?.trim() || '';
                          updated[idx].endDate = parts[1]?.trim() || '';
                          updateResume({ ...resumeData, experience: updated });
                        }}
                        className="bg-black/30 border border-white/10 rounded-lg p-2 text-xs text-white col-span-2"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Bullet points (one per line)</label>
                      <textarea
                        rows={3}
                        value={exp.highlights.join('\n')}
                        onChange={(e) => {
                          const updated = [...resumeData.experience];
                          updated[idx].highlights = e.target.value.split('\n').filter(Boolean);
                          updateResume({ ...resumeData, experience: updated });
                        }}
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Editor */}
            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="font-bold text-sm text-white">Featured Projects</h3>
                  <button
                    onClick={handleAddProject}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3 h-3" /> Add Project
                  </button>
                </div>

                {resumeData.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Project #{idx + 1}</span>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[idx].title = e.target.value;
                        updateResume({ ...resumeData, projects: updated });
                      }}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-xs text-white"
                    />

                    <input
                      type="text"
                      placeholder="Technologies (e.g. React, Node.js, PostgreSQL)"
                      value={proj.technologies}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[idx].technologies = e.target.value;
                        updateResume({ ...resumeData, projects: updated });
                      }}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-xs text-white"
                    />

                    <textarea
                      rows={2}
                      placeholder="Project description & key metrics..."
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[idx].description = e.target.value;
                        updateResume({ ...resumeData, projects: updated });
                      }}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Education Editor */}
            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="font-bold text-sm text-white">Education Details</h3>
                  <button
                    onClick={handleAddEducation}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3 h-3" /> Add Degree
                  </button>
                </div>

                {resumeData.education.map((edu, idx) => (
                  <div key={edu.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Degree #{idx + 1}</span>
                      <button
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Institution / University"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...resumeData.education];
                        updated[idx].institution = e.target.value;
                        updateResume({ ...resumeData, education: updated });
                      }}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-xs text-white"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Degree & Major"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].degree = e.target.value;
                          updateResume({ ...resumeData, education: updated });
                        }}
                        className="bg-black/30 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Year (e.g. 2022 - 2026)"
                        value={`${edu.startDate} - ${edu.endDate}`}
                        onChange={(e) => {
                          const parts = e.target.value.split('-');
                          const updated = [...resumeData.education];
                          updated[idx].startDate = parts[0]?.trim() || '';
                          updated[idx].endDate = parts[1]?.trim() || '';
                          updateResume({ ...resumeData, education: updated });
                        }}
                        className="bg-black/30 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills Editor */}
            {activeSection === 'skills' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white border-b border-white/10 pb-2">Technical Skills & Tools</h3>
                <p className="text-xs text-slate-400">Enter skills separated by commas</p>
                <textarea
                  rows={4}
                  value={resumeData.skills.join(', ')}
                  onChange={(e) => {
                    const updated = {
                      ...resumeData,
                      skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    };
                    updateResume(updated);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-emerald-500 outline-none leading-relaxed"
                />
              </div>
            )}

          </div>

          {/* Print Notice */}
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> How to Save as PDF:
            </p>
            <p className="text-[11px] text-slate-300 leading-snug">
              Click <strong>"Print / Save PDF"</strong> above. In the print dialog, set Destination to <em>"Save as PDF"</em> and uncheck <em>"Headers and Footers"</em> for a clean 1-page document.
            </p>
          </div>

        </div>

        {/* Right Live Paper Resume Preview */}
        <div 
          id="printable-resume"
          className={`lg:col-span-7 bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl font-sans text-xs space-y-4 print:w-full print:p-0 print:m-0 print:shadow-none print:rounded-none border border-slate-200 ${
            template === 'modern-tech' ? 'border-t-8 border-t-cyan-700' : ''
          }`}
        >
          
          {/* Sample Data Warning Banner */}
          {resumeData.personalInfo.fullName === sampleResumeData.personalInfo.fullName && (
            <div className="p-2 mb-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-[11px] flex items-center justify-between print:hidden">
              <span className="font-semibold">⚠️ Sample Demo Template Loaded — Please replace with your actual personal credentials before exporting or printing.</span>
              <button onClick={handleClearResume} className="text-amber-700 underline font-bold cursor-pointer hover:text-amber-900 ml-2">Clear</button>
            </div>
          )}

          {/* Header */}
          <div className={`border-b border-slate-300 pb-3 text-center space-y-1 ${template === 'modern-tech' ? 'text-left' : ''}`}>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900 font-['Syne']">
              {resumeData.personalInfo.fullName || "Your Full Name"}
            </h2>
            <div className={`flex flex-wrap items-center gap-2 text-[11px] text-slate-600 ${template === 'modern-tech' ? 'justify-start' : 'justify-center'}`}>
              {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
              {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
              {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
              {resumeData.personalInfo.linkedin && <span>• {resumeData.personalInfo.linkedin}</span>}
              {resumeData.personalInfo.github && <span>• {resumeData.personalInfo.github}</span>}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.personalInfo.summary && (
            <div className="space-y-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">
                Professional Summary
              </h3>
              <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                {resumeData.personalInfo.summary}
              </p>
            </div>
          )}

          {/* Technical Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="space-y-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">
                Technical Skills & Competencies
              </h3>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                <strong>Core Technologies:</strong> {resumeData.skills.join(' • ')}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {resumeData.experience && resumeData.experience.some(e => e.role?.trim() || e.company?.trim()) && (
            <div className="space-y-2.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">
                Professional Experience
              </h3>
              {resumeData.experience
                .filter(exp => exp.role?.trim() || exp.company?.trim() || exp.highlights?.some(h => h.trim().length > 0))
                .map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                    <span>{exp.role || 'Role'} {exp.company && <span className="font-semibold text-slate-600">| {exp.company}</span>}</span>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-[10px] text-slate-600 font-medium">{exp.startDate} - {exp.endDate}</span>
                    )}
                  </div>
                  {exp.highlights && exp.highlights.filter(h => h.trim().length > 0).length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5">
                      {exp.highlights
                        .filter(h => h.trim().length > 0)
                        .map((h, i) => (
                          <li key={i} className="leading-snug">{h}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {resumeData.projects && resumeData.projects.some(p => p.title?.trim() || p.description?.trim()) && (
            <div className="space-y-2.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">
                Selected Projects & Architectures
              </h3>
              {resumeData.projects
                .filter(proj => proj.title?.trim() || proj.description?.trim())
                .map((proj) => (
                <div key={proj.id} className="space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                    <span>{proj.title}</span>
                    {proj.technologies && <span className="text-[10px] text-slate-600 font-mono">{proj.technologies}</span>}
                  </div>
                  {proj.description && <p className="text-[11px] text-slate-700 leading-snug">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resumeData.education && resumeData.education.some(e => e.institution?.trim() || e.degree?.trim()) && (
            <div className="space-y-1.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">
                Education
              </h3>
              {resumeData.education
                .filter(edu => edu.institution?.trim() || edu.degree?.trim())
                .map((edu) => (
                <div key={edu.id} className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree || 'Degree'}</span>
                    {edu.institution && <span className="text-slate-600"> — {edu.institution}</span>}
                    {edu.grade && <span className="text-slate-500 font-mono text-[10px]"> ({edu.grade})</span>}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-[10px] text-slate-600 font-medium">{edu.startDate} - {edu.endDate}</span>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
