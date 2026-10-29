import { 
  UserProfile, 
  ResumeData, 
  ResumeAnalysisResult, 
  SkillGapResult, 
  GoalItem, 
  CertificateRecord, 
  ChatMessage, 
  JobReadinessReport, 
  JobReadinessScores,
  GeneratedProject, 
  JobMatchResult,
  PageType,
  InterviewFeedback
} from '../types';
import { emptyResumeData } from '../data/initialData';

/**
 * AI Service layer for AI Career Mentor.
 * Connects with backend Gemini API routes with honest status reporting and deterministic local guidance when offline.
 */

// 1. AI Career Chat Service
export async function sendCareerChatMessage(
  message: string,
  history: ChatMessage[],
  userContext: {
    userProfile: UserProfile;
    resumeData?: ResumeData;
    lastResumeAnalysis?: ResumeAnalysisResult | null;
    lastSkillGap?: SkillGapResult | null;
    goalsCount?: number;
    certificatesCount?: number;
  }
): Promise<string> {
  const formattedHistory = history.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const userSkills = userContext.userProfile.skills && userContext.userProfile.skills.length > 0
    ? userContext.userProfile.skills
    : (userContext.resumeData?.skills && userContext.resumeData.skills.length > 0 ? userContext.resumeData.skills : []);

  try {
    const res = await fetch('/api/ai/career-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: formattedHistory.slice(-8),
        context: {
          name: userContext.userProfile.name || undefined,
          targetRole: userContext.userProfile.targetRole || undefined,
          experienceLevel: userContext.userProfile.experienceLevel || undefined,
          skills: userSkills,
          careerScore: userContext.userProfile.careerScore || null,
          activeGoalsCount: typeof userContext.goalsCount === 'number' ? userContext.goalsCount : null,
          certificatesCount: typeof userContext.certificatesCount === 'number' ? userContext.certificatesCount : null,
          resumeScore: userContext.lastResumeAnalysis?.overallScore || null
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) return data.text;
    }
  } catch (err) {
    console.warn('Backend AI chat fetch failed, falling back to local guidance:', err);
  }

  // Fallback Career Guidance when offline or server unreachable
  return generateContextualCareerAdvice(message, userContext);
}

function generateContextualCareerAdvice(
  message: string,
  context: {
    userProfile: UserProfile;
    resumeData?: ResumeData;
    lastResumeAnalysis?: ResumeAnalysisResult | null;
    lastSkillGap?: SkillGapResult | null;
  }
): string {
  const lower = message.toLowerCase();
  const role = context.userProfile.targetRole || "Tech Careers";
  const userSkills = context.userProfile.skills && context.userProfile.skills.length > 0
    ? context.userProfile.skills
    : (context.resumeData?.skills && context.resumeData.skills.length > 0 ? context.resumeData.skills : []);

  const hasProfile = Boolean(context.userProfile.name && userSkills.length > 0);

  // If user profile is not completed yet, explain limitation honestly
  if (!hasProfile) {
    return `### ℹ️ Offline Advisor Notice

Personalized AI mentoring is currently operating in offline mode, and your candidate profile does not have technical skills or personal details recorded yet.

**To receive tailored guidance:**
1. Navigate to the **Profile** section to record your target role, experience level, and skills.
2. Or use the **ATS Resume Analyzer** to audit your current resume.

**General Guidance for ${role}:**
- Build 2 high-quality portfolio projects demonstrating end-to-end functionality (database, API, and frontend).
- Practice answering technical and behavioral questions using the STAR framework (Situation, Task, Action, Result).
- Ensure your resume clearly lists the specific programming languages, libraries, and tools you have used.`;
  }

  const skillsListStr = userSkills.slice(0, 5).join(', ');

  if (lower.includes('which career') || lower.includes('best for my skills') || lower.includes('career path')) {
    return `### 🎯 Career Direction Guidance (Offline Mode)
*(Note: Generative AI is currently unavailable. This is based on your recorded profile skills.)*

Based on your recorded skills (**${skillsListStr}**):

- **Target Focus:** **${role}**
- **Core Relevant Technologies:** ${userSkills.slice(0, 4).join(', ')}
- **Complementary Roles to Explore:**
  1. **Full-Stack / Web Development** — Leverages your frontend and backend fundamentals.
  2. **API & Cloud Backend Engineering** — Requires deepening database design, indexing, and containerization.

**💡 Next Step:** Complete a mock interview or explore the **Career Roadmaps** tab to see industry requirements for ${role}.`;
  }

  if (lower.includes('what should i learn next') || lower.includes('learn next') || lower.includes('skill')) {
    const missing = context.lastSkillGap?.missingSkills?.map(s => s.name);
    const recommendedList = missing && missing.length > 0 
      ? missing.slice(0, 3) 
      : ['Database Indexing & Schema Design', 'Containerization with Docker', 'Automated Testing (Unit & Integration)'];

    return `### 🚀 Recommended Learning Priorities for ${role}
*(Offline Guidance based on standard industry roadmap)*

Here are priority technical areas to strengthen:

1. **${recommendedList[0] || 'Database Design & Optimization'}**
   - Practice query performance, joins, and relational normalization.
2. **${recommendedList[1] || 'Containerization with Docker'}**
   - Create multi-stage Dockerfiles and compose setups for local microservices.
3. **${recommendedList[2] || 'Automated Testing'}**
   - Write unit and integration tests for core business logic.

**💡 Tip:** Implement these concepts directly in a personal project to solidify your understanding.`;
  }

  if (lower.includes('resume') || lower.includes('ats')) {
    return `### 📄 Resume Guidance for ${role}
*(Offline Guidance)*

Key guidelines for optimizing your resume:
1. **Quantify Results:** Replace general duties with specific achievements (e.g. *"Optimized database queries, reducing response times by 30%"*).
2. **Prominent Skills Section:** Group your actual skills (**${skillsListStr}**) logically into Languages, Frameworks, and Tools.
3. **Public Repositories:** Ensure listed projects have active repository links and clear README documentation.

**💡 Next Step:** Paste your resume into the **ATS Resume Analyzer** for automated keyword and formatting feedback.`;
  }

  // General response
  return `### 🧭 Career Guidance Note
*(Offline Mode)*

Hello ${context.userProfile.name || "Candidate"}! Here is a summary of your profile status:
- **Target Role:** ${role} (${context.userProfile.experienceLevel})
- **Recorded Skills:** ${skillsListStr || "None yet logged"}
- **Roadmap Activity:** ${context.userProfile.learningStreakDays > 0 ? `${context.userProfile.learningStreakDays}-day streak logged` : "No streak active yet"}

To receive real-time, dynamic AI answers to specific questions, connect to the internet to query our Google Gemini backend.`;
}

