import React, { useState, useRef } from 'react';
import { AppSettings, UserProfile, PageType } from '../types';
import { 
  getStoredSettings, 
  saveStoredSettings, 
  saveStoredUserProfile,
  resetStoredUserProfile,
  resetAllData, 
  seedSampleDemoData,
  exportFullCareerDataBackup, 
  importFullCareerDataBackup, 
  downloadBackupFile,
  calculateStorageUsage 
} from '../lib/storage';
import { emptyUserProfile } from '../data/initialData';
import { compressAndResizeImage, validateImageFile } from '../lib/imageUtils';
import { UserAvatar } from '../components/UserAvatar';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Palette, 
  Bell, 
  RefreshCw, 
  CheckCircle, 
  ShieldAlert, 
  Download, 
  Upload, 
  HardDrive, 
  ShieldCheck, 
  Lock, 
  FileJson, 
  Trash2, 
  Volume2, 
  Sliders, 
  Sparkles,
  ExternalLink,
  User,
  Database,
  Eye,
  Server,
  Camera,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

interface SettingsProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  setCurrentPage?: (page: PageType) => void;
}

export const SettingsPage: React.FC<SettingsProps> = ({ userProfile, setUserProfile, setCurrentPage }) => {
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [demoLoadedSuccess, setDemoLoadedSuccess] = useState(false);
  const [profileResetSuccess, setProfileResetSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [storageInfo, setStorageInfo] = useState(calculateStorageUsage());
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoToast, setPhotoToast] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setIsProcessingPhoto(true);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setPhotoError(validation.error || 'Invalid image file.');
      setIsProcessingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
      return;
    }

    try {
      const compressedDataUrl = await compressAndResizeImage(file, 320, 320, 0.85);
      const updatedProfile: UserProfile = {
        ...userProfile,
        avatarUrl: compressedDataUrl
      };

      setUserProfile(updatedProfile);
      saveStoredUserProfile(updatedProfile);
      setStorageInfo(calculateStorageUsage());

      setPhotoToast('Profile photo updated successfully!');
      setTimeout(() => setPhotoToast(null), 3000);
    } catch (err: any) {
      setPhotoError(err.message || 'Failed to process image.');
    } finally {
      setIsProcessingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setPhotoError(null);
    const updatedProfile: UserProfile = {
      ...userProfile,
      avatarUrl: ''
    };

    setUserProfile(updatedProfile);
    saveStoredUserProfile(updatedProfile);
    setStorageInfo(calculateStorageUsage());

    setPhotoToast('Profile photo removed. Default avatar restored.');
    setTimeout(() => setPhotoToast(null), 3000);
  };

  const handleToggle = (key: keyof AppSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    saveStoredSettings(updated);
    showSavedNotification();
  };

  const handleColorChange = (color: AppSettings['themeColor']) => {
    const updated = { ...settings, themeColor: color };
    setSettings(updated);
    saveStoredSettings(updated);
    showSavedNotification();
  };

  const showSavedNotification = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importFullCareerDataBackup(content);
      setImportStatus(res);
      if (res.success) {
        setStorageInfo(calculateStorageUsage());
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadDemoData = () => {
    if (window.confirm("Load sample portfolio demo data? This will populate your dashboard with pre-configured software engineering goals, certifications, roadmap progress, and resume audits for demonstration.")) {
      seedSampleDemoData();
      setStorageInfo(calculateStorageUsage());
      setDemoLoadedSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  };

  const handleResetProfile = () => {
    if (window.confirm("This will remove your saved career profile from this device. Continue?")) {
      resetStoredUserProfile();
      setUserProfile({ ...emptyUserProfile });
      setProfileResetSuccess(true);
      setStorageInfo(calculateStorageUsage());
      setTimeout(() => setProfileResetSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all local career data, goals, and certificates? This action cannot be undone.")) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      {/* Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-300 text-xs font-semibold">
          <SettingsIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">
          Settings & Data Management
        </h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Customize themes, AMOLED display modes, local storage backups, demo data seeding, and privacy safeguards.
        </p>
      </div>

      {savedSuccess && (
        <div 
          id="toast-settings-saved"
          className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-lg animate-in fade-in"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" /> Preferences updated and saved!
        </div>
      )}

      {demoLoadedSuccess && (
        <div 
          id="toast-demo-loaded"
          className="p-3.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-lg animate-in fade-in"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" /> Sample portfolio demo data loaded successfully! Refreshing...
        </div>
      )}

      {profileResetSuccess && (
        <div 
          id="toast-settings-profile-reset"
          className="p-3.5 rounded-2xl bg-slate-800 border border-white/15 text-slate-200 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-lg animate-in fade-in"
        >
          <CheckCircle className="w-4 h-4 text-cyan-400" /> Career profile reset to clean first-time state.
        </div>
      )}

      {importStatus && (
        <div className={`p-3.5 rounded-2xl border text-xs font-semibold text-center flex items-center justify-center gap-2 animate-in fade-in ${
          importStatus.success 
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' 
            : 'bg-rose-500/20 border-rose-500/40 text-rose-200'
        }`}>
          {importStatus.success ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{importStatus.message}</span>
        </div>
      )}

      {photoToast && (
        <div 
          id="toast-settings-photo-success"
          className="p-3.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-lg animate-in fade-in"
        >
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>{photoToast}</span>
        </div>
      )}

      {photoError && (
        <div 
          id="toast-settings-photo-error"
          className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-lg animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{photoError}</span>
        </div>
      )}

      {/* Profile Shortcut & Photo Management Card */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <input 
          type="file" 
          ref={photoInputRef} 
          onChange={handlePhotoUpload} 
          accept="image/jpeg,image/png,image/webp,image/jpg" 
          className="hidden" 
          aria-label="Upload profile photo"
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Avatar with Clickable Camera Trigger */}
          <div className="relative group shrink-0">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={isProcessingPhoto}
              className="relative w-14 h-14 rounded-2xl ring-2 ring-cyan-500/40 hover:ring-cyan-400 p-0.5 bg-slate-900 shrink-0 overflow-hidden cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none flex items-center justify-center"
              title="Click or tap to change profile photo"
              aria-label="Click or tap to change profile photo"
            >
              <UserAvatar 
                avatarUrl={userProfile.avatarUrl} 
                name={userProfile.name} 
                size="lg" 
                className="w-full h-full object-cover rounded-xl" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-cyan-300">
                {isProcessingPhoto ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </div>
            </button>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white">{userProfile.name || 'Candidate Profile'}</h3>
            <p className="text-xs text-slate-400">{userProfile.targetRole || 'Software Engineer'} • {userProfile.experienceLevel}</p>
            
            {/* Quick Photo Actions */}
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={isProcessingPhoto}
                id="btn-settings-change-photo"
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                {isProcessingPhoto ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                <span>{userProfile.avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
              </button>

              {Boolean(userProfile.avatarUrl) && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  id="btn-settings-remove-photo"
                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {setCurrentPage && (
          <button
            type="button"
            onClick={() => setCurrentPage('profile')}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none shrink-0"
          >
            <User className="w-3.5 h-3.5" />
            <span>Edit Full Profile →</span>
          </button>
        )}
      </div>

      {/* Section 1: Backup & Local Data Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Data Portability & Backup Engine</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
            {storageInfo.usedFormatted} in {storageInfo.itemCount} items
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          AI Career Mentor stores all resumes, skill analyses, goals, mock interview responses, and custom generated projects on your device. Export a backup anytime or migrate to another device.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Export Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export Single-File Backup</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Download your complete career portfolio, ATS resume, goals, and history as a JSON file.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadBackupFile}
              id="btn-download-backup"
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
            >
              <Download className="w-3.5 h-3.5" /> Download (.json)
            </button>
          </div>

          {/* Import Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Restore Portfolio Backup</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Upload a previously exported backup file to restore your full career data and progress.
              </p>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileImport}
              className="hidden"
              aria-label="Upload JSON backup file"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              id="btn-upload-backup"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-purple-400 focus:outline-none"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Backup
            </button>
          </div>

          {/* Seed Demo Data Card */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Seed Sample Demo Data</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Populate with rich sample data to test drive resume audits, projects, and goals.
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleLoadDemoData}
              id="btn-load-demo-data"
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Sample Data
            </button>
          </div>

        </div>
      </div>

      {/* Section 2: Visual Themes & Color Accents */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Palette className="w-4 h-4 text-pink-400" />
          <h3 className="font-bold text-sm text-white">Visual Styling & Atmosphere</h3>
        </div>

        {/* Color Palette Picker */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Accent Theme Color</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'cyan', label: 'Neon Cyan', colorBg: 'bg-cyan-500', border: 'border-cyan-500' },
              { id: 'purple', label: 'Electric Purple', colorBg: 'bg-purple-500', border: 'border-purple-500' },
              { id: 'emerald', label: 'Emerald Green', colorBg: 'bg-emerald-500', border: 'border-emerald-500' },
              { id: 'amber', label: 'Gold Amber', colorBg: 'bg-amber-500', border: 'border-amber-500' }
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleColorChange(c.id as any)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none ${
                  settings.themeColor === c.id 
                    ? `border-white text-white bg-white/10 shadow-lg` 
                    : 'border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${c.colorBg} shrink-0`}></span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02]">
            <div>
              <label htmlFor="toggle-amoled" className="text-xs font-bold text-white cursor-pointer">AMOLED True Black Mode</label>
              <p className="text-[10px] text-slate-400">Deep pitch-black canvas for OLED mobile battery savings</p>
            </div>
            <input
              type="checkbox"
              id="toggle-amoled"
              checked={settings.amoledMode}
              onChange={() => handleToggle('amoledMode')}
              className="w-5 h-5 rounded text-cyan-500 accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02]">
            <div>
              <label htmlFor="toggle-animations" className="text-xs font-bold text-white cursor-pointer">Smooth Animations & Transitions</label>
              <p className="text-[10px] text-slate-400">Enable micro-animations and smooth layout shifts</p>
            </div>
            <input
              type="checkbox"
              id="toggle-animations"
              checked={settings.animationsEnabled}
              onChange={() => handleToggle('animationsEnabled')}
              className="w-5 h-5 rounded text-cyan-500 accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02]">
            <div>
              <label htmlFor="toggle-sound" className="text-xs font-bold text-white cursor-pointer">In-App Sound Feedback</label>
              <p className="text-[10px] text-slate-400">Subtle audio cues upon completing milestones and mock tasks</p>
            </div>
            <input
              type="checkbox"
              id="toggle-sound"
              checked={settings.soundEnabled}
              onChange={() => handleToggle('soundEnabled')}
              className="w-5 h-5 rounded text-cyan-500 accent-cyan-500 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Section 3: Privacy & Data Security Architecture */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-base text-white font-['Syne']">Privacy, Data Storage & AI Transparency</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>What Data Is Stored & Where</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              All profile inputs, resume contents, goal records, certificate trackers, and mock interview logs are stored <strong>strictly on your client device</strong> via browser <code>LocalStorage</code>. No central tracking databases are maintained.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>AI Service & API Interactions</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              When you trigger an AI audit or mock interview grading, request prompts are forwarded securely via our backend Express proxy to the Google Gemini API. Your data is <strong>never permanently retained</strong> or used to train external models.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
              <Download className="w-4 h-4 text-purple-400" />
              <span>Complete Data Portability</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              You maintain 100% ownership of your career assets. Export your data into standard JSON backups anytime, and seamlessly restore it on mobile phones, tablets, or new laptops.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Data Erasure & Reset</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              You can permanently erase all stored career records with a single click using the Reset action below, clearing all cache keys and browser storage entries instantly.
            </p>
          </div>

        </div>
      </div>

      {/* Career Profile Management & Reset */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Candidate Career Profile Data</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            {userProfile.name ? 'Profile Active' : 'First-Time Empty State'}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Remove only your candidate profile information (name, target role, education, technical skills, links, and avatar) from this device while preserving your custom goals, roadmap progress, certifications, and application settings.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleResetProfile}
            id="btn-reset-career-profile-settings"
            className="px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 hover:text-rose-100 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-rose-400 focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Career Profile
          </button>
          {setCurrentPage && (
            <button
              type="button"
              onClick={() => setCurrentPage('profile')}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" /> Go to Profile Editor
            </button>
          )}
        </div>
      </div>

      {/* Danger Zone: Full Reset */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h3 className="font-bold text-sm text-rose-200">Danger Zone: Factory Reset</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Resetting will erase all cached resumes, custom goals, added certifications, generated projects, and chat history. Make sure to download a backup first if you wish to retain your data.
        </p>
        <button
          type="button"
          onClick={handleReset}
          id="btn-reset-all-data"
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-rose-400 focus:outline-none"
        >
          <Trash2 className="w-3.5 h-3.5" /> Erase All Local Data & Reset
        </button>
      </div>

    </div>
  );
};

