import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '../../../lib/rate-limit';
import { analyzeInputSchema } from '../../../lib/validation';
import { MockProvider, ManualInputProvider } from '../../../lib/analysis/provider';
import { SupabaseStore } from '../../../lib/data/store';
import { runAnalysis } from '../../../lib/analysis/service';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again soon.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = analyzeInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input.' }, { status: 400 });
  }

  try {
    const store = new SupabaseStore();
    const provider = parsed.data.manual_text
      ? new ManualInputProvider(parsed.data.manual_text)
      : new MockProvider();
    const result = await runAnalysis(store, provider, parsed.data);

    const response = NextResponse.json({ analysis_id: result.analysis.id });
    response.cookies.set('session_token', result.analysis.session_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/'
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Unable to generate analysis.' }, { status: 500 });
  }
}
