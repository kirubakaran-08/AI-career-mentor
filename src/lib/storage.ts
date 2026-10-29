import { 
  UserProfile, 
  ResumeData, 
  ResumeAnalysisResult, 
  SkillGapResult, 
  CertificateRecord, 
  GoalItem, 
  AppSettings, 
  ChatMessage,
  GeneratedProject,
  JobMatchResult,
  ActionCenterTask,
  JobReadinessReport,
  InterviewFeedback
} from '../types';
import { emptyUserProfile, initialUserProfile, sampleCandidateProfile, initialResumeData, sampleResumeData, emptyResumeData, sampleCertificates, sampleGoals } from '../data/initialData';

const KEYS = {
  USER_PROFILE: 'aicm_user_profile',
  RESUME_DATA: 'aicm_resume_data',
  LAST_RESUME_ANALYSIS: 'aicm_last_resume_analysis',
  LAST_SKILL_GAP: 'aicm_last_skill_gap',
  CERTIFICATES: 'aicm_certificates',
  GOALS: 'aicm_goals',
  SETTINGS: 'aicm_settings',
  CHAT_HISTORY: 'aicm_chat_history',
  SAVED_PROJECTS: 'aicm_saved_projects',
  LAST_JOB_MATCH: 'aicm_last_job_match',
  ACTION_TASKS: 'aicm_action_tasks',
  LAST_READINESS_REPORT: 'aicm_last_readiness_report',
  LAST_INTERVIEW_FEEDBACK: 'aicm_last_interview_feedback'
};

export const defaultSettings: AppSettings = {
  darkMode: true,
  amoledMode: false,
  themeColor: 'cyan',
  animationsEnabled: true,
  soundEnabled: true,
  notificationsEnabled: true
};

function notifyStorageChange(): void {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new Event('aicm_storage_change'));
  }
}

export function getStoredUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(KEYS.USER_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Safe cleanup of legacy demo template profiles (without deleting profiles by user name)
      const isLegacyDemoPreset = 
        parsed.email === "alex.rivera@startup.io" ||
        (typeof parsed.githubUrl === "string" && parsed.githubUrl.includes("alexrivera-dev"));

      if (isLegacyDemoPreset) {
        localStorage.removeItem(KEYS.USER_PROFILE);
        return { ...emptyUserProfile };
      }

      return {
        ...emptyUserProfile,
        ...parsed,
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        preferredTechnologies: Array.isArray(parsed.preferredTechnologies) ? parsed.preferredTechnologies : []
      };
    }
  } catch (e) {
    console.warn('Failed to load stored user profile', e);
  }
  return { ...emptyUserProfile };
}

export function saveStoredUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function resetStoredUserProfile(): void {
  try {
    localStorage.removeItem(KEYS.USER_PROFILE);
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to reset user profile', e);
  }
}

export function getStoredResumeData(): ResumeData {
  try {
    const raw = localStorage.getItem(KEYS.RESUME_DATA);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.personalInfo?.fullName === "Alex Rivera" || parsed?.personalInfo?.email === "alex.rivera@startup.io") {
        localStorage.removeItem(KEYS.RESUME_DATA);
        return emptyResumeData;
      }
      return {
        ...emptyResumeData,
        ...(parsed || {}),
        personalInfo: {
          ...emptyResumeData.personalInfo,
          ...(parsed?.personalInfo || {})
        },
        skills: Array.isArray(parsed?.skills) ? parsed.skills : [],
        projects: Array.isArray(parsed?.projects) ? parsed.projects : [],
        experience: Array.isArray(parsed?.experience) ? parsed.experience : [],
        education: Array.isArray(parsed?.education) ? parsed.education : [],
        certificates: Array.isArray(parsed?.certificates) ? parsed.certificates : [],
        achievements: Array.isArray(parsed?.achievements) ? parsed.achievements : []
      };
    }
  } catch (e) {
    console.warn('Failed to load stored resume data', e);
  }
  return emptyResumeData;
}

export function saveStoredResumeData(data: ResumeData): void {
  try {
    localStorage.setItem(KEYS.RESUME_DATA, JSON.stringify(data));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save resume data', e);
  }
}

