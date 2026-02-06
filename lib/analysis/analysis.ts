import type { PublicProfile } from './provider';

export type TopicBucket = {
  topic: string;
  count: number;
};

export type InsightReport = {
  topKeywords: string[];
  topHashtags: string[];
  topicDistribution: TopicBucket[];
  cadenceSummary: string;
  conversationStarters: string[];
  overlapScore?: number;
};

const stopWords = new Set([
  'the',
  'and',
  'for',
  'with',
  'that',
  'this',
  'from',
  'just',
  'about',
  'when',
  'your',
  'you',
  'our',
  'are',
  'was',
  'were',
  'into',
  'over',
  'after',
  'before',
  'new',
  'today',
  'weekend',
  'love'
]);

const topicMap: Record<string, string[]> = {
  fashion: ['style', 'outfit', 'fashion', 'look'],
  travel: ['travel', 'trip', 'airport', 'beach', 'hotel', 'city'],
  fitness: ['fitness', 'workout', 'run', 'gym', 'training'],
  food: ['food', 'coffee', 'cafe', 'ramen', 'dinner', 'brunch', 'recipe'],
  art: ['art', 'gallery', 'music', 'museum', 'creative'],
  daily: ['daily', 'routine', 'monday', 'tuesday', 'friday', 'weekend']
};

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s#]/g, '')
    .split(/\s+/)
    .filter((token) => token && !stopWords.has(token));
}

function frequency(tokens: string[]) {
  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

export function buildInsightReport(profile: PublicProfile, selfProfile?: PublicProfile): InsightReport {
  const captionTokens = profile.captions.flatMap((caption) => tokenize(caption));
  const topKeywords = frequency(captionTokens)
    .map(([word]) => word)
    .filter((word) => !word.startsWith('#'))
    .slice(0, 8);

  const hashTokens = profile.hashtags.map((tag) => tag.toLowerCase());
  const topHashtags = frequency(hashTokens)
    .map(([tag]) => `#${tag}`)
    .slice(0, 6);

  const topics: TopicBucket[] = Object.entries(topicMap).map(([topic, keywords]) => {
    const count = captionTokens.filter((token) => keywords.includes(token)).length;
    return { topic, count };
  });

  const sortedTopics = topics.sort((a, b) => b.count - a.count).filter((item) => item.count > 0);

  const cadenceSummary = profile.timestamps?.length
    ? `Recent activity over ${profile.timestamps.length} posts suggests a consistent cadence.`
    : 'Cadence summary unavailable (timestamps not provided).';

  const conversationStarters = Array.from({ length: 20 }).map((_, index) =>
    `Starter ${index + 1}: Ask about ${topKeywords[index % topKeywords.length] || 'recent posts'}.`
  );

  const report: InsightReport = {
    topKeywords: topKeywords.slice(0, 10),
    topHashtags,
    topicDistribution: sortedTopics.length ? sortedTopics : [{ topic: 'daily', count: 1 }],
    cadenceSummary,
    conversationStarters
  };

  if (selfProfile) {
    report.overlapScore = calculateOverlapScore(profile, selfProfile);
  }

  return report;
}

export function calculateOverlapScore(target: PublicProfile, selfProfile: PublicProfile) {
  const targetTokens = new Set(target.captions.flatMap((caption) => tokenize(caption)));
  const selfTokens = new Set(selfProfile.captions.flatMap((caption) => tokenize(caption)));
  const intersection = new Set([...targetTokens].filter((token) => selfTokens.has(token)));
  const union = new Set([...targetTokens, ...selfTokens]);
  if (union.size === 0) return 0;
  return Number((intersection.size / union.size).toFixed(2));
}

export function splitPreviewFull(report: InsightReport) {
  return {
    preview: {
      topKeywords: report.topKeywords.slice(0, 5),
      topicDistribution: report.topicDistribution.slice(0, 3),
      conversationStarters: report.conversationStarters.slice(0, 2)
    },
    full: report
  };
}
