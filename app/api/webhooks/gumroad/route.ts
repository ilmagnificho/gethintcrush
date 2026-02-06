import { NextRequest, NextResponse } from 'next/server';
import { SupabaseStore } from '../../../../lib/data/store';
import { handleGumroadWebhook } from '../../../../lib/gumroad/webhook';
import { isAllowedProduct, verifyWebhookSignature } from '../../../../lib/gumroad/validation';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-gumroad-signature');
  const secret = process.env.GUMROAD_WEBHOOK_SECRET;
  if (!verifyWebhookSignature(signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  const formData = await request.formData();
  const saleId = String(formData.get('sale_id') ?? '');
  const productId = String(formData.get('product_id') ?? '');
  const analysisId =
    (formData.get('analysis_id') as string | null) ??
    (formData.get('custom_fields[analysis_id]') as string | null);

  if (!isAllowedProduct(productId)) {
    return NextResponse.json({ error: 'Invalid product.' }, { status: 400 });
  }

  try {
    const store = new SupabaseStore();
    const result = await handleGumroadWebhook(store, {
      sale_id: saleId,
      product_id: productId,
      email: (formData.get('email') as string | null) ?? undefined,
      price: formData.get('price') ? Number(formData.get('price')) : undefined,
      currency: (formData.get('currency') as string | null) ?? undefined,
      custom_fields: analysisId ? { analysis_id: analysisId } : undefined
    });

    return NextResponse.json({
      ok: true,
      analysis_id: result.analysisId,
      token: result.token,
      already_processed: result.alreadyProcessed
    });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 400 });
  }
}
