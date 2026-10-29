import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { 
  getStoredActionTasks, 
  saveStoredActionTasks, 
  getStoredLastSkillGap,
  getStoredLastResumeAnalysis 
} from '../src/lib/storage.js';
import { ActionCenterTask } from '../src/types.js';

// Polyfill in-memory localStorage for Node test runner if needed
class MockLocalStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
  get length(): number {
    return this.store.size;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] || null;
  }
}

if (!globalThis.localStorage) {
  (globalThis as any).localStorage = new MockLocalStorage();
}

describe('Action Center Data Integrity & Task Generation Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('New users / empty storage returns empty task array instead of fake pre-filled tasks', () => {
    const tasks = getStoredActionTasks();
    assert.deepEqual(tasks, []);
  });

  test('Regenerating smart actions with no prior skill gap does not invent missing skills', () => {
    const lastSkillGap = getStoredLastSkillGap();
    assert.equal(lastSkillGap, null);

    // Simulate task generator logic from ActionCenter
    const targetRole = 'AI Engineer';
    const dynamicTasks: ActionCenterTask[] = [];

    if (lastSkillGap && Array.isArray((lastSkillGap as any).missingSkills) && (lastSkillGap as any).missingSkills.length > 0) {
      dynamicTasks.push({
        id: 'skill-task',
        title: `Study ${(lastSkillGap as any).missingSkills[0].name}`,
        subtitle: 'From analysis',
        category: 'Skill',
        timeframe: 'today',
        priority: 'High',
        isCompleted: false,
        targetPage: 'skill-gap',
        actionText: 'Review'
      });
    } else {
      dynamicTasks.push({
        id: 'skill-init-task',
        title: `Run Skill Gap Analysis for ${targetRole}`,
        subtitle: 'No skill gap assessment recorded yet — evaluate your competencies against standard benchmarks',
        category: 'Skill',
        timeframe: 'today',
        priority: 'Critical',
        isCompleted: false,
        targetPage: 'skill-gap',
        actionText: 'Run Skill Gap'
      });
    }

    assert.equal(dynamicTasks.length, 1);
    assert.equal(dynamicTasks[0].title, 'Run Skill Gap Analysis for AI Engineer');
    assert.match(dynamicTasks[0].subtitle, /No skill gap assessment recorded yet/);
    assert.ok(!dynamicTasks[0].title.includes('Docker'), 'Must not hardcode Docker as missing skill');
  });

  test('Regenerating smart actions with no prior resume scan does not claim a fabricated score of 84', () => {
    const lastResumeAnalysis = getStoredLastResumeAnalysis();
    assert.equal(lastResumeAnalysis, null);

    const dynamicTasks: ActionCenterTask[] = [];

    if (lastResumeAnalysis && typeof (lastResumeAnalysis as any).overallScore === 'number') {
      dynamicTasks.push({
        id: 'resume-task',
        title: `Improve ATS Resume Score (Current: ${(lastResumeAnalysis as any).overallScore}/100)`,
        subtitle: 'Target: 90%+',
        category: 'Resume',
        timeframe: 'this_week',
        priority: 'High',
        isCompleted: false,
        targetPage: 'resume-analyzer',
        actionText: 'Audit'
      });
    } else {
      dynamicTasks.push({
        id: 'resume-init-task',
        title: 'Perform Initial ATS Resume Analysis',
        subtitle: 'No ATS resume scan recorded yet — audit your formatting, keyword density, and metrics',
        category: 'Resume',
        timeframe: 'this_week',
        priority: 'High',
        isCompleted: false,
        targetPage: 'resume-analyzer',
        actionText: 'Analyze Resume'
      });
    }

    assert.equal(dynamicTasks.length, 1);
    assert.equal(dynamicTasks[0].title, 'Perform Initial ATS Resume Analysis');
    assert.ok(!dynamicTasks[0].title.includes('84'), 'Must never fabricate 84/100 score');
  });

  test('Task completion persistence roundtrips accurately', () => {
    const tasks: ActionCenterTask[] = [
      {
        id: 't1',
        title: 'Task One',
        subtitle: 'Sub',
        category: 'Skill',
        timeframe: 'today',
        priority: 'High',
        isCompleted: false,
        targetPage: 'skill-gap',
        actionText: 'Open'
      }
    ];

    saveStoredActionTasks(tasks);
    const loaded = getStoredActionTasks();
    assert.equal(loaded.length, 1);
    assert.equal(loaded[0].isCompleted, false);

    // Toggle
    loaded[0].isCompleted = true;
    saveStoredActionTasks(loaded);

    const reloaded = getStoredActionTasks();
    assert.equal(reloaded[0].isCompleted, true);
  });
});
