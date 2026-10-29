import { CareerRoadmap, UserProfile, InterviewQuestion, CertificateRecord, GoalItem, ResumeData } from '../types';

export const emptyUserProfile: UserProfile = {
  name: "",
  email: "",
  title: "",
  targetRole: "",
  experienceLevel: "Entry-Level / Fresher",
  careerScore: 0,
  skillScore: 0,
  weeklyProgress: 0,
  learningStreakDays: 0,
  avatarUrl: "",
  bio: "",
  education: "",
  institution: "",
  graduationYear: "",
  skills: [],
  preferredTechnologies: [],
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  location: ""
};

export const sampleCandidateProfile: UserProfile = {
  name: "Demo Candidate",
  email: "demo.candidate@example.com",
  title: "Full Stack Developer",
  targetRole: "Full Stack Developer",
  experienceLevel: "Entry-Level / Fresher",
  careerScore: 84,
  skillScore: 78,
  weeklyProgress: 68,
  learningStreakDays: 12,
  avatarUrl: "",
  bio: "Passionate software engineer building high-performance full-stack web applications and AI tools.",
  education: "Bachelor of Science in Computer Science",
  institution: "State University of Technology",
  graduationYear: "2026",
  skills: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Docker", "Git"],
  preferredTechnologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Docker"],
  githubUrl: "https://github.com/example-candidate",
  linkedinUrl: "https://linkedin.com/in/example-candidate",
  portfolioUrl: "https://example-candidate.dev",
  location: "San Francisco, CA"
};

export const initialUserProfile: UserProfile = emptyUserProfile;

export const popularSkills = [
  { name: "Python & PyTorch", category: "AI / ML", popularity: "High Demand" },
  { name: "TypeScript & React", category: "Frontend", popularity: "Core Skill" },
  { name: "Node.js & Express", category: "Backend", popularity: "In Demand" },
  { name: "AWS & Kubernetes", category: "Cloud & DevOps", popularity: "High Demand" },
  { name: "SQL & PostgreSQL", category: "Databases", popularity: "Core Skill" },
  { name: "Docker & CI/CD", category: "DevOps", popularity: "In Demand" },
  { name: "System Design", category: "Architecture", popularity: "High Priority" },
  { name: "Cybersecurity & OAuth", category: "Security", popularity: "Essential" }
];