export function getStoredLastResumeAnalysis(): ResumeAnalysisResult | null {
  try {
    const raw = localStorage.getItem(KEYS.LAST_RESUME_ANALYSIS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load last resume analysis', e);
  }
  return null;
}

export function saveStoredLastResumeAnalysis(result: ResumeAnalysisResult): void {
  try {
    localStorage.setItem(KEYS.LAST_RESUME_ANALYSIS, JSON.stringify(result));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save resume analysis result', e);
  }
}

export function getStoredLastSkillGap(): SkillGapResult | null {
  try {
    const raw = localStorage.getItem(KEYS.LAST_SKILL_GAP);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load last skill gap', e);
  }
  return null;
}

export function saveStoredLastSkillGap(result: SkillGapResult): void {
  try {
    localStorage.setItem(KEYS.LAST_SKILL_GAP, JSON.stringify(result));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save skill gap result', e);
  }
}

export function getStoredCertificates(): CertificateRecord[] {
  try {
    const raw = localStorage.getItem(KEYS.CERTIFICATES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load certificates', e);
  }
  return [];
}

export function saveStoredCertificates(certs: CertificateRecord[]): void {
  try {
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save certificates', e);
  }
}

export function getStoredGoals(): GoalItem[] {
  try {
    const raw = localStorage.getItem(KEYS.GOALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load goals', e);
  }
  return [];
}

export function saveStoredGoals(goals: GoalItem[]): void {
  try {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save goals', e);
  }
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to load settings', e);
  }
  return defaultSettings;
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function getStoredChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(KEYS.CHAT_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load chat history', e);
  }
  return [
    {
      id: "msg-1",
      sender: "assistant",
      text: "Hello! I am Aura, your AI Career Mentor. Ask me anything about resumes, technical interviews, roadmaps, or career strategies!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
}

export function saveStoredChatHistory(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(messages));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save chat history', e);
  }
}

export function getStoredSavedProjects(): GeneratedProject[] {
  try {
    const raw = localStorage.getItem(KEYS.SAVED_PROJECTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load saved projects', e);
  }
  return [];
}

export function saveStoredSavedProjects(projects: GeneratedProject[]): void {
  try {
    localStorage.setItem(KEYS.SAVED_PROJECTS, JSON.stringify(projects));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save projects', e);
  }
}

export function getStoredLastJobMatch(): JobMatchResult | null {
  try {
    const raw = localStorage.getItem(KEYS.LAST_JOB_MATCH);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load last job match', e);
  }
  return null;
}

export function saveStoredLastJobMatch(result: JobMatchResult): void {
  try {
    localStorage.setItem(KEYS.LAST_JOB_MATCH, JSON.stringify(result));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save job match', e);
  }
}

export function getStoredActionTasks(): ActionCenterTask[] {
  try {
    const raw = localStorage.getItem(KEYS.ACTION_TASKS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load action tasks', e);
  }
  return [];
}

export function saveStoredActionTasks(tasks: ActionCenterTask[]): void {
  try {
    localStorage.setItem(KEYS.ACTION_TASKS, JSON.stringify(tasks));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save action tasks', e);
  }
}

export function getStoredLastReadinessReport(): JobReadinessReport | null {
  try {
    const raw = localStorage.getItem(KEYS.LAST_READINESS_REPORT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load readiness report', e);
  }
  return null;
}

export function saveStoredLastReadinessReport(report: JobReadinessReport): void {
  try {
    localStorage.setItem(KEYS.LAST_READINESS_REPORT, JSON.stringify(report));
  } catch (e) {
    console.error('Failed to save readiness report', e);
  }
}

export function getStoredLastInterviewFeedback(): InterviewFeedback | null {
  try {
    const raw = localStorage.getItem(KEYS.LAST_INTERVIEW_FEEDBACK);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load last interview feedback', e);
  }
  return null;
}

export function saveStoredLastInterviewFeedback(feedback: InterviewFeedback): void {
  try {
    localStorage.setItem(KEYS.LAST_INTERVIEW_FEEDBACK, JSON.stringify(feedback));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to save interview feedback', e);
  }
}

export function resetAllData(): void {
  try {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to clear data', e);
  }
}

/**
 * Seeds rich demo sample data into localStorage for test driving
 */
export function seedSampleDemoData(): void {
  try {
    saveStoredUserProfile(sampleCandidateProfile);
    saveStoredResumeData(sampleResumeData);
    saveStoredCertificates(sampleCertificates);
    saveStoredGoals(sampleGoals);
    saveStoredSavedProjects([
      {
        id: 'proj-demo-1',
        title: 'Distributed Log Aggregator & Alerting Microservice',
        targetCareer: 'Full Stack Developer',
        problemStatement: 'Engineered a resilient log ingestion cluster processing high-throughput event logs with automated anomaly detection.',
        realWorldUseCase: 'Used by engineering teams for real-time observability across distributed microservices.',
        technologies: ['Node.js', 'Express', 'TypeScript', 'Redis', 'Docker', 'Tailwind CSS'],
        features: [
          'Live stream visualizer with WebSockets',
          'Threshold alerts with Slack webhooks',
          'Configurable rate-limiting middleware'
        ],
        datasetApiRequirements: 'Synthetic log stream generator or OpenTelemetry trace collector',
        difficulty: 'Industry Grade',
        estimatedHours: 30,
        skillsDemonstrated: ['Distributed Systems', 'Redis Caching', 'Containerization'],
        resumeDescription: 'Designed a high-throughput log aggregator using TypeScript and Redis, processing 20k events/sec with sub-40ms ingest latency.',
        githubReadmeOutline: '## LogPulse Overview\nProduction-ready log aggregator with live event streaming and Redis caching.'
      }
    ]);
    saveStoredLastResumeAnalysis({
      overallScore: 86,
      formattingScore: 92,
      keywordsScore: 82,
      impactScore: 84,
      summary: 'Strong technical resume highlighting scalable backend architectures and modern React UI patterns.',
      strengths: ['Clear quantification of performance metrics', 'Clean single-column ATS format', 'Modern tech stack highlighted'],
      weaknesses: ['Could expand on cloud deployment infrastructure', 'Include more unit testing keywords'],
      missingKeywords: ['Docker', 'Kubernetes', 'CI/CD', 'GraphQL', 'Jest'],
      actionableTips: ['Add live demo links to both listed portfolio projects', 'Mention test coverage percentages under experience'],
      analyzedAt: new Date().toISOString(),
      targetRole: 'Full Stack Developer'
    });
    saveStoredLastJobMatch({
      matchPercentage: 84,
      jobRole: 'Full Stack Software Engineer',
      companyName: 'TechCorp Innovation Labs',
      matchingSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git'],
      missingSkills: ['Kubernetes', 'AWS Lambda', 'GraphQL'],
      importantKeywords: [
        { keyword: 'React 19', category: 'Frontend', presentInResume: true },
        { keyword: 'RESTful APIs', category: 'Backend', presentInResume: true },
        { keyword: 'Docker', category: 'DevOps', presentInResume: true },
        { keyword: 'Kubernetes', category: 'DevOps', presentInResume: false }
      ],
      experienceGaps: ['Experience with enterprise cloud deployment pipelines preferred.'],
      educationMatch: {
        required: 'BS in Computer Science or equivalent',
        userStatus: 'Enrolled in Bachelor of Science in Computer Science',
        isMatch: true,
        note: 'Degree curriculum aligns well with requirements.'
      },
      recommendedResumeChanges: [
        'Highlight containerization and deployment steps in projects',
        'Emphasize REST API design principles under experience section'
      ],
      estimatedAtsCompatibility: 'High',
      disclaimer: 'This is an estimated compatibility evaluation based on semantic keyword frequency.',
      analyzedAt: new Date().toISOString()
    });
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to seed demo data', e);
  }
}


/**
 * Calculates current LocalStorage consumption and returns human-readable stats
 */
export function calculateStorageUsage(): { usedBytes: number; usedFormatted: string; itemCount: number } {
  let totalBytes = 0;
  let count = 0;
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('aicm_')) {
        const item = localStorage.getItem(key);
        if (item) {
          totalBytes += (key.length + item.length) * 2; // UTF-16 approximation
          count++;
        }
      }
    }
  } catch (e) {
    console.warn('Could not compute storage size', e);
  }

  const kb = (totalBytes / 1024).toFixed(2);
  return {
    usedBytes: totalBytes,
    usedFormatted: `${kb} KB`,
    itemCount: count
  };
}

/**
 * Export complete career portfolio backup as JSON object / string
 */
export function exportFullCareerDataBackup(): string {
  const backup = {
    version: '4.0.0',
    exportedAt: new Date().toISOString(),
    appName: 'AI Career Mentor',
    userProfile: getStoredUserProfile(),
    resumeData: getStoredResumeData(),
    certificates: getStoredCertificates(),
    goals: getStoredGoals(),
    savedProjects: getStoredSavedProjects(),
    actionTasks: getStoredActionTasks(),
    settings: getStoredSettings(),
    lastResumeAnalysis: getStoredLastResumeAnalysis(),
    lastSkillGap: getStoredLastSkillGap(),
    lastJobMatch: getStoredLastJobMatch(),
    lastReadinessReport: getStoredLastReadinessReport(),
    lastInterviewFeedback: getStoredLastInterviewFeedback(),
    chatHistory: getStoredChatHistory()
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Validates nested structures of imported backup records and applies
 * a transactional snapshot-and-rollback strategy to prevent partial writes.
 */
export function importFullCareerDataBackup(jsonString: string): { success: boolean; message: string } {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return { success: false, message: 'Invalid backup file payload: expected a non-empty string.' };
    }

    let data: any;
    try {
      data = JSON.parse(jsonString);
    } catch {
      return { success: false, message: 'Invalid JSON format: could not parse backup file.' };
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { success: false, message: 'Invalid backup structure: root payload must be an object.' };
    }

    // Step 1: Deep validation of nested structures before touching storage
    if (data.userProfile !== undefined) {
      if (typeof data.userProfile !== 'object' || data.userProfile === null || Array.isArray(data.userProfile)) {
        return { success: false, message: 'Backup validation error: userProfile must be an object.' };
      }
      if (data.userProfile.targetRole !== undefined && typeof data.userProfile.targetRole !== 'string') {
        return { success: false, message: 'Backup validation error: userProfile.targetRole must be a string.' };
      }
      if (data.userProfile.skills !== undefined && !Array.isArray(data.userProfile.skills)) {
        return { success: false, message: 'Backup validation error: userProfile.skills must be an array.' };
      }
    }

    if (data.resumeData !== undefined) {
      if (typeof data.resumeData !== 'object' || data.resumeData === null || Array.isArray(data.resumeData)) {
        return { success: false, message: 'Backup validation error: resumeData must be an object.' };
      }
      if (data.resumeData.personalInfo !== undefined && (typeof data.resumeData.personalInfo !== 'object' || data.resumeData.personalInfo === null)) {
        return { success: false, message: 'Backup validation error: resumeData.personalInfo must be an object.' };
      }
      if (data.resumeData.skills !== undefined && !Array.isArray(data.resumeData.skills)) {
        return { success: false, message: 'Backup validation error: resumeData.skills must be an array.' };
      }
      if (data.resumeData.experience !== undefined && !Array.isArray(data.resumeData.experience)) {
        return { success: false, message: 'Backup validation error: resumeData.experience must be an array.' };
      }
      if (data.resumeData.projects !== undefined && !Array.isArray(data.resumeData.projects)) {
        return { success: false, message: 'Backup validation error: resumeData.projects must be an array.' };
      }
      if (data.resumeData.education !== undefined && !Array.isArray(data.resumeData.education)) {
        return { success: false, message: 'Backup validation error: resumeData.education must be an array.' };
      }
    }

    if (data.certificates !== undefined) {
      if (!Array.isArray(data.certificates)) {
        return { success: false, message: 'Backup validation error: certificates must be an array.' };
      }
      for (const c of data.certificates) {
        if (!c || typeof c !== 'object' || typeof c.title !== 'string' || typeof c.provider !== 'string') {
          return { success: false, message: 'Backup validation error: certificate entry missing required title or provider.' };
        }
      }
    }

    if (data.goals !== undefined) {
      if (!Array.isArray(data.goals)) {
        return { success: false, message: 'Backup validation error: goals must be an array.' };
      }
      for (const g of data.goals) {
        if (!g || typeof g !== 'object' || typeof g.title !== 'string') {
          return { success: false, message: 'Backup validation error: goal entry missing required title.' };
        }
      }
    }

    if (data.savedProjects !== undefined && !Array.isArray(data.savedProjects)) {
      return { success: false, message: 'Backup validation error: savedProjects must be an array.' };
    }

    if (data.actionTasks !== undefined && !Array.isArray(data.actionTasks)) {
      return { success: false, message: 'Backup validation error: actionTasks must be an array.' };
    }

    if (data.chatHistory !== undefined && !Array.isArray(data.chatHistory)) {
      return { success: false, message: 'Backup validation error: chatHistory must be an array.' };
    }

    if (data.settings !== undefined) {
      if (typeof data.settings !== 'object' || data.settings === null || Array.isArray(data.settings)) {
        return { success: false, message: 'Backup validation error: settings must be an object.' };
      }
    }

    if (data.lastResumeAnalysis !== undefined && data.lastResumeAnalysis !== null) {
      if (typeof data.lastResumeAnalysis !== 'object' || typeof data.lastResumeAnalysis.overallScore !== 'number') {
        return { success: false, message: 'Backup validation error: lastResumeAnalysis must contain numeric overallScore.' };
      }
    }

    if (data.lastSkillGap !== undefined && data.lastSkillGap !== null) {
      if (typeof data.lastSkillGap !== 'object' || typeof data.lastSkillGap.matchPercentage !== 'number') {
        return { success: false, message: 'Backup validation error: lastSkillGap must contain numeric matchPercentage.' };
      }
    }

    if (data.lastReadinessReport !== undefined && data.lastReadinessReport !== null) {
      if (typeof data.lastReadinessReport !== 'object' || !data.lastReadinessReport.scores) {
        return { success: false, message: 'Backup validation error: lastReadinessReport must contain scores object.' };
      }
    }

    // Step 2: Transactional Snapshot of existing storage before any modification
    const allKeys = Object.values(KEYS);
    const snapshot = new Map<string, string | null>();
    try {
      for (const key of allKeys) {
        snapshot.set(key, localStorage.getItem(key));
      }
    } catch {
      return { success: false, message: 'Could not access browser localStorage to prepare backup transaction.' };
    }

    // Step 3: Write new values with rollback on any failure
    try {
      if (data.userProfile && typeof data.userProfile === 'object') {
        localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(data.userProfile));
      }
      if (data.resumeData && typeof data.resumeData === 'object') {
        localStorage.setItem(KEYS.RESUME_DATA, JSON.stringify(data.resumeData));
      }
      if (Array.isArray(data.certificates)) {
        localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(data.certificates));
      }
      if (Array.isArray(data.goals)) {
        localStorage.setItem(KEYS.GOALS, JSON.stringify(data.goals));
      }
      if (Array.isArray(data.savedProjects)) {
        localStorage.setItem(KEYS.SAVED_PROJECTS, JSON.stringify(data.savedProjects));
      }
      if (Array.isArray(data.actionTasks)) {
        localStorage.setItem(KEYS.ACTION_TASKS, JSON.stringify(data.actionTasks));
      }
      if (data.settings && typeof data.settings === 'object') {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      if (data.lastResumeAnalysis && typeof data.lastResumeAnalysis === 'object') {
        localStorage.setItem(KEYS.LAST_RESUME_ANALYSIS, JSON.stringify(data.lastResumeAnalysis));
      }
      if (data.lastSkillGap && typeof data.lastSkillGap === 'object') {
        localStorage.setItem(KEYS.LAST_SKILL_GAP, JSON.stringify(data.lastSkillGap));
      }
      if (data.lastJobMatch && typeof data.lastJobMatch === 'object') {
        localStorage.setItem(KEYS.LAST_JOB_MATCH, JSON.stringify(data.lastJobMatch));
      }
      if (data.lastReadinessReport && typeof data.lastReadinessReport === 'object') {
        localStorage.setItem(KEYS.LAST_READINESS_REPORT, JSON.stringify(data.lastReadinessReport));
      }
      if (data.lastInterviewFeedback && typeof data.lastInterviewFeedback === 'object') {
        localStorage.setItem(KEYS.LAST_INTERVIEW_FEEDBACK, JSON.stringify(data.lastInterviewFeedback));
      }
      if (Array.isArray(data.chatHistory)) {
        localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(data.chatHistory));
      }
    } catch (writeErr: any) {
      // Rollback to prior snapshot on write failure
      console.error('Storage write error during backup import; rolling back to prior snapshot:', writeErr);
      try {
        for (const [k, oldVal] of snapshot.entries()) {
          if (oldVal === null) {
            localStorage.removeItem(k);
          } else {
            localStorage.setItem(k, oldVal);
          }
        }
      } catch (rollbackErr) {
        console.warn('Rollback restoration notice:', rollbackErr);
      }
      return { 
        success: false, 
        message: `Storage write failure (${writeErr?.message || 'QuotaExceeded'}). All existing data was safely rolled back and preserved.` 
      };
    }

    // Step 4: Single event dispatch only after full transactional commit succeeds
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      notifyStorageChange();
    }
    return { success: true, message: 'Career portfolio backup successfully verified and restored!' };
  } catch (err: any) {
    return { success: false, message: `Import failed: ${err?.message || 'Corrupted or unreadable backup format.'}` };
  }
}

