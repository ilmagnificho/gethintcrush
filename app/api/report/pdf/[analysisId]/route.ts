import { NextRequest } from 'next/server';
import { renderToStream, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { SupabaseStore } from '../../../../../lib/data/store';
import { validateUnlockToken } from '../../../../../lib/unlock';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12, fontFamily: 'Helvetica' },
  heading: { fontSize: 18, marginBottom: 12 },
  section: { marginBottom: 12 },
  label: { fontSize: 12, marginBottom: 4 }
});

export async function GET(
  request: NextRequest,
  { params }: { params: { analysisId: string } }
) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') ?? '';
  const store = new SupabaseStore();
  const analysis = await store.getAnalysis(params.analysisId);

  if (!analysis || analysis.status !== 'unlocked') {
    return new Response('Report not unlocked.', { status: 403 });
  }

  const tokenCheck = await validateUnlockToken(store, params.analysisId, token);
  if (!tokenCheck.valid) {
    return new Response('Invalid token.', { status: 403 });
  }

  const result = await store.getAnalysisResult(params.analysisId);
  if (!result) {
    return new Response('Report not found.', { status: 404 });
  }

  const full = result.full_json as {
    topKeywords: string[];
    topHashtags: string[];
    topicDistribution: { topic: string; count: number }[];
    cadenceSummary: string;
    conversationStarters: string[];
  };

  const stream = await renderToStream(
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>gethintcrush — Full Report</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Key insights</Text>
          <Text>Top keywords: {full.topKeywords.join(', ')}</Text>
          <Text>Top hashtags: {full.topHashtags.join(', ')}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Topic distribution</Text>
          {full.topicDistribution.map((topic) => (
            <Text key={topic.topic}>
              {topic.topic}: {topic.count}
            </Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Cadence summary</Text>
          <Text>{full.cadenceSummary}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Conversation starters</Text>
          {full.conversationStarters.map((starter) => (
            <Text key={starter}>{starter}</Text>
          ))}
        </View>
        <View>
          <Text>Public-content insights only. For conversation planning, not personal diagnosis.</Text>
        </View>
      </Page>
    </Document>
  );

  return new Response(stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="gethintcrush-report.pdf"'
    }
  });
}
