import { z } from 'zod';

export const instagramUrlSchema = z
  .string()
  .url()
  .refine((value) => value.includes('instagram.com'), {
    message: 'URL must be an Instagram profile.'
  });

export const analyzeInputSchema = z.object({
  target_url: instagramUrlSchema,
  self_url: instagramUrlSchema.nullable().optional(),
  goal: z.enum(['conversation_starters', 'interest_overlap', 'vibe_summary']).nullable().optional(),
  manual_text: z.string().max(2000).nullable().optional()
});
