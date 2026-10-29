import React, { useState, useRef, useEffect } from 'react';
import { PageType, UserProfile } from '../types';
import { saveStoredUserProfile, resetStoredUserProfile } from '../lib/storage';
import { emptyUserProfile } from '../data/initialData';
import { compressAndResizeImage, validateImageFile } from '../lib/imageUtils';
import { UserAvatar } from '../components/UserAvatar';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Link as LinkIcon, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Layers, 
  Award,
  Save,
  Plus,
  X,
  Compass,
  Camera,
  Trash2,
  Upload,
  AlertCircle,
  RefreshCw,
  ImageIcon,
  UserPlus
} from 'lucide-react';

interface ProfileProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  setCurrentPage: (page: PageType) => void;
}

export const Profile: React.FC<ProfileProps> = ({ userProfile, setUserProfile, setCurrentPage }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: userProfile.name || '',
    email: userProfile.email || '',
    title: userProfile.title || '',
    targetRole: userProfile.targetRole || '',
    experienceLevel: userProfile.experienceLevel || 'Entry-Level / Fresher',
    careerScore: userProfile.careerScore || 0,
    skillScore: userProfile.skillScore || 0,
    weeklyProgress: userProfile.weeklyProgress || 0,
    learningStreakDays: userProfile.learningStreakDays || 0,
    avatarUrl: userProfile.avatarUrl || '',
    bio: userProfile.bio || '',
    education: userProfile.education || '',
    institution: userProfile.institution || '',
    graduationYear: userProfile.graduationYear || '',
    skills: Array.isArray(userProfile.skills) ? userProfile.skills : [],
    preferredTechnologies: Array.isArray(userProfile.preferredTechnologies) ? userProfile.preferredTechnologies : [],
    githubUrl: userProfile.githubUrl || '',
    linkedinUrl: userProfile.linkedinUrl || '',
    portfolioUrl: userProfile.portfolioUrl || '',
    location: userProfile.location || ''
  });

  // Sync formData whenever userProfile prop changes (e.g. after reset)
  useEffect(() => {
    setFormData({
      name: userProfile.name || '',
      email: userProfile.email || '',
      title: userProfile.title || '',
      targetRole: userProfile.targetRole || '',
      experienceLevel: userProfile.experienceLevel || 'Entry-Level / Fresher',
      careerScore: userProfile.careerScore || 0,
      skillScore: userProfile.skillScore || 0,
      weeklyProgress: userProfile.weeklyProgress || 0,
      learningStreakDays: userProfile.learningStreakDays || 0,
      avatarUrl: userProfile.avatarUrl || '',
      bio: userProfile.bio || '',
      education: userProfile.education || '',
      institution: userProfile.institution || '',
      graduationYear: userProfile.graduationYear || '',
      skills: Array.isArray(userProfile.skills) ? userProfile.skills : [],
      preferredTechnologies: Array.isArray(userProfile.preferredTechnologies) ? userProfile.preferredTechnologies : [],
      githubUrl: userProfile.githubUrl || '',
      linkedinUrl: userProfile.linkedinUrl || '',
      portfolioUrl: userProfile.portfolioUrl || '',
      location: userProfile.location || ''
    });
  }, [userProfile]);

  const [newSkillInput, setNewSkillInput] = useState('');
  const [newTechInput, setNewTechInput] = useState('');
  const [saveToast, setSaveToast] = useState(false);
  const [resetToast, setResetToast] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccessToast, setPhotoSuccessToast] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasProfile = Boolean(formData.name?.trim() || formData.targetRole?.trim());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(formData);
    saveStoredUserProfile(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetProfile = () => {
    const confirmed = window.confirm("This will remove your saved career profile from this device. Continue?");
    if (!confirmed) return;

    resetStoredUserProfile();
    setUserProfile({ ...emptyUserProfile });
    setFormData({ ...emptyUserProfile });
    setSaveToast(false);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 3000);
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setIsProcessingPhoto(true);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setPhotoError(validation.error || 'Invalid image file.');
      setIsProcessingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      // Compress and resize image via canvas to lightweight data URL (max 320x320, 0.85 quality)
      const compressedDataUrl = await compressAndResizeImage(file, 320, 320, 0.85);

      const updatedProfile: UserProfile = {
        ...formData,
        avatarUrl: compressedDataUrl
      };

      // Instant preview and persistence
      setFormData(updatedProfile);
      setUserProfile(updatedProfile);
      saveStoredUserProfile(updatedProfile);

      setPhotoSuccessToast('Profile photo uploaded and saved successfully!');
      setTimeout(() => setPhotoSuccessToast(null), 3000);
    } catch (err: any) {
      setPhotoError(err.message || 'Failed to process image. Please try another image.');
    } finally {
      setIsProcessingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setPhotoError(null);
    const updatedProfile: UserProfile = {
      ...formData,
      avatarUrl: ''
    };

    setFormData(updatedProfile);
    setUserProfile(updatedProfile);
    saveStoredUserProfile(updatedProfile);

    setPhotoSuccessToast('Profile photo removed. Default avatar restored.');
    setTimeout(() => setPhotoSuccessToast(null), 3000);
  };

  const triggerFileInput = () => {
    setPhotoError(null);
    fileInputRef.current?.click();
  };

  const addSkill = () => {
    if (newSkillInput.trim() && !formData.skills?.includes(newSkillInput.trim())) {
      const updated = [...(formData.skills || []), newSkillInput.trim()];
      setFormData({ ...formData, skills: updated });
      setNewSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updated = (formData.skills || []).filter(s => s !== skillToRemove);
    setFormData({ ...formData, skills: updated });
  };

  const addTech = () => {
    if (newTechInput.trim() && !formData.preferredTechnologies?.includes(newTechInput.trim())) {
      const updated = [...(formData.preferredTechnologies || []), newTechInput.trim()];
      setFormData({ ...formData, preferredTechnologies: updated });
      setNewTechInput('');
    }
  };

  const removeTech = (techToRemove: string) => {
    const updated = (formData.preferredTechnologies || []).filter(t => t !== techToRemove);
    setFormData({ ...formData, preferredTechnologies: updated });
  };

  // Calculate profile completeness
  const completenessItems = [
    Boolean(formData.name?.trim()),
    Boolean(formData.targetRole?.trim()),
    Boolean(formData.bio?.trim()),
    Boolean(formData.education?.trim()),
    Boolean(formData.institution?.trim()),
    Boolean(formData.skills && formData.skills.length >= 2),
    Boolean(formData.githubUrl && formData.githubUrl.trim().length > 10),
    Boolean(formData.linkedinUrl && formData.linkedinUrl.trim().length > 10)
  ];
  const completenessScore = Math.round((completenessItems.filter(Boolean).length / completenessItems.length) * 100);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span>Professional Identity</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">
          Career Profile & Credentials
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto">
          Manage your candidate career profile. This information grounds your AI career mentor, resume audits, mock interviews, and personalized roadmaps.
        </p>
      </div>

      {/* First-Time Profile Onboarding Notice */}
      {!hasProfile && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-[#0d121f] to-indigo-950/60 border border-cyan-500/30 text-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white font-['Syne']">Create Your Career Profile</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            Add your career information to personalize your AI Career Mentor experience.
          </p>
        </div>
      )}

      {photoSuccessToast && (
        <div 
          id="toast-photo-success"
          className="p-3.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-lg animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{photoSuccessToast}</span>
        </div>
      )}

      {photoError && (
        <div 
          id="toast-photo-error"
          className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-lg animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{photoError}</span>
        </div>
      )}

      {saveToast && (
        <div 
          id="toast-profile-saved"
          className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Career profile saved and synchronized across all application tools!</span>
        </div>
      )}

      {resetToast && (
        <div 
          id="toast-profile-reset"
          className="p-3.5 rounded-2xl bg-slate-800 border border-white/15 text-slate-200 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-lg animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>Career profile reset to clean first-time state.</span>
        </div>
      )}

      {/* Overview Card & Interactive Profile Photo */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c1424] via-[#101a30] to-[#0c1424] border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left w-full md:w-auto">
          
          {/* Clickable Profile Avatar with Edit Overlay */}
          <div className="relative group shrink-0">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoFileChange} 
              accept="image/jpeg,image/png,image/webp,image/jpg" 
              className="hidden" 
              aria-label="Upload profile photo"
            />
            
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={isProcessingPhoto}
              id="btn-profile-avatar-trigger"
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-slate-900 border-2 border-cyan-500/40 hover:border-cyan-400 shadow-xl transition-all duration-200 cursor-pointer overflow-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none flex items-center justify-center"
              title="Click or tap to upload a new profile photo"
              aria-label="Click or tap to upload a new profile photo"
            >
              <UserAvatar 
                avatarUrl={formData.avatarUrl} 
                name={formData.name || 'Candidate'} 
                size="xl" 
                className="w-full h-full rounded-2xl object-cover" 
              />
              
              {/* Hover / Active Camera Overlay */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 sm:group-focus-visible:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-[10px] font-bold p-1 rounded-2xl">
                {isProcessingPhoto ? (
                  <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-cyan-400" />
                    <span>Change</span>
                  </>
                )}
              </div>
            </button>

            {/* Quick Badge indicator */}
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-md border-2 border-[#0c1424] transition-transform hover:scale-110 cursor-pointer"
              title="Change profile photo"
              aria-label="Change photo button"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Details & Photo Control Buttons */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white">{formData.name || 'Candidate Profile'}</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {formData.experienceLevel || 'Entry-Level / Fresher'}
              </span>
            </div>
            <p className="text-xs text-cyan-300 font-medium">{formData.targetRole || 'Role not specified yet'}</p>
            <p className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {formData.location || 'Location Not Specified'}
            </p>

            {/* Change / Remove Photo Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={isProcessingPhoto}
                id="btn-change-photo"
                className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {isProcessingPhoto ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{formData.avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
              </button>

              {Boolean(formData.avatarUrl) && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  id="btn-remove-photo"
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400 pt-0.5">
              Supports JPG, JPEG, PNG, or WEBP (auto-compressed for minimal storage).
            </p>
          </div>

        </div>

        {/* Profile Completeness Gauge */}
        <div className="w-full md:w-64 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Profile Completeness</span>
            <span className="font-extrabold text-cyan-400">{completenessScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${completenessScore}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            {completenessScore >= 80 ? 'Excellent! Profile is ready for AI guidance.' : 'Add your name, target role, education, and skills.'}
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Basic Information */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-3">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Target Role & Experience</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Role</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none"
                placeholder="e.g. Full Stack Developer, AI Engineer, Data Scientist"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                className="w-full bg-[#0d121f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none"
              >
                <option value="Entry-Level / Fresher">Entry-Level / Fresher</option>
                <option value="Junior (0-2 yrs)">Junior (0-2 yrs)</option>
                <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none"
                placeholder="e.g. San Francisco, CA / Remote / India"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Career Objective / Professional Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none leading-relaxed"
                placeholder="Brief summary of your background, career goals, and technical passions..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Education */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-3">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span>Academic Background</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Degree & Major</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 outline-none"
                placeholder="e.g. Bachelor of Science in Computer Science / B.Tech"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Graduation Year</label>
              <input
                type="text"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 outline-none"
                placeholder="e.g. 2026"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">University / Institution Name</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 outline-none"
                placeholder="e.g. Stanford University / State Technical College"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills & Preferred Stack */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-3">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Technical Skills & Preferred Tech Stack</span>
          </div>

          {/* Current Skills Chips */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">Technical Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills && formData.skills.length > 0 ? (
                formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs font-semibold"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No skills added yet. Add your core programming languages, frameworks, or tools below.</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 outline-none"
                placeholder="Type a skill and click Add (e.g. React, Python, TypeScript, Docker)..."
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Preferred Technologies Chips */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <label className="block text-xs font-semibold text-slate-300">Preferred Technologies (for AI Project Generator & Roadmaps)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.preferredTechnologies && formData.preferredTechnologies.length > 0 ? (
                formData.preferredTechnologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-semibold"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No preferred technologies added yet. Optional preferences for project generation.</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTechInput}
                onChange={(e) => setNewTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 outline-none"
                placeholder="Add tech preference (e.g. Next.js, PyTorch, GraphQL, AWS)..."
              />
              <button
                type="button"
                onClick={addTech}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: External Links & Portfolio */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-3">
            <LinkIcon className="w-4 h-4 text-pink-400" />
            <span>Portfolio & Social Links</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Profile</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 outline-none"
                placeholder="https://github.com/your-username"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 outline-none"
                placeholder="https://linkedin.com/in/your-username"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Personal Portfolio / Website</label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 outline-none"
                placeholder="https://yourportfolio.dev"
              />
            </div>
          </div>
        </div>

        {/* Submit & Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              id="btn-save-profile"
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              {hasProfile ? (
                <>
                  <Save className="w-4 h-4" /> Save Profile Changes
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Create Profile
                </>
              )}
            </button>

            {hasProfile && (
              <button
                type="button"
                onClick={handleResetProfile}
                id="btn-reset-career-profile"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title="Remove only your saved career profile"
              >
                <Trash2 className="w-3.5 h-3.5" /> Reset Career Profile
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage('resume-builder')}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Go to Resume Builder
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('job-readiness')}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            >
              <Award className="w-3.5 h-3.5 text-purple-400" /> Run Readiness Audit
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
