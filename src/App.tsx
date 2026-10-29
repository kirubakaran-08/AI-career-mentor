import React, { useState, useEffect } from 'react';
import { PageType, UserProfile, GoalItem, CertificateRecord } from './types';
import { 
  getStoredUserProfile, saveStoredUserProfile, 
  getStoredGoals, saveStoredGoals, 
  getStoredCertificates, saveStoredCertificates 
} from './lib/storage';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { CommandPalette } from './components/CommandPalette';
import { PWAInstaller } from './components/PWAInstaller';

import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { SkillGapAnalysis } from './pages/SkillGapAnalysis';
import { RoadmapGenerator } from './pages/RoadmapGenerator';
import { InterviewPractice } from './pages/InterviewPractice';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { CertificateTracker } from './pages/CertificateTracker';
import { GoalTracker } from './pages/GoalTracker';
import { SettingsPage } from './pages/Settings';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { OfflineIndicator } from './components/OfflineIndicator';

// Phase 3 — AI Career Intelligence Upgrade Pages
import { AICareerChat } from './pages/AICareerChat';
import { JobReadiness } from './pages/JobReadiness';
import { CareerComparison } from './pages/CareerComparison';
import { ProjectGenerator } from './pages/ProjectGenerator';
import { JobMatcher } from './pages/JobMatcher';
import { ActionCenter } from './pages/ActionCenter';
import { CareerInsights } from './pages/CareerInsights';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const reqPage = params.get('page') as PageType;
        const validPages: PageType[] = [
          'home', 'dashboard', 'resume-analyzer', 'skill-gap', 'roadmap',
          'interview', 'resume-builder', 'profile', 'certificates', 'goals',
          'settings', 'about', 'contact', 'ai-career-chat', 'job-readiness',
          'career-comparison', 'project-generator', 'job-matcher', 'action-center',
          'career-insights'
        ];
        if (reqPage && validPages.includes(reqPage)) {
          return reqPage;
        }
      }
    } catch (e) {
      // fallback
    }
    return 'home';
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile());
  const [goals, setGoals] = useState<GoalItem[]>(getStoredGoals());
  const [certificates, setCertificates] = useState<CertificateRecord[]>(getStoredCertificates());
  
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [showPWAInstaller, setShowPWAInstaller] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Catch PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPWAInstaller(false);
      }
    } else {
      setShowPWAInstaller(true);
    }
  };

  // Sync state changes to localStorage and listen for external storage changes
  useEffect(() => {
    saveStoredUserProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveStoredGoals(goals);
  }, [goals]);

  useEffect(() => {
    saveStoredCertificates(certificates);
  }, [certificates]);

  useEffect(() => {
    const handleStorageChange = () => {
      const freshProfile = getStoredUserProfile();
      setUserProfile(prev => JSON.stringify(prev) === JSON.stringify(freshProfile) ? prev : freshProfile);

      const freshGoals = getStoredGoals();
      setGoals(prev => JSON.stringify(prev) === JSON.stringify(freshGoals) ? prev : freshGoals);

      const freshCerts = getStoredCertificates();
      setCertificates(prev => JSON.stringify(prev) === JSON.stringify(freshCerts) ? prev : freshCerts);
    };
    window.addEventListener('aicm_storage_change', handleStorageChange);
    return () => window.removeEventListener('aicm_storage_change', handleStorageChange);
  }, []);

  // Command palette keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleGoalCompletion = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        return { ...g, isCompleted: !g.isCompleted };
      }
      return g;
    });
    setGoals(updated);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            setCurrentPage={setCurrentPage}
            userProfile={userProfile}
            toggleAIChat={() => setIsAIChatOpen(!isAIChatOpen)}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            setCurrentPage={setCurrentPage}
            userProfile={userProfile}
            goals={goals}
            certificates={certificates}
            toggleGoalCompletion={toggleGoalCompletion}
          />
        );
      case 'profile':
        return (
          <Profile
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'resume-analyzer':
        return <ResumeAnalyzer userProfile={userProfile} />;
      case 'skill-gap':
        return <SkillGapAnalysis userProfile={userProfile} />;
      case 'roadmap':
        return <RoadmapGenerator setCurrentPage={setCurrentPage} />;
      case 'interview':
        return <InterviewPractice userProfile={userProfile} />;
      case 'resume-builder':
        return <ResumeBuilder />;
      case 'certificates':
        return <CertificateTracker certificates={certificates} setCertificates={setCertificates} />;
      case 'goals':
        return (
          <GoalTracker
            goals={goals}
            setGoals={setGoals}
            toggleGoalCompletion={toggleGoalCompletion}
          />
        );
      case 'ai-career-chat':
        return <AICareerChat userProfile={userProfile} setCurrentPage={setCurrentPage} />;
      case 'job-readiness':
        return (
          <JobReadiness
            userProfile={userProfile}
            goals={goals}
            certificates={certificates}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'career-comparison':
        return <CareerComparison userProfile={userProfile} setCurrentPage={setCurrentPage} />;
      case 'project-generator':
        return <ProjectGenerator userProfile={userProfile} setCurrentPage={setCurrentPage} />;
      case 'job-matcher':
        return <JobMatcher userProfile={userProfile} setCurrentPage={setCurrentPage} />;
      case 'action-center':
        return <ActionCenter userProfile={userProfile} setCurrentPage={setCurrentPage} />;
      case 'career-insights':
        return <CareerInsights userProfile={userProfile} setCurrentPage={setCurrentPage} />;
      case 'settings':
        return (
          <SettingsPage 
            userProfile={userProfile} 
            setUserProfile={setUserProfile}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <Home
            setCurrentPage={setCurrentPage}
            userProfile={userProfile}
            toggleAIChat={() => setIsAIChatOpen(!isAIChatOpen)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 antialiased relative">
      
      {/* Offline Status Warning & Notification Banner */}
      <OfflineIndicator />

      {/* Global Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userProfile={userProfile}
        toggleAIChat={() => setIsAIChatOpen(!isAIChatOpen)}
        openCommandPalette={() => setIsCommandPaletteOpen(true)}
        showPWAInstallPrompt={Boolean(deferredPrompt)}
        onInstallPWA={handleInstallPWA}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* Floating Aura AI Mentor Assistant Window */}
      <FloatingAIAssistant
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        userProfile={userProfile}
      />

      {/* Cmd + K Command Search Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setCurrentPage={setCurrentPage}
        toggleAIChat={() => setIsAIChatOpen(true)}
      />

      {/* PWA Install Notification Prompt */}
      {showPWAInstaller && (
        <PWAInstaller onDismiss={() => setShowPWAInstaller(false)} />
      )}

    </div>
  );
}
