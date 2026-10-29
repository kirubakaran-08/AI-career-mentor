export type PageType = 
  | 'home'
  | 'dashboard'
  | 'resume-analyzer'
  | 'skill-gap'
  | 'roadmap'
  | 'interview'
  | 'resume-builder'
  | 'certificates'
  | 'goals'
  | 'settings'
  | 'profile'
  | 'about'
  | 'contact'
  | 'ai-chat'
  | 'ai-career-chat'
  | 'career-comparison'
  | 'job-readiness'
  | 'project-generator'
  | 'job-matcher'
  | 'action-center'
  | 'career-insights';

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  targetRole: string;
  experienceLevel: 'Entry-Level / Fresher' | 'Junior (0-2 yrs)' | 'Mid-Level (2-5 yrs)' | 'Senior (5+ yrs)';
  careerScore: number;
  skillScore: number;
  weeklyProgress: number;
  learningStreakDays: number;
  avatarUrl: string;
  bio?: string;
  education?: string;
  institution?: string;
  graduationYear?: string;
  skills?: string[];
  preferredTechnologies?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  location?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'goal' | 'streak' | 'roadmap' | 'certificate' | 'interview' | 'task' | 'system';
  targetPage?: PageType;
  timestamp: string;
  isRead: boolean;
  actionText?: string;
}

export interface CareerDataBackup {
  version: string;
  exportedAt: string;
  appName: string;
  userProfile: UserProfile;
  resumeData: ResumeData;
  certificates: CertificateRecord[];
  goals: GoalItem[];
  savedProjects: GeneratedProject[];
  actionTasks: ActionCenterTask[];
  settings: AppSettings;
  lastResumeAnalysis?: ResumeAnalysisResult | null;
  lastSkillGap?: SkillGapResult | null;
  lastJobMatch?: JobMatchResult | null;
  lastReadinessReport?: JobReadinessReport | null;
  chatHistory?: ChatMessage[];
}

export interface ResumeAnalysisResult {
  overallScore: number;
  formattingScore: number;
  keywordsScore: number;
  impactScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  actionableTips: string[];
  analyzedAt: string;
  targetRole: string;
}

export interface SkillGapInput {
  targetRole: string;
  currentSkills: string[];
  experienceLevel: string;
  education: string;
}

export interface MissingSkill {
  name: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  difficulty: 'Beginner' | 'Easy' | 'Medium' | 'Hard';
  estimatedHours: number;
}

export interface SkillGapResult {
  role: string;
  matchPercentage: number;
  missingSkills: MissingSkill[];
  learningOrder: string[];
  summary: string;
}

export interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  topics: string[];
  estimatedWeeks: number;
  isCompleted?: boolean;
}

export interface CareerRoadmap {
  roleId: string;
  roleTitle: string;
  iconName: string;
  description: string;
  beginner: RoadmapStage[];
  intermediate: RoadmapStage[];
  advanced: RoadmapStage[];
  projects: { name: string; description: string; tags: string[] }[];
  certificates: { title: string; provider: string }[];
  interviewPrep: { question: string; category: string }[];
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'HR' | 'Coding' | 'Behavioral';
  role: string;
  question: string;
  hint: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  sampleBetterAnswer: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    summary: string;
  };
  education: {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade: string;
  }[];
  experience: {
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }[];
  projects: {
    id: string;
    title: string;
    technologies: string;
    description: string;
    link: string;
  }[];
  skills: string[];
  certificates: string[];
  achievements: string[];
}

export interface CertificateRecord {
  id: string;
  title: string;
  provider: string;
  completionDate: string;
  category: string;
  credentialUrl?: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  progressPercentage: number;
}

export interface GoalItem {
  id: string;
  title: string;
  type: 'Daily' | 'Weekly' | 'Monthly' | 'Career';
  category: string;
  targetDate: string;
  isCompleted: boolean;
  progressPercentage: number;
}