export const careerRoadmaps: CareerRoadmap[] = [
  {
    roleId: "full-stack",
    roleTitle: "Full Stack Developer",
    iconName: "Code",
    description: "Master modern web development from interactive React frontends to scalable Express Node.js backends and cloud deployments.",
    beginner: [
      { id: "fs-b1", title: "HTML5, CSS3 & Responsive Design", description: "Semantic markup, Tailwind CSS, Flexbox, Grid layout, Mobile-first mindset.", topics: ["HTML5", "CSS Grid", "Tailwind CSS", "Flexbox"], estimatedWeeks: 3 },
      { id: "fs-b2", title: "Modern JavaScript (ES6+)", description: "Async/Await, Promises, Closures, Array methods, DOM manipulation.", topics: ["Promises", "ES6 Modules", "Fetch API"], estimatedWeeks: 4 }
    ],
    intermediate: [
      { id: "fs-i1", title: "React 19 & TypeScript", description: "Hooks, Custom State Managers, Context, Vite, Component Architecture.", topics: ["React Hooks", "TypeScript", "Vite", "Zustand/Redux"], estimatedWeeks: 5 },
      { id: "fs-i2", title: "Node.js, Express & REST APIs", description: "Express routing, Middleware, JWT Auth, CORS, Input Validation.", topics: ["Express", "JWT", "RESTful API Design"], estimatedWeeks: 4 }
    ],
    advanced: [
      { id: "fs-a1", title: "Databases & ORM (PostgreSQL / Prisma)", description: "Relational modeling, indexing, SQL queries, migrations, Prisma/Drizzle.", topics: ["PostgreSQL", "Prisma", "Database Indexing"], estimatedWeeks: 4 },
      { id: "fs-a2", title: "Docker, CI/CD & Deployment", description: "Containerization, GitHub Actions, Cloud Run, Vercel, Nginx reverse proxy.", topics: ["Docker", "GitHub Actions", "Cloud Run"], estimatedWeeks: 3 }
    ],
    projects: [
      { name: "SaaS Task Management System", description: "Full stack app with drag-and-drop boards, JWT auth, and WebSocket updates.", tags: ["React", "Express", "PostgreSQL", "Tailwind"] },
      { name: "E-Commerce Microservice", description: "Stripe payment processing, inventory webhooks, and Redis caching.", tags: ["TypeScript", "Node.js", "Redis", "Docker"] }
    ],
    certificates: [
      { title: "Meta Front-End Developer Professional", provider: "Meta / Coursera" },
      { title: "AWS Certified Developer Associate", provider: "Amazon Web Services" }
    ],
    interviewPrep: [
      { question: "Explain the React Fiber reconciliation algorithm and how batching works.", category: "Frontend" },
      { question: "How do you handle database connection pooling in Express applications under high traffic?", category: "Backend" }
    ]
  },
  {
    roleId: "ai-engineer",
    roleTitle: "AI Engineer",
    iconName: "BrainCircuit",
    description: "Design and deploy next-gen GenAI systems using LLMs, Vector Databases, RAG architectures, and Gemini APIs.",
    beginner: [
      { id: "ai-b1", title: "Python for Data & AI", description: "NumPy, Pandas, Async IO, Python type hints, Object-Oriented Design.", topics: ["Python 3.12", "NumPy", "Pandas"], estimatedWeeks: 3 },
      { id: "ai-b2", title: "Foundations of AI & Prompt Engineering", description: "LLM parameters, System prompts, Tokenization, Few-shot prompting.", topics: ["LLMs", "Prompting", "Tokenization"], estimatedWeeks: 2 }
    ],
    intermediate: [
      { id: "ai-i1", title: "Gemini API & LLM SDK Integration", description: "Function calling, Structured JSON outputs, Multimodal inputs, Live APIs.", topics: ["Gemini API", "@google/genai", "Tool Calling"], estimatedWeeks: 4 },
      { id: "ai-i2", title: "Embeddings & Vector Search (RAG)", description: "Pinecone, ChromaDB, Cosine similarity, Semantic search, Hybrid retrieval.", topics: ["Vector Databases", "Embeddings", "RAG"], estimatedWeeks: 5 }
    ],
    advanced: [
      { id: "ai-a1", title: "Agentic Workflows & Multi-Agent Frameworks", description: "Chain-of-Thought, Tool execution loops, LangGraph, Antigravity patterns.", topics: ["Agents", "LangChain", "Autogen"], estimatedWeeks: 5 },
      { id: "ai-a2", title: "LLM Evaluation, Guardrails & Production Serving", description: "Hallucination metrics, Latency optimization, Quantization, vLLM, Cloud deployment.", topics: ["vLLM", "Guardrails", "Model Eval"], estimatedWeeks: 4 }
    ],
    projects: [
      { name: "Enterprise Multimodal RAG System", description: "Upload PDF documents and chat with AI grounded in domain vector embeddings.", tags: ["Python", "Gemini API", "ChromaDB", "FastAPI"] },
      { name: "AI Autonomous Research Agent", description: "Multi-step research agent that executes web tools and aggregates structured reports.", tags: ["TypeScript", "Node.js", "@google/genai"] }
    ],
    certificates: [
      { title: "Google Cloud Professional ML Engineer", provider: "Google Cloud" },
      { title: "DeepLearning.AI Generative AI Developer Specialization", provider: "DeepLearning.AI" }
    ],
    interviewPrep: [
      { question: "How does RAG compare to Fine-Tuning in terms of latency, cost, and knowledge update speed?", category: "AI / ML" },
      { question: "Explain the Transformer self-attention mechanism mathematically.", category: "AI Theory" }
    ]
  },
  {
    roleId: "data-analyst",
    roleTitle: "Data Analyst",
    iconName: "BarChart3",
    description: "Transform raw data into strategic insights with SQL, Python, Tableau, PowerBI, and predictive statistics.",
    beginner: [
      { id: "da-b1", title: "SQL Fundamentals & Data Queries", description: "SELECT, JOINs, Group By, Subqueries, CTEs, Window functions.", topics: ["SQL", "PostgreSQL", "Aggregation"], estimatedWeeks: 3 }
    ],
    intermediate: [
      { id: "da-i1", title: "Python Data Analysis (Pandas & Seaborn)", description: "Data cleaning, exploratory data analysis, plotting histograms and correlation matrices.", topics: ["Pandas", "Matplotlib", "EDA"], estimatedWeeks: 4 }
    ],
    advanced: [
      { id: "da-a1", title: "BI Dashboards & Executive Storytelling", description: "Building interactive Tableau/PowerBI visual stories for business stakeholders.", topics: ["Tableau", "PowerBI", "Metrics"], estimatedWeeks: 3 }
    ],
    projects: [
      { name: "E-Commerce Customer Churn Analysis", description: "Identified key churn factors using SQL queries and interactive Python plots.", tags: ["Python", "SQL", "Pandas"] }
    ],
    certificates: [{ title: "Google Data Analytics Professional", provider: "Google" }],
    interviewPrep: [{ question: "What is the difference between WHERE and HAVING clauses in SQL?", category: "SQL" }]
  },
  {
    roleId: "data-scientist",
    roleTitle: "Data Scientist",
    iconName: "Database",
    description: "Build statistical models, machine learning pipelines, and predictive analytics algorithms.",
    beginner: [{ id: "ds-b1", title: "Probability, Linear Algebra & Stats", description: "Hypothesis testing, A/B testing, Bayes theorem, Linear regression.", topics: ["Statistics", "Linear Algebra"], estimatedWeeks: 4 }],
    intermediate: [{ id: "ds-i1", title: "Supervised & Unsupervised ML", description: "Scikit-Learn, Random Forests, XGBoost, K-Means clustering.", topics: ["Scikit-Learn", "XGBoost"], estimatedWeeks: 5 }],
    advanced: [{ id: "ds-a1", title: "Deep Learning & PyTorch", description: "Neural networks, Backpropagation, CNNs, Transformers.", topics: ["PyTorch", "Deep Learning"], estimatedWeeks: 6 }],
    projects: [{ name: "Predictive Housing Price Model", description: "Gradient boosted decision tree model with cross-validation and feature scaling.", tags: ["Python", "XGBoost", "Scikit-Learn"] }],
    certificates: [{ title: "IBM Data Science Professional", provider: "IBM" }],
    interviewPrep: [{ question: "How do you diagnose and prevent overfitting in decision tree models?", category: "Machine Learning" }]
  },
  {
    roleId: "ml-engineer",
    roleTitle: "Machine Learning Engineer",
    iconName: "Cpu",
    description: "Deploy scalable machine learning pipelines, feature stores, model monitoring, and MLOps.",
    beginner: [{ id: "mle-b1", title: "Software Engineering for ML", description: "Clean Python code, Modular architectures, Unit testing ML pipelines.", topics: ["Python", "pytest"], estimatedWeeks: 3 }],
    intermediate: [{ id: "mle-i1", title: "Model Training & Hyperparameter Tuning", description: "PyTorch Lightning, Optuna, MLflow tracking.", topics: ["MLflow", "Optuna"], estimatedWeeks: 4 }],
    advanced: [{ id: "mle-a1", title: "MLOps & Model Deployment", description: "Triton Server, Docker, FastAPI, Kubernetes, KServe.", topics: ["MLOps", "Kubernetes", "FastAPI"], estimatedWeeks: 5 }],
    projects: [{ name: "Real-time Sentiment Analysis API", description: "Deployed BERT model wrapped in FastAPI with ONNX runtime.", tags: ["PyTorch", "ONNX", "FastAPI"] }],
    certificates: [{ title: "AWS Certified Machine Learning Specialty", provider: "AWS" }],
    interviewPrep: [{ question: "Explain feature store architecture and why offline/online consistency matters.", category: "MLOps" }]
  },
  {
    roleId: "frontend-dev",
    roleTitle: "Frontend Developer",
    iconName: "Layout",
    description: "Create pixel-perfect, lightning-fast UI experiences with React, Next.js, Motion, and Tailwind CSS.",
    beginner: [{ id: "fe-b1", title: "CSS Mastery & Micro-Interactions", description: "Keyframe animations, CSS Variables, Responsive design, Glassmorphism.", topics: ["CSS3", "Tailwind"], estimatedWeeks: 3 }],
    intermediate: [{ id: "fe-i1", title: "React Architecture & Performance", description: "Virtual DOM, Memoization, Code splitting, Web Vitals optimization.", topics: ["React", "Performance"], estimatedWeeks: 4 }],
    advanced: [{ id: "fe-a1", title: "Advanced Web Animation & Accessibility", description: "Framer Motion/Motion, Canvas API, WCAG AA compliance.", topics: ["Motion", "Accessibility"], estimatedWeeks: 3 }],
    projects: [{ name: "Interactive Analytics Dashboard", description: "Ultra-responsive dark mode dashboard with SVG chart visualizers.", tags: ["React", "Tailwind", "Lucide"] }],
    certificates: [{ title: "Meta Front-End Professional", provider: "Meta" }],
    interviewPrep: [{ question: "What is Event Delegation in JS and how does it optimize memory?", category: "JavaScript" }]
  },
  {
    roleId: "backend-dev",
    roleTitle: "Backend Developer",
    iconName: "Server",
    description: "Architect high-throughput microservices, databases, authentication streams, and distributed queues.",
    beginner: [{ id: "be-b1", title: "Server Foundations & HTTP/REST", description: "Status codes, Headers, Express, Middleware, Routing.", topics: ["Express", "HTTP"], estimatedWeeks: 3 }],
    intermediate: [{ id: "be-i1", title: "SQL & NoSQL Database Design", description: "Schema normalization, indexing, Redis caching, transaction isolation.", topics: ["PostgreSQL", "Redis"], estimatedWeeks: 4 }],
    advanced: [{ id: "be-a1", title: "Distributed Systems & Message Queues", description: "RabbitMQ, Kafka, gRPC, Load balancing, Rate limiting.", topics: ["Kafka", "System Design"], estimatedWeeks: 5 }],
    projects: [{ name: "Distributed Rate-Limiter Service", description: "Sliding window rate limiter built with Redis and Node.js.", tags: ["Node.js", "Redis"] }],
    certificates: [{ title: "Oracle Certified Professional Java SE / Node", provider: "Oracle" }],
    interviewPrep: [{ question: "Explain the CAP theorem and trade-offs between consistency and availability.", category: "System Design" }]
  },
  {
    roleId: "cloud-engineer",
    roleTitle: "Cloud Engineer",
    iconName: "Cloud",
    description: "Provision cloud infrastructure using AWS, GCP, Terraform, serverless functions, and IAM policies.",
    beginner: [{ id: "ce-b1", title: "Cloud Fundamentals & VPC Networking", description: "Subnets, Gateways, EC2, Cloud Storage, Security Groups.", topics: ["AWS", "VPC"], estimatedWeeks: 3 }],
    intermediate: [{ id: "ce-i1", title: "Infrastructure as Code (Terraform)", description: "Terraform state, Modules, Provider configs, Automated provisioning.", topics: ["Terraform", "IaC"], estimatedWeeks: 4 }],
    advanced: [{ id: "ce-a1", title: "Serverless & Cloud Security", description: "Lambda, Cloud Run, IAM roles, Secret Manager, WAF.", topics: ["Cloud Run", "IAM"], estimatedWeeks: 4 }],
    projects: [{ name: "Automated Multi-Region Infrastructure", description: "Provisioned scalable VPCs and Auto-Scaling groups with Terraform.", tags: ["Terraform", "AWS"] }],
    certificates: [{ title: "AWS Certified Solutions Architect Associate", provider: "AWS" }],
    interviewPrep: [{ question: "How does a NAT Gateway work in a private subnet?", category: "Cloud Networking" }]
  },
  {
    roleId: "cyber-security",
    roleTitle: "Cyber Security Specialist",
    iconName: "ShieldCheck",
    description: "Protect enterprise networks, audit vulnerability vectors, manage OAuth/JWT security, and perform penetration tests.",
    beginner: [{ id: "cs-b1", title: "Networking & Security Protocols", description: "TCP/IP, OSI Model, TLS/SSL, DNS security, Wireshark packet analysis.", topics: ["Wireshark", "TLS"], estimatedWeeks: 3 }],
    intermediate: [{ id: "cs-i1", title: "Web Application Security (OWASP Top 10)", description: "XSS, SQL Injection, CSRF, Broken Auth, Security Headers.", topics: ["OWASP", "PenTesting"], estimatedWeeks: 4 }],
    advanced: [{ id: "cs-a1", title: "Threat Hunting & SIEM Analytics", description: "Log parsing, Incident response, Cryptography, Identity management.", topics: ["SIEM", "Cryptography"], estimatedWeeks: 4 }],
    projects: [{ name: "Vulnerability Audit & Security Suite", description: "Automated scanner for header misconfigurations and outdated dependencies.", tags: ["Python", "Security"] }],
    certificates: [{ title: "CompTIA Security+", provider: "CompTIA" }],
    interviewPrep: [{ question: "Explain how public-key cryptography works in HTTPS handshakes.", category: "Cryptography" }]
  },
  {
    roleId: "devops",
    roleTitle: "DevOps Engineer",
    iconName: "Workflow",
    description: "Automate build pipelines, monitor uptime with Prometheus, and orchestrate Kubernetes clusters.",
    beginner: [{ id: "do-b1", title: "Linux Administration & Bash Scripting", description: "Systemd, SSH key pairs, file permissions, shell automation.", topics: ["Linux", "Bash"], estimatedWeeks: 3 }],
    intermediate: [{ id: "do-i1", title: "CI/CD & Containerization", description: "Docker multi-stage builds, GitHub Actions pipelines, Helm charts.", topics: ["Docker", "GitHub Actions"], estimatedWeeks: 4 }],
    advanced: [{ id: "do-a1", title: "Kubernetes Orchestration & Grafana", description: "Deployments, Services, Ingress, HPA, Prometheus metrics, Grafana dashboards.", topics: ["Kubernetes", "Prometheus"], estimatedWeeks: 5 }],
    projects: [{ name: "Zero-Downtime Deployment Pipeline", description: "Automated blue-green deployment pipeline using ArgoCD and Kubernetes.", tags: ["Kubernetes", "ArgoCD"] }],
    certificates: [{ title: "Certified Kubernetes Administrator (CKA)", provider: "CNCF" }],
    interviewPrep: [{ question: "How does Kubernetes handle pod liveness vs readiness probes?", category: "Kubernetes" }]
  }
];

