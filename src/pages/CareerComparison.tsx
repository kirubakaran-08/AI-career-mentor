import React, { useState, useMemo } from 'react';
import { UserProfile, CareerComparisonItem, PageType } from '../types';
import { getStoredResumeData, saveStoredUserProfile } from '../lib/storage';
import { 
  GitCompare, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Calculator, 
  Flame, 
  TrendingUp, 
  DollarSign, 
  BrainCircuit, 
  Layers, 
  ArrowRight,
  Shield,
  Star,
  Check
} from 'lucide-react';

interface CareerComparisonProps {
  userProfile: UserProfile;
  setCurrentPage: (page: PageType) => void;
}

const CAREER_DATABASE: CareerComparisonItem[] = [
  {
    id: "full-stack",
    title: "Full Stack Developer",
    category: "Software Development",
    icon: "Code",
    tagline: "Build end-to-end client applications, scalable APIs, and production deployments.",
    requiredSkills: ["React / Vue", "TypeScript", "Node.js / Express", "PostgreSQL / MongoDB", "REST & GraphQL", "Git & Docker"],
    programmingReq: "High",
    mathReq: "Basic",
    typicalTools: ["VS Code", "Postman", "Docker", "GitHub Actions", "Vercel", "Cloud Run"],
    difficulty: "Moderate",
    beginnerFriendliness: 8,
    projectRequirements: ["SaaS Web App with Auth & Database", "REST API Microservice with CRUD", "E-Commerce or Real-Time Chat"],
    interviewDifficulty: "Challenging",
    careerGrowth: "High (Steady demand across web and application development)",
    avgSalaryRange: "$75,000 – $145,000 / yr",
    suggestedLearningTime: "4–6 Months",
    idealFor: "Builders who love visual frontends combined with server architecture."
  },
  {
    id: "ai-engineer",
    title: "AI & GenAI Engineer",
    category: "Artificial Intelligence",
    icon: "BrainCircuit",
    tagline: "Architect multimodal LLM pipelines, RAG systems, and autonomous agents.",
    requiredSkills: ["Python", "Gemini API / OpenAI SDK", "Vector Databases (Pinecone/Chroma)", "RAG Systems", "LangChain / LangGraph", "FastAPI"],
    programmingReq: "High",
    mathReq: "Moderate",
    typicalTools: ["Jupyter", "Hugging Face", "ChromaDB", "Google AI Studio", "Docker", "Weights & Biases"],
    difficulty: "Advanced",
    beginnerFriendliness: 6,
    projectRequirements: ["Multimodal Document RAG Engine", "Autonomous Web Research Agent", "Fine-Tuned Specialized LLM Tool"],
    interviewDifficulty: "Heavy ML Theory",
    careerGrowth: "High (Rapidly growing industry interest in GenAI integrations)",
    avgSalaryRange: "$110,000 – $190,000 / yr",
    suggestedLearningTime: "5–8 Months",
    idealFor: "Innovators who want to harness frontier Generative AI models into real-world software."
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Data & BI",
    icon: "BarChart3",
    tagline: "Query relational datasets, spot revenue trends, and build executive dashboards.",
    requiredSkills: ["SQL & PostgreSQL", "Python / R", "Pandas & NumPy", "Tableau / PowerBI", "Excel / Google Sheets", "Exploratory Data Analysis"],
    programmingReq: "Moderate",
    mathReq: "Moderate",
    typicalTools: ["Tableau", "PowerBI", "PostgreSQL", "Jupyter", "Excel", "dbt"],
    difficulty: "Beginner",
    beginnerFriendliness: 9,
    projectRequirements: ["E-Commerce Customer Retention Analysis", "Executive Sales Revenue Dashboard", "A/B Test Conversion Evaluation"],
    interviewDifficulty: "Standard",
    careerGrowth: "Strong (Consistent baseline demand across all enterprise industries)",
    avgSalaryRange: "$65,000 – $115,000 / yr",
    suggestedLearningTime: "2–4 Months",
    idealFor: "Analytical thinkers who love statistics, business strategy, and clean visual charts."
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Data & Machine Learning",
    icon: "Database",
    tagline: "Formulate hypothesis tests, statistical predictive models, and deep learning algorithms.",
    requiredSkills: ["Python", "Probability & Statistics", "Scikit-Learn", "Regression & XGBoost", "PyTorch / TensorFlow", "Feature Engineering"],
    programmingReq: "High",
    mathReq: "Heavy",
    typicalTools: ["Jupyter Notebooks", "Scikit-Learn", "PyTorch", "MLflow", "SQLAlchemy", "Kaggle"],
    difficulty: "Advanced",
    beginnerFriendliness: 5,
    projectRequirements: ["Predictive Churn & Classification Model", "End-to-End Time Series Forecaster", "Computer Vision / NLP Spike"],
    interviewDifficulty: "High (Algorithms + System Design)",
    careerGrowth: "Very High (High strategic corporate value)",
    avgSalaryRange: "$95,000 – $165,000 / yr",
    suggestedLearningTime: "6–9 Months",
    idealFor: "Mathematical and research-oriented minds who love statistical rigor and predictive modeling."
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    category: "Machine Learning / Systems",
    icon: "Cpu",
    tagline: "Scale production model training pipelines, feature stores, and low-latency inference APIs.",
    requiredSkills: ["Python & C++", "PyTorch", "MLOps & Kubeflow", "Docker & Kubernetes", "FastAPI / Triton Server", "Model Quantization & ONNX"],
    programmingReq: "Very High",
    mathReq: "Advanced",
    typicalTools: ["Docker", "Kubernetes", "MLflow", "Triton Inference Server", "Ray", "NVIDIA CUDA"],
    difficulty: "Expert",
    beginnerFriendliness: 4,
    projectRequirements: ["Real-time Low-Latency Model Serving API", "Automated Distributed Training Pipeline", "ONNX Model Quantization Engine"],
    interviewDifficulty: "High (Algorithms + System Design)",
    careerGrowth: "Exceptional (Critical infrastructure demand)",
    avgSalaryRange: "$120,000 – $200,000 / yr",
    suggestedLearningTime: "7–12 Months",
    idealFor: "Software engineers who want to bridge scalable backend infrastructure with machine learning."
  },
  {
    id: "devops",
    title: "DevOps & Cloud Engineer",
    category: "Infrastructure & Security",
    icon: "Workflow",
    tagline: "Automate zero-downtime CI/CD pipelines, container orchestration, and cloud clusters.",
    requiredSkills: ["Linux & Bash", "Docker & Kubernetes", "AWS / GCP", "Terraform (IaC)", "GitHub Actions / ArgoCD", "Prometheus & Grafana"],
    programmingReq: "Moderate",
    mathReq: "Basic",
    typicalTools: ["Terraform", "Kubernetes", "Docker", "Helm", "Prometheus", "AWS Console"],
    difficulty: "Advanced",
    beginnerFriendliness: 6,
    projectRequirements: ["Zero-Downtime Blue/Green Deploy Pipeline", "Multi-Region Terraform Infrastructure", "Automated Cluster Monitoring Stack"],
    interviewDifficulty: "High (Algorithms + System Design)",
    careerGrowth: "Very High (Core backbone of modern engineering teams)",
    avgSalaryRange: "$90,000 – $160,000 / yr",
    suggestedLearningTime: "5–7 Months",
    idealFor: "Systems enthusiasts who love uptime, automation, and reliable cloud operations."
  },
  {
    id: "cyber-security",
    title: "Cyber Security Specialist",
    category: "Security & Compliance",
    icon: "Shield",
    tagline: "Audit vulnerability vectors, defend corporate perimeters, and perform penetration tests.",
    requiredSkills: ["Networking & TCP/IP", "Linux & Shell", "OWASP Top 10", "Wireshark / Burp Suite", "Cryptography & TLS", "Incident Response"],
    programmingReq: "Moderate",
    mathReq: "Moderate",
    typicalTools: ["Wireshark", "Burp Suite", "Metasploit", "Nmap", "Splunk", "Kali Linux"],
    difficulty: "Advanced",
    beginnerFriendliness: 5,
    projectRequirements: ["Automated Web App Vulnerability Scanner", "Network Intrusion Detection System", "Security Audit & Compliance Report"],
    interviewDifficulty: "Challenging",
    careerGrowth: "High (Crucial compliance demand)",
    avgSalaryRange: "$85,000 – $150,000 / yr",
    suggestedLearningTime: "6–9 Months",
    idealFor: "Security-minded problem solvers who love investigating protocols, exploits, and defensive architecture."
  }
];