/**
 * Triggers a native browser file download for the career backup
 */
export function downloadBackupFile(): void {
  const jsonStr = exportFullCareerDataBackup();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-career-mentor-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate real-time actionable notifications derived from actual user data
 */
export function generateRealUserNotifications(): {
  id: string;
  title: string;
  message: string;
  type: 'goal' | 'streak' | 'roadmap' | 'certificate' | 'interview' | 'task' | 'system';
  targetPage: string;
  timeAgo: string;
}[] {
  const profile = getStoredUserProfile();
  const goals = getStoredGoals();
  const certs = getStoredCertificates();
  const tasks = getStoredActionTasks();
  const resume = getStoredLastResumeAnalysis();

  const notifications: {
    id: string;
    title: string;
    message: string;
    type: 'goal' | 'streak' | 'roadmap' | 'certificate' | 'interview' | 'task' | 'system';
    targetPage: string;
    timeAgo: string;
  }[] = [];

  // Streak notification
  if (profile.learningStreakDays > 0) {
    notifications.push({
      id: 'notif-streak',
      title: `${profile.learningStreakDays}-Day Learning Streak! 🔥`,
      message: `Keep your momentum going! Complete a daily task today to maintain your streak.`,
      type: 'streak',
      targetPage: 'action-center',
      timeAgo: 'Today'
    });
  }

  // Pending tasks
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  if (pendingTasks.length > 0) {
    notifications.push({
      id: 'notif-task',
      title: `${pendingTasks.length} Action Tasks Pending`,
      message: `Next priority: "${pendingTasks[0].title}"`,
      type: 'task',
      targetPage: 'action-center',
      timeAgo: 'High Priority'
    });
  }

  // Active uncompleted goals
  const activeGoals = goals.filter(g => !g.isCompleted);
  if (activeGoals.length > 0) {
    notifications.push({
      id: 'notif-goal',
      title: `Active Target Goal: ${activeGoals[0].title}`,
      message: `Target timeline: ${activeGoals[0].targetDate}. Track progress in Goals Center.`,
      type: 'goal',
      targetPage: 'goals',
      timeAgo: 'Active'
    });
  }

  // In-progress certifications
  const inProgressCerts = certs.filter(c => c.status === 'In Progress');
  if (inProgressCerts.length > 0) {
    notifications.push({
      id: 'notif-cert',
      title: `Certification in Progress: ${inProgressCerts[0].title}`,
      message: `${inProgressCerts[0].progressPercentage}% completed with ${inProgressCerts[0].provider}.`,
      type: 'certificate',
      targetPage: 'certificates',
      timeAgo: 'Ongoing'
    });
  }

  // Resume status
  if (!resume) {
    notifications.push({
      id: 'notif-resume',
      title: 'Run AI ATS Resume Audit',
      message: 'Scan your resume against real tech industry standards to unlock personalized skill gap advice.',
      type: 'system',
      targetPage: 'resume-analyzer',
      timeAgo: 'Recommended'
    });
  } else {
    notifications.push({
      id: 'notif-interview',
      title: 'AI Mock Interview Ready',
      message: `Practice targeted behavioral & technical questions for ${profile.targetRole || 'Software Engineering'}.`,
      type: 'interview',
      targetPage: 'interview',
      timeAgo: 'Suggested'
    });
  }

  return notifications;
}
