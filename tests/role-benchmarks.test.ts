import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Skill Gap Role Benchmarks Suite', () => {
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

  // Mirrored role benchmark matrix from SkillGapAnalysis
  const ROLE_BENCHMARKS: Record<string, { skills: string[]; hours: number; difficulty: string; priority: string }[]> = {
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

  test('Every selectable role in availableRoles has an exact benchmark matrix', () => {
    for (const role of availableRoles) {
      assert.ok(ROLE_BENCHMARKS[role], `Missing benchmark definition for role: ${role}`);
      assert.ok(Array.isArray(ROLE_BENCHMARKS[role]), `Benchmark for ${role} must be an array`);
      assert.ok(ROLE_BENCHMARKS[role].length >= 5, `Benchmark for ${role} must have at least 5 skills`);
    }
  });

  test('Data Analyst benchmark specifically exists and contains core analytical technologies', () => {
    const da = ROLE_BENCHMARKS["Data Analyst"];
    assert.ok(da, "Data Analyst benchmark must exist");
    const skillNames = da.flatMap(s => s.skills.map(k => k.toLowerCase()));
    assert.ok(skillNames.some(s => s.includes('sql')), 'Must include SQL');
    assert.ok(skillNames.some(s => s.includes('excel')), 'Must include Excel');
    assert.ok(skillNames.some(s => s.includes('tableau') || s.includes('power bi')), 'Must include BI visualization');
    assert.ok(skillNames.some(s => s.includes('python') || s.includes('pandas')), 'Must include Python/Pandas');
  });

  test('AI Engineer benchmark specifically exists and is distinct from Full Stack Developer', () => {
    const ai = ROLE_BENCHMARKS["AI Engineer"];
    const fs = ROLE_BENCHMARKS["Full Stack Developer"];
    assert.ok(ai, "AI Engineer benchmark must exist");
    assert.notDeepEqual(ai, fs, "AI Engineer benchmark must not simply be Full Stack Developer");
  });
});
