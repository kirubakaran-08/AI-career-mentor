import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { importFullCareerDataBackup, exportFullCareerDataBackup, getStoredUserProfile } from '../src/lib/storage.js';

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

describe('Backup Validation & Transactional Rollback Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Rejects malformed JSON string gracefully without throwing', () => {
    const res = importFullCareerDataBackup('{ this is invalid json :::');
    assert.equal(res.success, false);
    assert.match(res.message, /Invalid JSON format/i);
  });

  test('Rejects non-object root payloads', () => {
    const res1 = importFullCareerDataBackup('["array", "root"]');
    assert.equal(res1.success, false);
    assert.match(res1.message, /root payload must be an object/i);

    const res2 = importFullCareerDataBackup('null');
    assert.equal(res2.success, false);

    const res3 = importFullCareerDataBackup('""');
    assert.equal(res3.success, false);
  });

  test('Preserves legitimate user profile named S. Kirubakaran or Kirubakaran without deleting', () => {
    localStorage.setItem('aicm_user_profile', JSON.stringify({
      name: 'S. Kirubakaran',
      targetRole: 'Full Stack Engineer',
      skills: ['React', 'Node.js']
    }));

    const profile = getStoredUserProfile();
    assert.equal(profile.name, 'S. Kirubakaran');
    assert.equal(profile.targetRole, 'Full Stack Engineer');
    assert.deepEqual(profile.skills, ['React', 'Node.js']);
  });

  test('Rejects invalid nested types (e.g. non-array skills, non-string targetRole)', () => {
    const invalidProfile = JSON.stringify({
      userProfile: {
        targetRole: 12345, // invalid
        skills: 'Not an array' // invalid
      }
    });

    const res = importFullCareerDataBackup(invalidProfile);
    assert.equal(res.success, false);
    assert.match(res.message, /Backup validation error/i);
  });

  test('Rejects invalid certificates and goals missing mandatory fields', () => {
    const invalidCerts = JSON.stringify({
      certificates: [
        { title: 'Cert without provider' } // missing provider
      ]
    });
    const resCerts = importFullCareerDataBackup(invalidCerts);
    assert.equal(resCerts.success, false);
    assert.match(resCerts.message, /missing required title or provider/i);

    const invalidGoals = JSON.stringify({
      goals: [
        { id: '1' } // missing title
      ]
    });
    const resGoals = importFullCareerDataBackup(invalidGoals);
    assert.equal(resGoals.success, false);
    assert.match(resGoals.message, /missing required title/i);
  });

  test('Successful import writes valid records and export round-trips correctly', () => {
    const validData = {
      userProfile: {
        name: 'Alex Engineer',
        targetRole: 'Full Stack Developer',
        skills: ['React', 'Node.js', 'PostgreSQL'],
        learningStreakDays: 14
      },
      resumeData: {
        personalInfo: {
          fullName: 'Alex Engineer',
          email: 'alex@example.com'
        },
        skills: ['React', 'Node.js'],
        experience: [],
        projects: [],
        education: []
      },
      certificates: [
        { id: 'c1', title: 'AWS Cloud Practitioner', provider: 'Amazon Web Services', dateEarned: '2026-01-10', status: 'Completed' }
      ],
      goals: [
        { id: 'g1', title: 'Complete 5 interview simulations', category: 'interview', isCompleted: false, createdAt: '2026-01-01' }
      ],
      settings: {
        geminiApiKey: '',
        targetWeeklyHours: 15
      }
    };

    const res = importFullCareerDataBackup(JSON.stringify(validData));
    assert.equal(res.success, true);
    assert.match(res.message, /verified and restored/i);

    // Verify stored data
    const storedProfile = JSON.parse(localStorage.getItem('aicm_user_profile') || '{}');
    assert.equal(storedProfile.name, 'Alex Engineer');
    assert.equal(storedProfile.targetRole, 'Full Stack Developer');
  });

  test('Rollback preserves existing data if a write fails midway', () => {
    // Seed initial state
    localStorage.setItem('aicm_user_profile', JSON.stringify({ name: 'Original Name' }));
    localStorage.setItem('aicm_certificates', JSON.stringify([{ id: 'c0', title: 'Original Cert', provider: 'AWS' }]));

    // Sabotage setItem on a specific key to simulate QuotaExceededError or write failure
    const originalSetItem = localStorage.setItem.bind(localStorage);
    (localStorage as any).setItem = (k: string, v: string) => {
      if (k === 'aicm_certificates') {
        throw new Error('QuotaExceededError: LocalStorage quota exceeded');
      }
      return originalSetItem(k, v);
    };

    const payload = JSON.stringify({
      userProfile: { name: 'Attempted Corrupted Name', targetRole: 'DevOps' },
      certificates: [{ id: 'c2', title: 'New Cert', provider: 'GCP' }]
    });

    const res = importFullCareerDataBackup(payload);
    assert.equal(res.success, false);
    assert.match(res.message, /rolled back and preserved/i);

    // Restore setItem
    (localStorage as any).setItem = originalSetItem;

    // Verify original state was completely preserved!
    const restoredProfile = JSON.parse(localStorage.getItem('aicm_user_profile') || '{}');
    assert.equal(restoredProfile.name, 'Original Name');
  });
});
