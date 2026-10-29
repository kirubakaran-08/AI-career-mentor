import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Isolated parser function matching server.ts parseJsonResponse
function parseJsonResponse(rawText: string | undefined): any {
  if (!rawText) return {};
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

describe('AI Response Parser & Schema Sanitization Suite', () => {
  test('Parses clean JSON string correctly', () => {
    const raw = '{"overallScore": 88, "summary": "Great candidate"}';
    const parsed = parseJsonResponse(raw);
    assert.equal(parsed.overallScore, 88);
    assert.equal(parsed.summary, 'Great candidate');
  });

  test('Strips markdown ```json code blocks cleanly', () => {
    const raw = '```json\n{\n  "overallScore": 92,\n  "strengths": ["Clean layout"]\n}\n```';
    const parsed = parseJsonResponse(raw);
    assert.equal(parsed.overallScore, 92);
    assert.deepEqual(parsed.strengths, ['Clean layout']);
  });

  test('Extracts json wrapped in conversational preamble and trailing notes', () => {
    const raw = 'Sure! Here is the evaluation report:\n\n{\n  "score": 85,\n  "summary": "Solid"\n}\n\nHope this helps!';
    const parsed = parseJsonResponse(raw);
    assert.equal(parsed.score, 85);
    assert.equal(parsed.summary, 'Solid');
  });

  test('Throws informative syntax error on unrecoverable truncated JSON', () => {
    const broken = '{"overallScore": 85, "strengths": [';
    assert.throws(() => parseJsonResponse(broken), SyntaxError);
  });
});
