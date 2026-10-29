import React, { useState } from 'react';
import { SkillGapResult, UserProfile, MissingSkill } from '../types';
import { getStoredLastSkillGap, saveStoredLastSkillGap } from '../lib/storage';
import { Compass, Sparkles, CheckCircle2, AlertCircle, Clock, BarChart, ArrowRight, RefreshCw, Info } from 'lucide-react';

interface SkillGapAnalysisProps {
  userProfile: UserProfile;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ userProfile }) => {
  const [targetRole, setTargetRole] = useState<string>(userProfile.targetRole || "Full Stack Developer");
  // Do not silently prefill fictional skills if user profile has no skills
  const [currentSkills, setCurrentSkills] = useState<string>(
    userProfile.skills && userProfile.skills.length > 0 
      ? userProfile.skills.join(', ') 
      : ""
  );
  const [experienceLevel, setExperienceLevel] = useState<string>(userProfile.experienceLevel || "Entry-Level / Fresher");
  // Do not assume a degree: use real education if available or leave blank
  const [education, setEducation] = useState<string>(userProfile.education || "");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<SkillGapResult | null>(getStoredLastSkillGap());

  const availableRoles = [
    "Full Stack Developer",
    "AI Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "Data Analyst",
    "Machine Learning Engineer",
    "Cloud Engineer",
    "Cyber Security Specialist",
    "DevOps Engineer"
  ];

  // Comprehensive, industry-grounded role benchmark matrix covering every selectable role
  const ROLE_BENCHMARKS: Record<string, { skills: string[]; hours: number; difficulty: "Easy" | "Medium" | "Hard"; priority: "High" | "Medium" | "Critical" }[]> = {
    "Full Stack Developer": [
      { skills: ["React", "Next.js"], hours: 16, difficulty: "Medium", priority: "High" },
      { skills: ["TypeScript"], hours: 14, difficulty: "Medium", priority: "Critical" },
      { skills: ["Node.js", "Express"], hours: 16, difficulty: "Medium", priority: "High" },
      { skills: ["PostgreSQL", "SQL", "Database Design"], hours: 18, difficulty: "Medium", priority: "Critical" },
      { skills: ["RESTful APIs", "GraphQL"], hours: 12, difficulty: "Medium", priority: "High" },
      { skills: ["Docker", "Containers"], hours: 18, difficulty: "Hard", priority: "Medium" },
      { skills: ["Git", "GitHub Actions", "CI/CD"], hours: 12, difficulty: "Easy", priority: "Medium" }
    ],
    "AI Engineer": [
      { skills: ["Python"], hours: 16, difficulty: "Medium", priority: "Critical" },
      { skills: ["Gemini API", "LLMs", "Prompt Engineering"], hours: 14, difficulty: "Medium", priority: "Critical" },
      { skills: ["Retrieval-Augmented Generation (RAG)", "Vector Embeddings"], hours: 22, difficulty: "Hard", priority: "High" },
      { skills: ["Vector Databases", "ChromaDB", "Pinecone"], hours: 16, difficulty: "Medium", priority: "High" },
      { skills: ["LangChain", "LangGraph", "AI Agents"], hours: 22, difficulty: "Hard", priority: "High" },
      { skills: ["FastAPI", "RESTful AI Microservices"], hours: 14, difficulty: "Medium", priority: "Medium" },
      { skills: ["Model Evaluation & Guardrails"], hours: 18, difficulty: "Hard", priority: "Medium" }
    ],
    "Frontend Developer": [
      { skills: ["React", "Next.js"], hours: 16, difficulty: "Medium", priority: "Critical" },
      { skills: ["TypeScript"], hours: 14, difficulty: "Medium", priority: "Critical" },
      { skills: ["Tailwind CSS", "CSS3", "Responsive UI"], hours: 10, difficulty: "Easy", priority: "High" },
      { skills: ["JavaScript ES6+"], hours: 12, difficulty: "Medium", priority: "High" },
      { skills: ["State Management", "Zustand", "Redux"], hours: 12, difficulty: "Medium", priority: "Medium" },
      { skills: ["Web Performance", "Lighthouse", "Core Web Vitals"], hours: 14, difficulty: "Medium", priority: "Medium" }
    ],
    "Backend Developer": [
      { skills: ["Node.js", "Express", "Python"], hours: 16, difficulty: "Medium", priority: "Critical" },
      { skills: ["PostgreSQL", "SQL", "Relational Database Design"], hours: 20, difficulty: "Medium", priority: "Critical" },
      { skills: ["RESTful APIs", "Microservices"], hours: 14, difficulty: "Medium", priority: "High" },
      { skills: ["System Design & Architecture"], hours: 24, difficulty: "Hard", priority: "High" },
      { skills: ["Redis", "Message Queues", "Caching"], hours: 16, difficulty: "Medium", priority: "Medium" },
      { skills: ["Docker", "Containerization"], hours: 18, difficulty: "Hard", priority: "Medium" }
    ],
    "Data Analyst": [
      { skills: ["SQL", "PostgreSQL", "Database Queries"], hours: 18, difficulty: "Medium", priority: "Critical" },
      { skills: ["Microsoft Excel", "Advanced Formulas", "Pivot Tables"], hours: 12, difficulty: "Easy", priority: "Critical" },
      { skills: ["Tableau", "Power BI", "Data Dashboards"], hours: 18, difficulty: "Medium", priority: "High" },
      { skills: ["Python", "Pandas", "NumPy"], hours: 20, difficulty: "Medium", priority: "High" },
      { skills: ["Data Cleaning & Preprocessing", "ETL"], hours: 16, difficulty: "Medium", priority: "High" },
      { skills: ["Statistical Analysis & Hypothesis Testing"], hours: 18, difficulty: "Hard", priority: "Medium" },
      { skills: ["Business Intelligence & Reporting"], hours: 12, difficulty: "Easy", priority: "Medium" }
    ],
    "Data Scientist": [
      { skills: ["Python", "Scientific Computing"], hours: 16, difficulty: "Medium", priority: "Critical" },
      { skills: ["Machine Learning", "Scikit-Learn"], hours: 22, difficulty: "Hard", priority: "Critical" },
      { skills: ["Statistical Modeling & Probability"], hours: 20, difficulty: "Hard", priority: "Critical" },
      { skills: ["SQL & Data Wrangling"], hours: 16, difficulty: "Medium", priority: "High" },
      { skills: ["Data Visualization", "Matplotlib", "Seaborn"], hours: 12, difficulty: "Easy", priority: "Medium" },
      { skills: ["Deep Learning Basics", "PyTorch", "TensorFlow"], hours: 24, difficulty: "Hard", priority: "Medium" }
    ],
    "Machine Learning Engineer": [
      { skills: ["Python", "PyTorch", "TensorFlow"], hours: 24, difficulty: "Hard", priority: "Critical" },
      { skills: ["MLOps & Model Deployment"], hours: 22, difficulty: "Hard", priority: "Critical" },
      { skills: ["Scikit-Learn & Feature Engineering"], hours: 18, difficulty: "Medium", priority: "High" },
      { skills: ["Data Pipelines & Data Versioning"], hours: 18, difficulty: "Medium", priority: "High" },
      { skills: ["Docker & Kubernetes for ML Workloads"], hours: 20, difficulty: "Hard", priority: "Medium" },
      { skills: ["Model Monitoring & Data Drift"], hours: 16, difficulty: "Medium", priority: "Medium" }
    ],
    "Cloud Engineer": [
      { skills: ["AWS", "Google Cloud", "Cloud Infrastructure"], hours: 22, difficulty: "Medium", priority: "Critical" },
      { skills: ["Terraform", "Infrastructure as Code"], hours: 20, difficulty: "Hard", priority: "Critical" },
      { skills: ["Docker & Kubernetes Orchestration"], hours: 24, difficulty: "Hard", priority: "High" },
      { skills: ["Cloud Networking", "VPC", "DNS", "Security Groups"], hours: 18, difficulty: "Hard", priority: "High" },
      { skills: ["Linux Administration", "Bash Scripting"], hours: 16, difficulty: "Medium", priority: "High" },
      { skills: ["CI/CD Pipelines", "Automated Deployments"], hours: 14, difficulty: "Medium", priority: "Medium" }
    ],
    "Cyber Security Specialist": [
      { skills: ["Network Security", "TCP/IP Protocols"], hours: 20, difficulty: "Medium", priority: "Critical" },
      { skills: ["OWASP Top 10", "Web Application Security"], hours: 18, difficulty: "Medium", priority: "Critical" },
      { skills: ["Linux Security & Server Hardening"], hours: 16, difficulty: "Medium", priority: "High" },
      { skills: ["Cryptography", "TLS/SSL", "PKI"], hours: 22, difficulty: "Hard", priority: "High" },
      { skills: ["SIEM & Security Log Monitoring"], hours: 16, difficulty: "Medium", priority: "Medium" },
      { skills: ["Vulnerability Assessment & Scanning"], hours: 20, difficulty: "Hard", priority: "Medium" }
    ],
    "DevOps Engineer": [
      { skills: ["Docker", "Container Architecture"], hours: 18, difficulty: "Medium", priority: "Critical" },
      { skills: ["Kubernetes Cluster Orchestration"], hours: 28, difficulty: "Hard", priority: "Critical" },
      { skills: ["CI/CD Automation", "GitHub Actions"], hours: 16, difficulty: "Medium", priority: "High" },
      { skills: ["Terraform", "Infrastructure as Code"], hours: 22, difficulty: "Hard", priority: "High" },
      { skills: ["Linux System Administration", "Bash"], hours: 16, difficulty: "Medium", priority: "High" },
      { skills: ["Prometheus", "Grafana", "Observability"], hours: 16, difficulty: "Medium", priority: "Medium" }
    ]
  };

  const handleAnalyzeSkillGap = async () => {
    setIsCalculating(true);
    setErrorMessage(null);
    const skillsArray = currentSkills.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/ai/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          currentSkills: skillsArray,
          experienceLevel,
          education: education.trim() || undefined
        })
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP status ${res.status}`);
      }

      const data = await res.json();
      if (
        data &&
        typeof data === 'object' &&
        typeof data.matchPercentage === 'number' &&
        !isNaN(data.matchPercentage) &&
        Array.isArray(data.missingSkills) &&
        Array.isArray(data.learningOrder) &&
        typeof data.summary === 'string'
      ) {
        const validated: SkillGapResult = {
          role: data.role || targetRole,
          matchPercentage: Math.min(100, Math.max(0, Math.round(data.matchPercentage))),
          missingSkills: data.missingSkills.map((m: any) => ({
            name: String(m.name || 'Core Skill'),
            priority: ['Critical', 'High', 'Medium', 'Low'].includes(m.priority) ? m.priority : 'High',
            difficulty: ['Beginner', 'Easy', 'Medium', 'Hard'].includes(m.difficulty) ? m.difficulty : 'Medium',
            estimatedHours: typeof m.estimatedHours === 'number' && !isNaN(m.estimatedHours) ? Math.max(1, m.estimatedHours) : 12
          })),
          learningOrder: data.learningOrder.map((l: any) => String(l)),
          summary: data.summary
        };
        setResult(validated);
        saveStoredLastSkillGap(validated);
        return;
      }
      throw new Error('Invalid response structure received from AI endpoint.');
    } catch (err: any) {
      console.warn('Backend skill gap unavailable or returned error, executing deterministic benchmark engine:', err);

      // Verify that every single selected role has an exact benchmark matrix
      const benchmarks = ROLE_BENCHMARKS[targetRole];
      if (!benchmarks) {
        setErrorMessage(`No benchmark matrix configured for role "${targetRole}".`);
        return;
      }

      const userSkillsNormalized = skillsArray.map(s => s.toLowerCase());
      const matchedBenchmarks: string[] = [];
      const missingList: MissingSkill[] = [];

      benchmarks.forEach(item => {
        const isMatched = item.skills.some(targetSkill => 
          userSkillsNormalized.some(userSkill => 
            userSkill.includes(targetSkill.toLowerCase()) || targetSkill.toLowerCase().includes(userSkill)
          )
        );

        if (isMatched) {
          matchedBenchmarks.push(item.skills[0]);
        } else {
          missingList.push({
            name: item.skills[0],
            priority: item.priority,
            difficulty: item.difficulty,
            estimatedHours: item.hours
          });
        }
      });

      const totalReqs = benchmarks.length;
      const calculatedMatch = Math.min(95, Math.max(0, Math.round((matchedBenchmarks.length / totalReqs) * 100)));

      const deterministicResult: SkillGapResult = {
        role: targetRole,
        matchPercentage: calculatedMatch,
        summary: `(Benchmark-Based Estimate) Evaluated against the standard ${targetRole} competency matrix: identified ${matchedBenchmarks.length} matched requirements and ${missingList.length} prioritized learning targets. Note: This is an algorithmic benchmark estimate, not a generative AI assessment.`,
        missingSkills: missingList,
        learningOrder: missingList.slice(0, 4).map((m, idx) => `${idx + 1}. ${m.name} (${m.difficulty} • ~${m.estimatedHours} hrs)`)
      };

      setResult(deterministicResult);
      saveStoredLastSkillGap(deterministicResult);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Role Alignment Matrix</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Syne']">
          Skill Gap Analysis Engine
        </h1>
        <p className="text-slate-300 text-sm">
          Select your target engineering role and current skills. We evaluate missing technical stack requirements, priority levels, and estimated hours to mastery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            
            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Desired Job Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-[#0d121f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Current Skills Tags input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Current Skills (comma separated)
                </label>
                {!currentSkills && (
                  <button
                    type="button"
                    onClick={() => setCurrentSkills("React, TypeScript, Node.js, PostgreSQL, Git")}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline"
                  >
                    Load Sample Skills
                  </button>
                )}
              </div>
              <input
                type="text"
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Git..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Enter your verified technical skills, or click "Load Sample Skills" to try a demonstration.
              </p>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-[#0d121f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="Entry-Level / Fresher">Entry-Level / Fresher</option>
                <option value="Junior (0-2 yrs)">Junior (0-2 yrs)</option>
                <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
              </select>
            </div>

            {/* Education */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Education (Optional)
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.S. in Computer Science, Bootcamp, or leave blank"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyzeSkillGap}
              disabled={isCalculating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                  <span>Evaluating Skill Gap Matrix...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  <span>Calculate Skill Gap</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Results Matrix */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Role Match Header */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d121f] via-[#121828] to-[#0d121f] border border-indigo-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-semibold text-indigo-400">Target Role Alignment</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-['Syne']">
                    {result.role}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    {result.summary}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-800 fill-none" />
                      <circle
                        cx="50" cy="50" r="42"
                        stroke="currentColor" strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={2 * Math.PI * 42 * (1 - result.matchPercentage / 100)}
                        strokeLinecap="round"
                        className={`fill-none transition-all duration-1000 ${
                          result.matchPercentage >= 75 ? 'text-emerald-400' : result.matchPercentage >= 50 ? 'text-indigo-400' : 'text-amber-400'
                        }`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-white">{result.matchPercentage}%</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Match</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Skills Grid */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-['Syne']">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Prioritized Learning Targets</span>
                </h4>

                {result.missingSkills.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 text-center">
                    Outstanding! Your current skills cover all core benchmark competencies for this role.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.missingSkills.map((skill, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{skill.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              skill.priority === 'Critical' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' :
                              skill.priority === 'High' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                              'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                            }`}>
                              {skill.priority} Priority
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <BarChart className="w-3 h-3 text-indigo-400" /> {skill.difficulty}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-purple-400" /> ~{skill.estimatedHours} hrs
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Learning Order */}
              {result.learningOrder && result.learningOrder.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Recommended Learning Progression</span>
                  </h4>
                  <div className="space-y-2">
                    {result.learningOrder.map((step, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
              <Compass className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
              <h4 className="text-base font-bold text-white font-['Syne']">
                Ready to Map Your Competencies
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Select your desired role and enter your verified technical skills to generate a prioritized gap report with estimated study hours.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