export const sampleInterviewQuestions: InterviewQuestion[] = [
  {
    id: "iq-1",
    category: "Technical",
    role: "Full Stack Developer",
    question: "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?",
    hint: "Think about ACID compliance vs Eventual Consistency, fixed schemas vs flexible JSON documents, and horizontal vs vertical scaling.",
    difficulty: "Medium"
  },
  {
    id: "iq-2",
    category: "Coding",
    role: "Software Engineer",
    question: "Write a function to find the longest substring without repeating characters in O(n) time complexity.",
    hint: "Use the sliding window technique with two pointers and a Hash Map or Set to track character indices.",
    difficulty: "Medium"
  },
  {
    id: "iq-3",
    category: "HR",
    role: "General",
    question: "Tell me about a time you faced a difficult technical conflict within your engineering team. How did you resolve it?",
    hint: "Use the STAR method (Situation, Task, Action, Result). Focus on objective benchmarks, trade-off comparisons, and collaborative empathy.",
    difficulty: "Easy"
  },
  {
    id: "iq-4",
    category: "Behavioral",
    role: "General",
    question: "How do you prioritize learning new frameworks when working on tight project deadlines?",
    hint: "Demonstrate structured time-boxing, focusing on core APIs first, leveraging documentation, and building quick spikes/proof-of-concepts.",
    difficulty: "Easy"
  },
  {
    id: "iq-5",
    category: "Technical",
    role: "AI Engineer",
    question: "What is Retrieval-Augmented Generation (RAG)? How do chunk size and overlap impact semantic retrieval accuracy?",
    hint: "Discuss vector embeddings, context window efficiency, information fragmentation, and trade-offs between precision and recall.",
    difficulty: "Hard"
  }
];

