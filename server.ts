import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  // Support deployment platforms with dynamic PORT env var (e.g. Cloud Run, container hosts)
  const PORT = Number(process.env.PORT) || 3000;

  // Trust first reverse proxy hop (Cloud Run / load balancer) for accurate IP resolution
  app.set("trust proxy", 1);

  // Request size limit: 2MB is generous for text resumes and prompts while protecting against memory exhaustion
  app.use(express.json({ limit: "2mb" }));

  // Helper to lazily initialize Gemini Client
  function getGeminiAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Model configuration: gemini-3.8-flash is the verified primary model
  const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const SECONDARY_FALLBACK_MODEL = "gemini-3.6-flash";

  async function generateWithFallback(ai: GoogleGenAI, params: any) {
    try {
      return await ai.models.generateContent({
        ...params,
        model: PRIMARY_MODEL,
      });
    } catch (primaryErr: any) {
      console.warn(`Primary model (${PRIMARY_MODEL}) failed, trying fallback (${SECONDARY_FALLBACK_MODEL}):`, primaryErr?.message || primaryErr);
      return await ai.models.generateContent({
        ...params,
        model: SECONDARY_FALLBACK_MODEL,
      });
    }
  }

  // ==================== SECURITY: RATE LIMITING ====================
  // Sliding-window in-memory rate limiter for public AI endpoints (30 requests/min per IP)
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT_WINDOW_MS = 60 * 1000;
  const MAX_REQUESTS_PER_WINDOW = 30;

  // Periodic cleanup of stale rate-limit records every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  function aiRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
    const ip = req.ip || (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "client";
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      return next();
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        error: "Too many AI requests. Please wait a moment before trying again.",
        retryAfter: retryAfterSeconds,
      });
    }

    record.count += 1;
    next();
  }

  // Safe JSON parser that removes markdown code fences and handles trailing explanations
  function parseJsonResponse(rawText: string | undefined): any {
    if (!rawText) return {};
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Secondary extraction: isolate outer curly braces if markdown wraps json
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    try {
      return JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn("Failed to parse AI JSON response directly, raw text:", rawText);
      throw parseErr;
    }
  }

  // Apply rate limiter to all AI routes
  app.use("/api/ai", aiRateLimiter);

  // ==================== API ROUTES ====================

  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      primaryModel: PRIMARY_MODEL,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // 1. AI Chat & General Career Mentor Assistant
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "A message string is required." });
      }
      if (message.length > 4000) {
        return res.status(400).json({ error: "Message exceeds maximum allowed length of 4000 characters." });
      }

      const ai = getGeminiAI();

      const systemInstruction = `You are "Aura", an AI Career Mentor for students, freshers, and tech job seekers.
Your goal is to offer actionable, encouraging career guidance, resume suggestions, interview strategies, and learning roadmaps.
Keep your responses well-formatted with markdown, clear headings, bullet points, and concise key takeaways.
Do not guarantee hiring outcomes, ATS percentage claims, or recruiter callbacks. Offer honest, constructive advice.`;

      const contents = Array.isArray(history) && history.length > 0 
        ? [...history, { role: "user", parts: [{ text: message }] }]
        : [{ role: "user", parts: [{ text: message }] }];

      const response = await generateWithFallback(ai, {
        contents,
        config: { systemInstruction },
      });

      res.json({ text: response.text || "I am here to guide your career growth. How can I assist you today?" });
    } catch (err: any) {
      console.error("Error in AI chat route:", err);
      res.status(500).json({ 
        error: "AI service connection error. Please verify your network connection or API configuration."
      });
    }
  });

  // 2. Resume Analyzer API
  app.post("/api/ai/analyze-resume", async (req, res) => {
    try {
      const { resumeText, targetRole } = req.body;

      if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
        return res.status(400).json({ error: "Resume text must be provided (at least 20 characters)." });
      }
      if (resumeText.length > 50000) {
        return res.status(400).json({ error: "Resume text exceeds maximum length of 50,000 characters." });
      }

      const cleanRole = typeof targetRole === "string" && targetRole.trim() 
        ? targetRole.trim().slice(0, 100) 
        : "Software Engineer / Tech Professional";

      const ai = getGeminiAI();

      const prompt = `Analyze this candidate's resume for the target role: "${cleanRole}".
Provide an objective, constructive evaluation of formatting clarity, keyword presence, and quantitative impact.
Do not promise or guarantee employment, ATS passage, or recruiter callbacks.

Resume Content:
${resumeText}

Return a valid JSON object matching this exact schema:
{
  "overallScore": 82,
  "formattingScore": 88,
  "keywordsScore": 76,
  "impactScore": 80,
  "summary": "High-level summary of the candidate's profile strengths and gaps.",
  "strengths": ["Clear section layouts", "Strong metrics in projects"],
  "weaknesses": ["Missing cloud deployment details", "Need more quantifiable outcome metrics"],
  "missingKeywords": ["Docker", "Kubernetes", "CI/CD", "TypeScript"],
  "actionableTips": ["Quantify impact in project achievements", "Add a link to live demonstration or repository"]
}`;

      const response = await generateWithFallback(ai, {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = parseJsonResponse(response.text);
      res.json(parsed);
    } catch (err: any) {
      console.error("Resume analysis error:", err);
      res.status(500).json({ error: "Failed to analyze resume. Please check your network connection or backend configuration." });
    }
  });

  // 3. AI Skill Gap Analysis
  app.post("/api/ai/skill-gap", async (req, res) => {
    try {
      const { targetRole, currentSkills, experienceLevel, education } = req.body;

      if (!targetRole || typeof targetRole !== "string") {
        return res.status(400).json({ error: "Target role string is required." });
      }

      const skillsFormatted = Array.isArray(currentSkills) 
        ? currentSkills.join(", ") 
        : (typeof currentSkills === "string" ? currentSkills : "None provided yet");

      const ai = getGeminiAI();

      const prompt = `Evaluate skill gaps for a candidate aspiring to be a "${targetRole.slice(0, 100)}".
Current Skills: ${skillsFormatted.slice(0, 1000)}
Experience Level: ${String(experienceLevel || "Entry-Level").slice(0, 50)}
Education: ${String(education || "Not specified").slice(0, 100)}

Return JSON matching this schema:
{
  "role": "${targetRole.slice(0, 100)}",
  "matchPercentage": 72,
  "missingSkills": [
    { "name": "Skill Name", "priority": "High", "difficulty": "Medium", "estimatedHours": 15 }
  ],
  "learningOrder": ["Skill 1", "Skill 2"],
  "summary": "Brief constructive guidance on what to learn first"
}`;

      const response = await generateWithFallback(ai, {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" },
      });

      res.json(parseJsonResponse(response.text));
    } catch (err: any) {
      console.error("Skill gap error:", err);
      res.status(500).json({ error: "Failed to compute skill gap analysis." });
    }
  });

  // 4. AI Interview Feedback API
  app.post("/api/ai/interview-feedback", async (req, res) => {
    try {
      const { question, answer, category } = req.body;

      if (!question || typeof question !== "string") {
        return res.status(400).json({ error: "Interview question is required." });
      }
      if (!answer || typeof answer !== "string" || !answer.trim()) {
        return res.status(400).json({ error: "Candidate answer is required." });
      }
      if (answer.length > 5000) {
        return res.status(400).json({ error: "Answer exceeds maximum length of 5000 characters." });
      }

      const ai = getGeminiAI();

      const prompt = `Evaluate the candidate's answer for this technical/behavioral interview question.
Category: ${String(category || "Technical").slice(0, 50)}
Question: "${question.slice(0, 500)}"
Candidate Answer: "${answer}"

Evaluate clarity, technical accuracy, and structure (such as STAR method if behavioral).
Do not guarantee hiring results.

Return JSON matching:
{
  "score": 85,
  "strengths": ["Clear explanation of core concepts", "Structured presentation"],
  "improvements": ["Add specific quantitative results", "Discuss architectural trade-offs"],
  "sampleBetterAnswer": "A concise model answer illustrating best practice..."
}`;

      const response = await generateWithFallback(ai, {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" },
      });

      res.json(parseJsonResponse(response.text));
    } catch (err: any) {
      console.error("Interview feedback error:", err);
      res.status(500).json({ error: "Failed to generate interview feedback." });
    }
  });

  // 5. AI Career Chat with Deep User Context
  app.post("/api/ai/career-chat", async (req, res) => {
    try {
      const { message, history, context } = req.body;

      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "A message string is required." });
      }
      if (message.length > 4000) {
        return res.status(400).json({ error: "Message exceeds maximum allowed length of 4000 characters." });
      }

      const ai = getGeminiAI();

      const hasSkills = Array.isArray(context?.skills) && context.skills.length > 0;
      const userContextString = context ? `
User Career Context:
- Name: ${context.name || "Candidate"}
- Target Career Role: ${context.targetRole || "Not specified by user"}
- Experience Level: ${context.experienceLevel || "Not specified by user"}
- Recorded Skills: ${hasSkills ? context.skills.join(", ") : "None recorded in user profile yet"}
- Career Readiness Score: ${context.careerScore ? `${context.careerScore}/100` : "Not calculated yet"}
- Active Goals: ${context.activeGoalsCount !== null && context.activeGoalsCount !== undefined ? `${context.activeGoalsCount} active goals` : "None created yet"}
- Recorded Certifications: ${context.certificatesCount !== null && context.certificatesCount !== undefined ? `${context.certificatesCount} certifications` : "None recorded yet"}
- Last Resume Score: ${context.resumeScore ? `${context.resumeScore}/100` : "No resume analyzed yet"}
` : "";

      const systemInstruction = `You are "Aura", an AI Career Mentor specialized in software engineering, data science, AI, cloud, and modern tech careers.
You provide realistic, high-impact career advice tailored specifically to the user's background, current skills, resume strengths/weaknesses, and career aspirations.

${userContextString}

Guidelines:
- Incorporate the user's background if provided. If the user's profile is empty (no skills or target role recorded), gently suggest completing their profile or analyzing their resume to unlock personalized insights.
- Never invent fake scores, unverified customer testimonials, or guarantee hiring outcomes.
- Format responses clearly with markdown (bold keywords, bulleted action items, concise code/project suggestions).
- Focus on practical, actionable steps for portfolio building, closing skill gaps, and interview prep.
- End with 1 clear "Next Recommended Step" or follow-up question.`;

      const contents = Array.isArray(history) && history.length > 0 
        ? [...history, { role: "user", parts: [{ text: message }] }]
        : [{ role: "user", parts: [{ text: message }] }];

      const response = await generateWithFallback(ai, {
        contents,
        config: { systemInstruction },
      });

      res.json({ text: response.text || "I'm here to support your career growth. Let's tackle your next milestone!" });
    } catch (err: any) {
      console.error("Career chat API error:", err);
      res.status(500).json({ 
        error: "AI service temporary error. Please check your connection or backend Gemini API key."
      });
    }
  });

  // 6. ATS Job Description Matcher API
  app.post("/api/ai/match-job", async (req, res) => {
    try {
      const { jobDescription, resumeData, targetRole } = req.body;

      if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 20) {
        return res.status(400).json({ error: "Job description must be provided (at least 20 characters)." });
      }
      if (jobDescription.length > 30000) {
        return res.status(400).json({ error: "Job description exceeds maximum allowed length of 30,000 characters." });
      }

      const ai = getGeminiAI();

      const resumeSummary = typeof resumeData === 'object' 
        ? JSON.stringify(resumeData).slice(0, 15000) 
        : String(resumeData || "").slice(0, 15000);

      const prompt = `You are a technical career advisor and ATS compatibility auditor.
Analyze this job description against the candidate's resume/profile.
Do not claim or guarantee that the candidate will receive an interview callback or job offer.
This is an estimated compatibility evaluation.

Target Role: ${String(targetRole || "Software Engineer").slice(0, 100)}

Candidate Profile / Resume:
${resumeSummary}

Job Description:
${jobDescription}

Return a valid JSON object matching this exact schema:
{
  "matchPercentage": 75,
  "jobRole": "Role Title extracted from JD",
  "companyName": "Company Name if present or 'Hiring Company'",
  "matchingSkills": ["React", "TypeScript", "Node.js"],
  "missingSkills": ["AWS Lambda", "Kubernetes", "GraphQL"],
  "importantKeywords": [
    { "keyword": "CI/CD", "category": "DevOps", "presentInResume": false },
    { "keyword": "RESTful APIs", "category": "Backend", "presentInResume": true }
  ],
  "experienceGaps": ["Requires production cloud deployment experience", "Microservices architecture"],
  "educationMatch": {
    "required": "Degree in Computer Science or equivalent experience",
    "userStatus": "User education or self-taught",
    "isMatch": true,
    "note": "Education match assessment based on provided details."
  },
  "recommendedResumeChanges": [
    "Highlight relevant containerization tooling if experienced",
    "Incorporate specific performance metrics into project descriptions"
  ],
  "estimatedAtsCompatibility": "Moderate",
  "disclaimer": "This is an estimated compatibility audit based on keyword frequency, semantic context, and technical relevance. Not affiliated with any specific proprietary ATS vendor."
}`;

      const response = await generateWithFallback(ai, {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" },
      });

      res.json(parseJsonResponse(response.text));
    } catch (err: any) {
      console.error("Job matcher error:", err);
      res.status(500).json({ error: "Failed to match job description." });
    }
  });

  // 7. Dynamic Project Idea Generator API
  app.post("/api/ai/generate-projects", async (req, res) => {
    try {
      const { targetCareer, skillLevel, preferredTech, difficulty } = req.body;

      if (!targetCareer || typeof targetCareer !== "string") {
        return res.status(400).json({ error: "Target career string is required." });
      }

      const ai = getGeminiAI();

      const prompt = `Generate 3 standout portfolio project ideas for career development.
Avoid basic clichés like calculators, to-do apps, simple weather apps, or generic basic quizzes.
Prioritize realistic, impressive portfolio pieces that showcase full lifecycle engineering, robust data handling, and real-world utility.

Target Career: ${targetCareer.slice(0, 100)}
Skill Level: ${String(skillLevel || "Intermediate").slice(0, 50)}
Preferred Tech: ${String(preferredTech || "React & Node.js").slice(0, 100)}
Project Difficulty: ${String(difficulty || "Industry Grade").slice(0, 50)}

Return a JSON array of 3 objects with this exact schema:
[
  {
    "id": "proj-gen-1",
    "title": "Clear catchy project title",
    "targetCareer": "${targetCareer.slice(0, 100)}",
    "problemStatement": "Clear 2-sentence problem statement explaining why this needs to exist.",
    "realWorldUseCase": "Who uses this in production and the business impact.",
    "technologies": ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
    "features": [
      "Real-time data streaming with WebSockets",
      "Role-based access control with JWT",
      "Automated PDF export engine",
      "Interactive data visualization"
    ],
    "datasetApiRequirements": "Public REST API or open dataset",
    "difficulty": "${String(difficulty || "Industry Grade").slice(0, 50)}",
    "estimatedHours": 35,
    "skillsDemonstrated": ["State Architecture", "Database Indexing", "CI/CD Deployment"],
    "resumeDescription": "Engineered a high-throughput monitoring dashboard with React and Express, processing 10k+ events/sec with sub-50ms latency.",
    "githubReadmeOutline": "## Overview\\nDetailed architecture diagram...\\n### Setup\\n\`npm install\`..."
  }
]`;

      const response = await generateWithFallback(ai, {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" },
      });

      res.json(parseJsonResponse(response.text));
    } catch (err: any) {
      console.error("Project generator error:", err);
      res.status(500).json({ error: "Failed to generate project ideas." });
    }
  });

  // Vite middleware for dev / static for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 AI Career Mentor server running on http://localhost:${PORT}`);
  });
}

startServer();
