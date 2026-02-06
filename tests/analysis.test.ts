import { describe, expect, it } from 'vitest';
import { buildInsightReport } from '../lib/analysis/analysis';
import type { PublicProfile } from '../lib/analysis/provider';

const mockProfile: PublicProfile = {
  captions: ['Love this cafe vibe #coffee #daily', 'Morning workout session #fitness'],
  hashtags: ['coffee', 'daily', 'fitness'],
  timestamps: ['2024-01-01T00:00:00Z', '2024-01-02T00:00:00Z']
};

describe('buildInsightReport', () => {
  it('returns deterministic insights', () => {
    const report = buildInsightReport(mockProfile);
    expect(report.topKeywords[0]).toBe('cafe');
    expect(report.topHashtags).toContain('#coffee');
    expect(report.conversationStarters).toHaveLength(20);
  });
});