export const sampleCertificates: CertificateRecord[] = [
  {
    id: "cert-1",
    title: "Google Cloud Digital Leader",
    provider: "Google Cloud",
    completionDate: "2026-05-15",
    category: "Cloud",
    credentialUrl: "https://cloud.google.com/certification",
    status: "Completed",
    progressPercentage: 100
  },
  {
    id: "cert-2",
    title: "AWS Certified Developer - Associate",
    provider: "Amazon Web Services",
    completionDate: "2026-09-30",
    category: "Cloud / Backend",
    credentialUrl: "",
    status: "In Progress",
    progressPercentage: 65
  },
  {
    id: "cert-3",
    title: "Meta Front-End Developer Specialization",
    provider: "Meta / Coursera",
    completionDate: "2026-11-20",
    category: "Frontend",
    credentialUrl: "",
    status: "In Progress",
    progressPercentage: 40
  }
];

export const sampleGoals: GoalItem[] = [
  {
    id: "goal-1",
    title: "Complete 2 LeetCode Medium problems in dynamic programming",
    type: "Daily",
    category: "Coding & Algorithms",
    targetDate: "Today",
    isCompleted: true,
    progressPercentage: 100
  },
  {
    id: "goal-2",
    title: "Review Gemini API Multimodal & System Instructions documentation",
    type: "Daily",
    category: "AI Engineering",
    targetDate: "Today",
    isCompleted: false,
    progressPercentage: 50
  },
  {
    id: "goal-3",
    title: "Build and deploy 1 Full Stack project with Docker & Cloud Run",
    type: "Weekly",
    category: "Projects",
    targetDate: "This Sunday",
    isCompleted: false,
    progressPercentage: 70
  },
  {
    id: "goal-4",
    title: "Conduct 3 AI Mock Interview practice sessions with feedback analysis",
    type: "Monthly",
    category: "Interview Prep",
    targetDate: "End of Month",
    isCompleted: true,
    progressPercentage: 100
  },
  {
    id: "goal-5",
    title: "Land a Software Engineering Internship / Entry-level role at a top startup",
    type: "Career",
    category: "Career Milestone",
    targetDate: "Q4 2026",
    isCompleted: false,
    progressPercentage: 65
  }
];

