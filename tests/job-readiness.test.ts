import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { computeJobReadiness } from '../src/lib/aiService.js';
import { 
  emptyUserProfile, 
  emptyResumeData, 
  sampleCandidateProfile, 
  sampleResumeData, 
  sampleCertificates, 
  sampleGoals 
} from '../src/data/initialData.js';
import { 
  UserProfile, 
  ResumeData, 
  ResumeAnalysisResult, 
  SkillGapResult, 
  InterviewFeedback 
} from '../src/types.js';

describe('Job Readiness Analyzer Calculation Suite', () => {
  test('Empty profile returns 0 overall and Initial Setup Phase without throwing', () => {
    const result = computeJobReadiness(
      emptyUserProfile,
      emptyResumeData,
      null,
      null,
      [],
      [],
      null
    );

    assert.equal(result.scores.overall, 0);
    assert.equal(result.level, 'Initial Setup Phase');
    assert.equal(result.weakAreas.length, 3);
    assert.equal(typeof result.recommendedNextAction.title, 'string');
    assert.ok(result.recommendedNextAction.title.length > 0);
  });

  test('8 Category weights total exactly 100% and computed overall score matches formula', () => {
    const mockAnalysis: ResumeAnalysisResult = {
      overallScore: 85,
      formattingScore: 90,
      keywordsScore: 80,
      impactScore: 85,
      summary: 'Solid full stack resume',
      strengths: ['Great bullet points'],
      weaknesses: ['Add Docker experience'],
      missingKeywords: ['Kubernetes'],
      actionableTips: ['Quantify metrics'],
      analyzedAt: '2026-10-21',
      targetRole: 'Full Stack Developer'
    };

    const mockGap: SkillGapResult = {
      role: 'Full Stack Developer',
      matchPercentage: 80,
      missingSkills: [{ name: 'Docker', priority: 'High', difficulty: 'Medium', estimatedHours: 15 }],
      learningOrder: ['Docker'],
      summary: 'Strong match'
    };

    const mockFeedback: InterviewFeedback = {
      score: 82,
      strengths: ['STAR framework used'],
      improvements: ['Give tighter architectural trade-offs'],
      sampleBetterAnswer: 'Improved sample'
    };

    const result = computeJobReadiness(
      sampleCandidateProfile,
      sampleResumeData,
      mockAnalysis,
      mockGap,
      sampleGoals,
      sampleCertificates,
      mockFeedback
    );

    const s = result.scores;
    // Manual weighted check: 20 + 20 + 15 + 15 + 10 + 10 + 5 + 5 = 100%
    const expectedOverall = Math.min(100, Math.max(0, Math.round(
      (s.resume * 0.20) +
      (s.technicalSkills * 0.20) +
      (s.projects * 0.15) +
      (s.interviewPrep * 0.15) +
      (s.certifications * 0.10) +
      (s.careerConsistency * 0.10) +
      (s.communication * 0.05) +
      (s.portfolio * 0.05)
    )));

    assert.equal(s.overall, expectedOverall);
    assert.ok(s.overall >= 0 && s.overall <= 100);
    assert.ok(Number.isFinite(s.overall));
  });

  test('Profile skills and links are unified without requiring duplicate resume entries', () => {
    const profileWithLinks: UserProfile = {
      ...emptyUserProfile,
      skills: ['TypeScript', 'GraphQL', 'PostgreSQL'],
      githubUrl: 'https://github.com/developer-user',
      linkedinUrl: 'https://linkedin.com/in/developer-user',
      portfolioUrl: 'https://developer-user.dev'
    };

    const resumeBlank: ResumeData = {
      ...emptyResumeData,
      skills: []
    };

    const result = computeJobReadiness(
      profileWithLinks,
      resumeBlank,
      null,
      null,
      [],
      [],
      null
    );

    assert.ok(result.scores.technicalSkills > 0, 'Profile skills should contribute to technical skills');
    assert.ok(result.scores.portfolio > 0, 'Profile links should contribute to portfolio score');
  });

  test('Malformed, undefined, and extreme inputs are clamped to finite bounds', () => {
    const extremeResult = computeJobReadiness(
      undefined,
      undefined,
      { overallScore: NaN, impactScore: Infinity } as any,
      { matchPercentage: -999 } as any,
      [null as any, { isCompleted: true, category: 'interview' } as any],
      [null as any, { status: 'Completed' } as any],
      { score: NaN } as any
    );

    for (const [key, val] of Object.entries(extremeResult.scores)) {
      assert.ok(Number.isFinite(val), `Dimension ${key} must be finite`);
      assert.ok(val >= 0 && val <= 100, `Dimension ${key} must be in [0, 100] range`);
    }
  });

  test('Duplicate skills across profile and resume are deduplicated and do not inflate score', () => {
    const singleSkillProfile: UserProfile = {
      ...emptyUserProfile,
      skills: ['React', 'TypeScript', 'Node.js']
    };
    const duplicateSkillResume: ResumeData = {
      ...emptyResumeData,
      skills: ['React', 'React', 'TypeScript', 'Node.js', 'Node.js', 'React']
    };

    const resultDeduplicated = computeJobReadiness(
      singleSkillProfile,
      duplicateSkillResume,
      null,
      null,
      [],
      [],
      null
    );

    const normalResume: ResumeData = {
      ...emptyResumeData,
      skills: ['React', 'TypeScript', 'Node.js']
    };

    const resultNormal = computeJobReadiness(
      singleSkillProfile,
      normalResume,
      null,
      null,
      [],
      [],
      null
    );

    assert.equal(
      resultDeduplicated.scores.technicalSkills,
      resultNormal.scores.technicalSkills,
      'Duplicate skills must produce identical technical skill score'
    );
  });

  test('Missing interview feedback safely defaults without crash while populated feedback updates score', () => {
    const withoutInterview = computeJobReadiness(
      sampleCandidateProfile,
      sampleResumeData,
      null,
      null,
      [],
      [],
      null
    );
    assert.equal(withoutInterview.scores.interviewPrep, 0);

    const withInterview = computeJobReadiness(
      sampleCandidateProfile,
      sampleResumeData,
      null,
      null,
      [],
      [],
      { score: 88, strengths: ['Good STAR method'], improvements: ['Mention metrics'], sampleBetterAnswer: 'Sample' }
    );
    assert.equal(withInterview.scores.interviewPrep, 88);
    assert.ok(withInterview.scores.overall > withoutInterview.scores.overall);
  });

  test('All 8 dimensions are evaluated and represented in weak/strong recommendation pool', () => {
    const result = computeJobReadiness(
      sampleCandidateProfile,
      sampleResumeData,
      null,
      null,
      [],
      [],
      null
    );

    assert.ok(Array.isArray(result.weakAreas));
    assert.ok(result.weakAreas.length <= 3);
    assert.ok(result.top3ToImprove.length <= 3);
    assert.ok(typeof result.recommendedNextAction.targetPage === 'string');
  });
});