// 2. Job Readiness Analyzer Service
function isValidWebUrl(str?: string): boolean {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.length < 8) return false;
  try {
    const parsed = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`);
    return Boolean(parsed.hostname && parsed.hostname.includes('.'));
  } catch {
    return false;
  }
}

export function computeJobReadiness(
  userProfile?: UserProfile,
  resumeData?: ResumeData,
  lastResumeAnalysis?: ResumeAnalysisResult | null,
  lastSkillGap?: SkillGapResult | null,
  goals?: GoalItem[],
  certificates?: CertificateRecord[],
  lastInterviewFeedback?: InterviewFeedback | null
): JobReadinessReport {
  const safeProfile = userProfile || { 
    targetRole: 'Software Engineer', 
    learningStreakDays: 0,
    skills: [],
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: ''
  };
  const safeResume = resumeData || emptyResumeData;
  const safePersonalInfo = safeResume.personalInfo || { fullName: '', email: '', summary: '', linkedin: '', github: '' };
  const resumeSkills = Array.isArray(safeResume.skills) ? safeResume.skills : [];
  const profileSkills = Array.isArray(safeProfile.skills) ? safeProfile.skills : [];
  
  // Unify skills across resume and profile without double-counting
  const allSkills = Array.from(new Set([...resumeSkills, ...profileSkills].map(s => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)));
  const safeProjects = Array.isArray(safeResume.projects) 
    ? safeResume.projects.filter(p => p && typeof p.title === 'string' && p.title.trim().length > 0)
    : [];
  const safeGoals = Array.isArray(goals) ? goals.filter(Boolean) : [];
  const safeCerts = Array.isArray(certificates) ? certificates.filter(Boolean) : [];

  // 1. Resume Score (Weight: 20%, range 0-100)
  const resumeScore = lastResumeAnalysis && typeof lastResumeAnalysis.overallScore === 'number' && !isNaN(lastResumeAnalysis.overallScore)
    ? Math.min(100, Math.max(0, Math.round(lastResumeAnalysis.overallScore)))
    : ((safePersonalInfo.summary?.trim() || allSkills.length > 0) ? 35 : 0);

  // 2. Technical Skills Alignment Score (Weight: 20%, range 0-100)
  const skillCount = allSkills.length;
  const matchPct = (lastSkillGap && typeof lastSkillGap.matchPercentage === 'number' && !isNaN(lastSkillGap.matchPercentage))
    ? lastSkillGap.matchPercentage
    : 0;
  const technicalSkillsScore = skillCount > 0 
    ? Math.min(100, Math.max(0, Math.round(Math.min(skillCount, 10) * 6 + (matchPct * 0.4))))
    : 0;

  // 3. Portfolio Projects Score (Weight: 15%, range 0-100)
  const projCount = safeProjects.length;
  const verifiedLiveProjects = safeProjects.filter(p => p && isValidWebUrl(p.link)).length;
  const projectsScore = projCount > 0
    ? Math.min(100, Math.max(0, Math.round((Math.min(projCount, 3) * 22) + (verifiedLiveProjects * 17))))
    : 0;

  // 4. Interview Preparation Score (Weight: 15%, range 0-100)
  let interviewPrepScore = 0;
  if (lastInterviewFeedback && typeof lastInterviewFeedback.score === 'number' && !isNaN(lastInterviewFeedback.score)) {
    interviewPrepScore = Math.min(100, Math.max(0, Math.round(lastInterviewFeedback.score)));
  } else {
    const interviewGoals = safeGoals.filter(g => typeof g.category === 'string' && g.category.toLowerCase().includes('interview'));
    const interviewGoalsCompleted = interviewGoals.filter(g => g.isCompleted).length;
    if (interviewGoals.length > 0) {
      // Proxy based on completed interview practice milestones (capped at 60 without actual evaluated simulation)
      interviewPrepScore = Math.min(60, Math.max(0, Math.round((interviewGoalsCompleted / interviewGoals.length) * 50 + 10)));
    } else if (safeGoals.length > 0) {
      interviewPrepScore = 15;
    } else {
      interviewPrepScore = 0;
    }
  }

  // 5. Certifications Score (Weight: 10%, range 0-100)
  const completedCerts = safeCerts.filter(c => c && c.status === 'Completed').length;
  const inProgressCerts = safeCerts.filter(c => c && c.status === 'In Progress').length;
  const certificationsScore = safeCerts.length > 0
    ? Math.min(100, Math.max(0, Math.round((completedCerts * 45) + (inProgressCerts * 20))))
    : 0;

  // 6. Career Consistency Score (Weight: 10%, range 0-100)
  const streak = typeof safeProfile.learningStreakDays === 'number' && !isNaN(safeProfile.learningStreakDays)
    ? Math.max(0, safeProfile.learningStreakDays)
    : 0;
  const completedGoalsCount = safeGoals.filter(g => g && g.isCompleted).length;
  const completedGoalsRate = safeGoals.length > 0 ? (completedGoalsCount / safeGoals.length) : 0;
  const careerConsistencyScore = (streak > 0 || safeGoals.length > 0)
    ? Math.min(100, Math.max(0, Math.round((Math.min(streak, 14) * 4) + (completedGoalsRate * 44))))
    : 0;

  // 7. Communication & Impact Score (Weight: 5%, range 0-100)
  let commScore = 0;
  if (lastResumeAnalysis && typeof lastResumeAnalysis.impactScore === 'number' && !isNaN(lastResumeAnalysis.impactScore)) {
    commScore = Math.min(100, Math.max(0, Math.round(lastResumeAnalysis.impactScore)));
  } else {
    const summary = safePersonalInfo.summary?.trim() || '';
    const hasSubstantiveSummary = summary.length >= 80;
    const projectBulletsCount = safeProjects.reduce((acc, p) => {
      const desc = p.description || '';
      return acc + (desc.split('\n').filter(l => l.trim().length > 10).length || (desc.length > 40 ? 1 : 0));
    }, 0);
    commScore = (hasSubstantiveSummary ? 45 : (summary.length > 20 ? 25 : 0)) + Math.min(55, projectBulletsCount * 18);
  }
  commScore = Math.min(100, Math.max(0, commScore));

  // 8. Public Portfolio & GitHub Score (Weight: 5%, range 0-100)
  const rawGithub = (safePersonalInfo.github || safeProfile.githubUrl || '').trim();
  const rawLinkedin = (safePersonalInfo.linkedin || safeProfile.linkedinUrl || '').trim();
  const rawPortfolio = (safeProfile.portfolioUrl || '').trim();
  const hasGithub = isValidWebUrl(rawGithub) && rawGithub.toLowerCase().includes('github');
  const hasLinkedin = isValidWebUrl(rawLinkedin) && rawLinkedin.toLowerCase().includes('linkedin');
  const hasPortfolio = isValidWebUrl(rawPortfolio);
  const portfolioScore = Math.min(100, (hasGithub ? 40 : 0) + (hasLinkedin ? 30 : (rawLinkedin ? 10 : 0)) + (hasPortfolio ? 30 : (verifiedLiveProjects > 0 ? 20 : 0)));

  // Overall Weighted Score (Weights: 20% + 20% + 15% + 15% + 10% + 10% + 5% + 5% = exactly 100%)
  const overall = Math.min(100, Math.max(0, Math.round(
    (resumeScore * 0.20) +
    (technicalSkillsScore * 0.20) +
    (projectsScore * 0.15) +
    (interviewPrepScore * 0.15) +
    (certificationsScore * 0.10) +
    (careerConsistencyScore * 0.10) +
    (commScore * 0.05) +
    (portfolioScore * 0.05)
  )));

  const scores: JobReadinessScores = {
    overall,
    resume: resumeScore,
    technicalSkills: technicalSkillsScore,
    projects: projectsScore,
    communication: commScore,
    interviewPrep: interviewPrepScore,
    certifications: certificationsScore,
    careerConsistency: careerConsistencyScore,
    portfolio: portfolioScore
  };

  // Level determination aligned with types.ts
  let level: JobReadinessReport['level'] = 'Initial Setup Phase';
  if (scores.overall >= 85) level = 'Strong Alignment (Advanced)';
  else if (scores.overall >= 70) level = 'Promising Alignment (Intermediate)';
  else if (scores.overall >= 50) level = 'Developing Profile (Foundational)';
  else if (scores.overall >= 30) level = 'Early Preparation Phase';
  else level = 'Initial Setup Phase';

  // All 8 dimensions evaluated for weak & strong recommendations
  const dimensions = [
    { name: 'ATS Resume Score', score: scores.resume, page: 'resume-analyzer' as const, reason: 'Resume has not been analyzed or is missing key metric details', fix: 'Run ATS Resume Analyzer to identify missing keywords and quantifiable bullet points.' },
    { name: 'Technical Skills Alignment', score: scores.technicalSkills, page: 'skill-gap' as const, reason: 'Few core technical skills logged in profile or resume', fix: 'Log your primary skills and run a Skill Gap Analysis.' },
    { name: 'Portfolio Projects', score: scores.projects, page: 'project-generator' as const, reason: 'Limited portfolio projects with verified code or demo links', fix: 'Document full-stack projects with live demo URLs or repository links.' },
    { name: 'Interview Preparation', score: scores.interviewPrep, page: 'interview' as const, reason: 'No evaluated mock interview session completed yet', fix: 'Practice realistic mock interview questions with instant AI evaluation.' },
    { name: 'Certifications', score: scores.certifications, page: 'certificates' as const, reason: 'No completed certifications tracked in your vault', fix: 'Add active course certifications or industry credentials.' },
    { name: 'Career Consistency', score: scores.careerConsistency, page: 'goals' as const, reason: 'Learning streak and completed goals can be expanded', fix: 'Set daily learning milestones in the Goal Tracker to maintain consistency.' },
    { name: 'Communication & Impact', score: scores.communication, page: 'resume-builder' as const, reason: 'Resume summary and project action verbs can be strengthened', fix: 'Refine professional summary and STAR-structured bullet points in Resume Builder.' },
    { name: 'Public Portfolio & GitHub', score: scores.portfolio, page: 'resume-builder' as const, reason: 'Valid GitHub, LinkedIn, or portfolio link missing', fix: 'Add active, verified repository and professional portfolio links.' }
  ];

  const sorted = [...dimensions].sort((a, b) => a.score - b.score);
  const weak = sorted.slice(0, 3).map(d => ({
    name: d.name,
    score: d.score,
    reason: d.reason,
    fixAction: d.fix,
    targetPage: d.page
  }));

  const strong = sorted.filter(d => d.score >= 50).slice(-3).reverse().map(d => ({
    name: d.name,
    score: d.score,
    highlight: `Recorded progress (${d.score}/100) — positive indicator for this dimension.`
  }));

  const top3ToImprove = weak.map(w => `${w.name}: ${w.fixAction}`);

  const recommendedNextAction = {
    title: weak[0]?.name ? `Strengthen ${weak[0].name}` : 'Explore Career Roadmap',
    description: weak[0]?.fixAction || 'Select a learning roadmap to begin tracking skills.',
    targetPage: (weak[0]?.targetPage || 'roadmap') as PageType,
    buttonLabel: `Open ${weak[0]?.name ? weak[0].name.split(' ')[0] : 'Roadmap'}`
  };

  return {
    scores,
    level,
    weakAreas: weak,
    strongAreas: strong,
    top3ToImprove,
    recommendedNextAction,
    calculatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

// 3. ATS Job Description Matcher Service
export async function matchJobDescriptionWithResume(
  jobDescription: string,
  resumeData: ResumeData,
  targetRole: string
): Promise<JobMatchResult> {
  try {
    const res = await fetch('/api/ai/match-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription, resumeData, targetRole })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.matchPercentage !== undefined) {
        return data;
      }
    }
  } catch (e) {
    console.warn('Backend job matcher failed, using local algorithmic parser:', e);
  }

  // Local Matcher Parser
  return analyzeJobTextLocally(jobDescription, resumeData, targetRole);
}

function analyzeJobTextLocally(jobText: string, resumeData: ResumeData, targetRole: string): JobMatchResult {
  const jdLower = jobText.toLowerCase();
  const resumeTextCombined = [
    resumeData.personalInfo.summary,
    ...resumeData.skills,
    ...resumeData.experience.flatMap(e => [e.role, e.company, ...e.highlights]),
    ...resumeData.projects.flatMap(p => [p.title, p.technologies, p.description]),
    ...resumeData.certificates
  ].join(' ').toLowerCase();

  const keyTechLibrary = [
    { keyword: 'React', category: 'Frontend' },
    { keyword: 'TypeScript', category: 'Languages' },
    { keyword: 'JavaScript', category: 'Languages' },
    { keyword: 'Node.js', category: 'Backend' },
    { keyword: 'Express', category: 'Backend' },
    { keyword: 'Python', category: 'Languages' },
    { keyword: 'PostgreSQL', category: 'Database' },
    { keyword: 'SQL', category: 'Database' },
    { keyword: 'MongoDB', category: 'Database' },
    { keyword: 'Docker', category: 'DevOps / Cloud' },
    { keyword: 'Kubernetes', category: 'DevOps / Cloud' },
    { keyword: 'AWS', category: 'Cloud' },
    { keyword: 'GCP', category: 'Cloud' },
    { keyword: 'CI/CD', category: 'DevOps' },
    { keyword: 'REST API', category: 'Architecture' },
    { keyword: 'GraphQL', category: 'Backend' },
    { keyword: 'Git', category: 'Tooling' },
    { keyword: 'Jest / Testing', category: 'Quality' },
    { keyword: 'Redis', category: 'Database' },
    { keyword: 'Tailwind CSS', category: 'Frontend' }
  ];

  const matchedKeywords: { keyword: string; category: string; presentInResume: boolean }[] = [];
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  keyTechLibrary.forEach(item => {
    const isRequiredInJD = jdLower.includes(item.keyword.toLowerCase());
    if (isRequiredInJD) {
      const isPresentInResume = resumeTextCombined.includes(item.keyword.toLowerCase());
      matchedKeywords.push({
        keyword: item.keyword,
        category: item.category,
        presentInResume: isPresentInResume
      });
      if (isPresentInResume) {
        matchingSkills.push(item.keyword);
      } else {
        missingSkills.push(item.keyword);
      }
    }
  });

  // Calculate score honestly based on matched vs required in JD
  const totalKeywordsInJd = matchedKeywords.length;
  const matchPercentage = totalKeywordsInJd > 0
    ? Math.round((matchingSkills.length / totalKeywordsInJd) * 100)
    : (matchingSkills.length > 0 ? 50 : 0);

  const experienceGaps: string[] = [];
  if (missingSkills.length > 0) {
    experienceGaps.push(`Missing keywords identified in job posting: ${missingSkills.slice(0, 3).join(', ')}`);
  } else {
    experienceGaps.push('Ensure specific quantitative metrics are stated for your key accomplishments');
  }

  const isEduMentioned = jdLower.includes('bachelor') || jdLower.includes('degree') || jdLower.includes('computer science');
  const userEdu = resumeData.education[0]?.degree || (resumeData.education.length > 0 ? "Educational record logged" : "Not specified on resume");

  const recommendedChanges = [
    missingSkills.length > 0 
      ? `Incorporate missing technical skills (${missingSkills.slice(0, 3).join(', ')}) where you have practical experience.`
      : 'Highlight specific performance metrics and outcomes in recent project bullets.',
    'Align the headline in your resume summary with the specific job title.',
    'Add links to public code repositories and live demonstrations.'
  ];

  return {
    matchPercentage,
    jobRole: targetRole || "Software Engineering Role",
    companyName: jdLower.includes('company') ? "Hiring Organization" : "Target Employer",
    matchingSkills,
    missingSkills,
    importantKeywords: matchedKeywords,
    experienceGaps,
    educationMatch: {
      required: isEduMentioned ? "Degree in Computer Science or relevant technical discipline" : "Demonstrated technical proficiency or related background",
      userStatus: userEdu,
      isMatch: Boolean(resumeData.education.length > 0),
      note: resumeData.education.length > 0 
        ? "Educational details are present on your resume." 
        : "No education entries detected on your resume."
    },
    recommendedResumeChanges: recommendedChanges,
    estimatedAtsCompatibility: matchPercentage >= 75 ? 'High' : matchPercentage >= 50 ? 'Moderate' : 'Low',
    disclaimer: "Estimated compatibility score calculated using keyword matching against the job description text. This is not an official vendor ATS certification.",
    analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

// 4. Dynamic Project Idea Generator Service
export async function generateCareerProjects(params: {
  targetCareer: string;
  skillLevel: string;
  preferredTech: string;
  difficulty: 'Entry Portfolio' | 'Industry Grade' | 'High-Scale Production';
}): Promise<GeneratedProject[]> {
  try {
    const res = await fetch('/api/ai/generate-projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('Backend project generator failed, generating curated blueprints:', e);
  }

  return getCuratedProjects(params);
}

function getCuratedProjects(params: {
  targetCareer: string;
  skillLevel: string;
  preferredTech: string;
  difficulty: 'Entry Portfolio' | 'Industry Grade' | 'High-Scale Production';
}): GeneratedProject[] {
  const { targetCareer, preferredTech, difficulty } = params;
  const primaryTech = preferredTech.split('&')[0]?.trim() || "React";

  return [
    {
      id: `proj-${Date.now()}-1`,
      title: `${targetCareer.split(' ')[0]} Telemetry & Analytics Dashboard`,
      targetCareer,
      problemStatement: "Teams often need lightweight observability dashboards to track server uptime and request metrics without third-party vendor lock-in.",
      realWorldUseCase: "Enables engineering teams to monitor response latency and system status via WebSocket streaming.",
      technologies: [primaryTech, "TypeScript", "Node.js Express", "PostgreSQL", "Tailwind CSS"],
      features: [
        "Interactive latency time graphs with clean filtering",
        "Role-Based Access Control (RBAC) with JWT authentication",
        "Exportable PDF summary reports with charts"
      ],
      datasetApiRequirements: "Synthetic mock metrics generator API or Prometheus open-metrics collector",
      difficulty,
      estimatedHours: difficulty === 'High-Scale Production' ? 45 : 30,
      skillsDemonstrated: ["WebSocket Streaming", "Database Schema Optimization", "Responsive UI/UX"],
      resumeDescription: `Built a monitoring dashboard using ${primaryTech} and Express, providing real-time metric visualization.`,
      githubReadmeOutline: `# System Telemetry Dashboard\n\n## Tech Stack\n- Frontend: ${primaryTech}\n- Backend: Node.js Express\n\n## Setup\n\`npm install && npm run dev\``
    },
    {
      id: `proj-${Date.now()}-2`,
      title: `AI Document Intelligence & Semantic Search Pipeline`,
      targetCareer,
      problemStatement: "Professionals frequently need to search through dense documentation and technical guides for relevant clauses quickly.",
      realWorldUseCase: "Implements document parsing and semantic retrieval to find relevant sections across technical manuals.",
      technologies: [primaryTech, "TypeScript", "Google Gemini API", "Vector Store", "Node.js Express"],
      features: [
        "Document text chunking and indexing",
        "Semantic similarity search over documentation sections",
        "Interactive markdown view with easy clipboard copy"
      ],
      datasetApiRequirements: "Google Gemini API for contextual reasoning and embeddings",
      difficulty,
      estimatedHours: difficulty === 'High-Scale Production' ? 50 : 35,
      skillsDemonstrated: ["API Integration", "Semantic Search", "Full-Stack Development"],
      resumeDescription: `Developed a document intelligence application integrating the Gemini API for semantic search.`,
      githubReadmeOutline: `# Document Search Pipeline\n\n## Architecture\n- Client: ${primaryTech}\n- API: Google Gemini API`
    }
  ];
}
