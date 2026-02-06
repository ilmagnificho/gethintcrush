export function isAllowedProduct(productId: string) {
  const allowlist = [
    process.env.GUMROAD_PRODUCT_ID_SINGLE,
    process.env.GUMROAD_PRODUCT_ID_BUNDLE
  ].filter(Boolean);

  if (allowlist.length === 0) {
    return true;
  }

  return allowlist.includes(productId);
}

export function verifyWebhookSignature(signature: string | null, secret?: string) {
  if (!secret) return true;
  if (!signature) return false;
  return signature === secret;
}