export const CareerComparison: React.FC<CareerComparisonProps> = ({ userProfile, setCurrentPage }) => {
  // Allow selecting 2 or 3 careers
  const [selectedIds, setSelectedIds] = useState<string[]>(['full-stack', 'ai-engineer', 'data-scientist']);
  const [adoptedRoleSuccess, setAdoptedRoleSuccess] = useState<string | null>(null);

  const resumeData = getStoredResumeData();
  const userSkills = resumeData?.skills && resumeData.skills.length > 0
    ? resumeData.skills 
    : (userProfile.skills && userProfile.skills.length > 0 ? userProfile.skills : []);

  const toggleCareerSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter(item => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        // Replace the last item
        setSelectedIds([selectedIds[0], selectedIds[1], id]);
      }
    }
  };

  const comparedCareers = useMemo(() => {
    return CAREER_DATABASE.filter(c => selectedIds.includes(c.id));
  }, [selectedIds]);

  // Calculate Match Score for each compared career against user skills
  const careerMatchScores = useMemo(() => {
    return comparedCareers.map(career => {
      const totalReq = career.requiredSkills.length;
      let matched = 0;
      career.requiredSkills.forEach(req => {
        const reqLower = req.toLowerCase();
        const found = userSkills.some(s => {
          const sLower = s.toLowerCase();
          return reqLower.includes(sLower) || sLower.includes(reqLower.split('/')[0].trim());
        });
        if (found) matched++;
      });
      const skillScore = Math.round((matched / totalReq) * 60);
      const levelBonus = userProfile.experienceLevel.includes('Senior') ? 35 : userProfile.experienceLevel.includes('Mid') ? 30 : 25;
      const finalScore = Math.min(96, Math.max(45, skillScore + levelBonus));
      return {
        id: career.id,
        title: career.title,
        matchedSkillsCount: matched,
        totalSkillsCount: totalReq,
        matchScore: finalScore
      };
    });
  }, [comparedCareers, userSkills, userProfile]);

  const bestMatch = useMemo(() => {
    if (careerMatchScores.length === 0) return null;
    const sorted = [...careerMatchScores].sort((a, b) => b.matchScore - a.matchScore);
    const topId = sorted[0].id;
    return CAREER_DATABASE.find(c => c.id === topId) || CAREER_DATABASE[0];
  }, [careerMatchScores]);

  const handleAdoptRole = (roleTitle: string) => {
    const updated = { ...userProfile, targetRole: roleTitle };
    saveStoredUserProfile(updated);
    setAdoptedRoleSuccess(roleTitle);
    setTimeout(() => setAdoptedRoleSuccess(null), 3000);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#131b2e] border border-cyan-500/20 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[15px] flex items-center justify-center">
              <GitCompare className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Syne']">
              Career Path Comparison
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Compare 2–3 tech career trajectories across difficulty, skills, interview intensity, and learning timelines.
            </p>
          </div>
        </div>

        {/* Selected Counter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Selected for Comparison:</span>
          <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30">
            {selectedIds.length} / 3 Roles
          </span>
        </div>
      </div>

      {/* Role Selector Chips */}
      <div className="p-4 rounded-2xl bg-[#0c101c] border border-white/10 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Choose 2 or 3 Roles to Compare:</span>
        <div className="flex flex-wrap gap-2 pt-1">
          {CAREER_DATABASE.map(c => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCareerSelection(c.id)}
                id={`btn-select-career-${c.id}`}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20 scale-102 border border-cyan-400/40' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:text-white'
                }`}
              >
                {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-500" />}
                <span>{c.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Benchmark Estimates Transparency Notice */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 flex items-center justify-between gap-3">
        <p>
          <strong className="text-slate-300">Market Benchmark Notice:</strong> Salary figures and suggested learning timelines are illustrative industry approximations. Actual compensation and hiring requirements vary widely by geographic location, company scale, and individual candidate experience.
        </p>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className={`grid grid-cols-1 ${comparedCareers.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
        {comparedCareers.map(career => {
          const matchInfo = careerMatchScores.find(m => m.id === career.id);
          const isUserTarget = userProfile.targetRole.toLowerCase() === career.title.toLowerCase();

          return (
            <div
              key={career.id}
              className={`flex flex-col justify-between rounded-2xl bg-[#0d121f] border p-5 sm:p-6 transition-all duration-300 shadow-xl relative overflow-hidden ${
                isUserTarget 
                  ? 'border-cyan-500/50 ring-1 ring-cyan-500/30' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {isUserTarget && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-indigo-600 px-3 py-0.5 rounded-bl-xl text-[10px] font-bold text-white uppercase tracking-wider">
                  Current Target Role
                </div>
              )}

              <div className="space-y-5">
                {/* Header */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {career.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-2 font-['Syne']">
                    {career.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {career.tagline}
                  </p>
                </div>

                {/* Match Score Gauge */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Skill Match for You
                    </span>
                    <span className="font-bold text-cyan-300">{matchInfo?.matchScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${matchInfo?.matchScore || 50}%` }}
                    />
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Code2 className="w-3 h-3 text-indigo-400" /> Coding Reqs
                    </span>
                    <strong className="text-slate-200 mt-0.5 block">{career.programmingReq}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Calculator className="w-3 h-3 text-amber-400" /> Math Reqs
                    </span>
                    <strong className="text-slate-200 mt-0.5 block">{career.mathReq}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-400" /> Difficulty
                    </span>
                    <strong className="text-slate-200 mt-0.5 block">{career.difficulty}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" /> Learning Time
                    </span>
                    <strong className="text-slate-200 mt-0.5 block">{career.suggestedLearningTime}</strong>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Core Skillset</span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools & Project Requirements */}
                <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/10">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold">Typical Tools:</span>
                    <span className="text-slate-300">{career.typicalTools.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold">Interview Tone:</span>
                    <span className="text-amber-300 font-medium">{career.interviewDifficulty}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold">Estimated Salary Range:</span>
                    <span className="text-emerald-400 font-semibold">{career.avgSalaryRange}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => handleAdoptRole(career.title)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-slate-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  {isUserTarget ? 'Active Profile Role' : 'Set as My Target Role'}
                </button>
                <button
                  onClick={() => setCurrentPage('roadmap')}
                  className="w-full py-2 rounded-xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-cyan-300 text-xs font-medium transition-all flex items-center justify-center gap-1"
                >
                  <span>Explore Roadmap</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Banner if user updated role */}
      {adoptedRoleSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>Target role updated to <strong>{adoptedRoleSuccess}</strong> across all career modules!</span>
        </div>
      )}

      {/* "Best Match For You" Intelligent Recommendation Card */}
      {bestMatch && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0e172a] via-[#101b33] to-[#0c1322] border-2 border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Star className="w-36 h-36 text-cyan-400" />
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-xs uppercase tracking-wider border border-cyan-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
                Intelligent Profile Analysis
              </span>
              <span className="text-xs text-slate-400">Based on your {userSkills.length} logged skills & resume</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Syne']">
              Best Match For You: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">{bestMatch.title}</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Based on your current skill profile (**{userSkills.slice(0, 4).join(', ')}**) and career readiness level, 
              <strong> {bestMatch.title}</strong> offers your smoothest transition path, highest placement probability, and fastest time-to-hire ({bestMatch.suggestedLearningTime}).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs block">Beginner Friendliness</span>
                <strong className="text-emerald-300 text-sm">{bestMatch.beginnerFriendliness} / 10</strong>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs block">Career Growth</span>
                <strong className="text-cyan-300 text-sm">{bestMatch.careerGrowth.split('(')[0]}</strong>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs block">Avg Salary</span>
                <strong className="text-emerald-400 text-sm">{bestMatch.avgSalaryRange}</strong>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleAdoptRole(bestMatch.title)}
                id="btn-adopt-best-match"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Select as Target Career</span>
              </button>
              <button
                onClick={() => setCurrentPage('project-generator')}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm border border-white/10 transition-all flex items-center gap-1.5"
              >
                <span>Generate {bestMatch.title} Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