export interface AppSettings {
  darkMode: boolean;
  amoledMode: boolean;
  themeColor: 'cyan' | 'purple' | 'emerald' | 'amber';
  animationsEnabled: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    page: PageType;
  };
}

// ==================== PHASE 3 SPECIFIC TYPES ====================

export interface CareerComparisonItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  tagline: string;
  requiredSkills: string[];
  programmingReq: 'Low' | 'Moderate' | 'High' | 'Very High';
  mathReq: 'Basic' | 'Moderate' | 'Advanced' | 'Heavy';
  typicalTools: string[];
  difficulty: 'Beginner' | 'Moderate' | 'Advanced' | 'Expert';
  beginnerFriendliness: number; // 1 to 10
  projectRequirements: string[];
  interviewDifficulty: 'Standard' | 'Challenging' | 'High (Algorithms + System Design)' | 'Heavy ML Theory';
  careerGrowth: string;
  avgSalaryRange: string;
  suggestedLearningTime: string;
  idealFor: string;
}

export interface JobReadinessScores {
  overall: number;
  resume: number;
  technicalSkills: number;
  projects: number;
  communication: number;
  interviewPrep: number;
  certifications: number;
  careerConsistency: number;
  portfolio: number;
}

export interface JobReadinessReport {
  scores: JobReadinessScores;
  level: 'Strong Alignment (Advanced)' | 'Promising Alignment (Intermediate)' | 'Developing Profile (Foundational)' | 'Early Preparation Phase' | 'Initial Setup Phase';
  weakAreas: { name: string; score: number; reason: string; fixAction: string; targetPage: PageType }[];
  strongAreas: { name: string; score: number; highlight: string }[];
  top3ToImprove: string[];
  recommendedNextAction: { title: string; description: string; targetPage: PageType; buttonLabel: string };
  calculatedAt: string;
}

export interface GeneratedProject {
  id: string;
  title: string;
  problemStatement: string;
  realWorldUseCase: string;
  technologies: string[];
  features: string[];
  datasetApiRequirements: string;
  difficulty: 'Entry Portfolio' | 'Industry Grade' | 'High-Scale Production';
  estimatedHours: number;
  skillsDemonstrated: string[];
  resumeDescription: string;
  githubReadmeOutline: string;
  targetCareer: string;
}

export interface JobMatchResult {
  matchPercentage: number;
  jobRole: string;
  companyName?: string;
  matchingSkills: string[];
  missingSkills: string[];
  importantKeywords: { keyword: string; category: string; presentInResume: boolean }[];
  experienceGaps: string[];
  educationMatch: { required: string; userStatus: string; isMatch: boolean; note: string };
  recommendedResumeChanges: string[];
  estimatedAtsCompatibility: 'High' | 'Moderate' | 'Low';
  disclaimer: string;
  analyzedAt: string;
}

export interface ActionCenterTask {
  id: string;
  title: string;
  subtitle: string;
  category: 'Skill' | 'Interview' | 'Project' | 'Resume' | 'Application' | 'Milestone';
  timeframe: 'today' | 'this_week';
  priority: 'Critical' | 'High' | 'Medium';
  isCompleted: boolean;
  targetPage?: PageType;
  actionText: string;
}

export interface ActionCenterData {
  today: {
    mostImportantAction: string;
    skillToPractice: string;
    interviewTask: string;
    projectTask: string;
  };
  thisWeek: {
    learningTarget: string;
    projectMilestone: string;
    resumeImprovement: string;
    applicationPrep: string;
  };
  tasks: ActionCenterTask[];
  lastRefreshed: string;
}

export interface CareerInsightReport {
  strongestSkill: string;
  weakestSkill: string;
  mostImprovedArea: string;
  areaBeingNeglected: string;
  careerReadinessTrend: { label: string; score: number }[];
  interviewPerformanceTrend: { label: string; score: number }[];
  learningConsistencyScore: number;
  projectProgressScore: number;
  keyObservations: string[];
  actionTips: string[];
}
