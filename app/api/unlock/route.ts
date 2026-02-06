import { NextRequest, NextResponse } from 'next/server';
import { SupabaseStore } from '../../../lib/data/store';
import { validateUnlockToken } from '../../../lib/unlock';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const analysisId = searchParams.get('analysis_id');
  const token = searchParams.get('token');

  if (!analysisId || !token) {
    return NextResponse.json({ error: 'Missing analysis_id or token.' }, { status: 400 });
  }

  const store = new SupabaseStore();
  const validation = await validateUnlockToken(store, analysisId, token);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.reason }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