export const emptyResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: ""
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certificates: [],
  achievements: []
};

export const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 019-2834",
    location: "Seattle, WA",
    linkedin: "linkedin.com/in/example-profile",
    github: "github.com/example-profile",
    summary: "Aspiring Full Stack Engineer with hands-on experience building reactive Web Applications and cloud APIs. Passionate about sleek UI/UX design, clean code architecture, and high-performance server engineering."
  },
  education: [
    {
      id: "edu-1",
      institution: "State Institute of Technology",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science & Engineering",
      startDate: "2022",
      endDate: "2026",
      grade: "3.85 GPA"
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Apex Tech Labs",
      role: "Software Engineer Intern",
      location: "San Francisco, CA",
      startDate: "Jun 2025",
      endDate: "Sep 2025",
      highlights: [
        "Architected an Express Node.js microservice handling 15,000+ daily API requests with 99.9% uptime.",
        "Refactored React components into modular TypeScript structures, improving Lighthouse performance score from 72 to 98.",
        "Integrated Gemini API for automated content moderation, reducing manual audit times by 60%."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "AI Resume & Career Roadmap Engine",
      technologies: "React 19, TypeScript, Node.js, Express, Tailwind CSS, @google/genai",
      description: "PWA career guidance portal providing instant ATS resume score audits and interactive roadmap milestones.",
      link: "https://ai-career-mentor.app"
    },
    {
      id: "proj-2",
      title: "Real-Time Collaborative Code Board",
      technologies: "React, WebSockets, Tailwind CSS, Monaco Editor",
      description: "Multi-user browser IDE with live syntax highlighting, pair programming cursors, and instant execution sandboxes.",
      link: "https://github.com/example-dev/code-board"
    }
  ],
  skills: ["React 19", "TypeScript", "Node.js", "Express", "Python", "Gemini API", "Tailwind CSS", "Docker", "PostgreSQL", "Git & GitHub"],
  certificates: ["Google Cloud Digital Leader", "AWS Developer Associate (In Progress)"],
  achievements: [
    "Winner of Hackathon 2025 - Best AI Solution for Education",
    "Maintained a 12-day consecutive coding and learning streak on AI Career Mentor"
  ]
};

export const initialResumeData: ResumeData = emptyResumeData;
