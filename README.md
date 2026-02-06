# gethintcrush

Public-content insights for better conversation starters.

## Local setup

```bash
npm install
cp .env.example .env.local
```

Update `.env.local` with Supabase + Gumroad values.

## Supabase migrations

```bash
supabase migration up
```

Or apply `supabase/migrations/0001_create_tables.sql` manually in the Supabase SQL editor.

## Run the dev server

```bash
npm run dev
```

## Tests

```bash
npm test
```

## Deploy to Vercel (gethintcrush)

1. Push this repo to GitHub as `gethintcrush`.
2. In Vercel, import the GitHub repo.
3. Set environment variables from `.env.example` in the Vercel dashboard.
4. Deploy. The default build command is `npm run build`.

## Gumroad configuration

- Create a Gumroad product for the report unlock.
- Set `NEXT_PUBLIC_GUMROAD_PRODUCT_URL_SINGLE` to the checkout URL.
- Set `GUMROAD_PRODUCT_ID_SINGLE` or `GUMROAD_PRODUCT_ID_BUNDLE`.
- Configure the webhook to `https://gethintcrush.com/api/webhooks/gumroad`.
- Add `analysis_id` as a custom field in Gumroad (used to unlock the report).

## Troubleshooting

- **Supabase errors**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- **Webhook not unlocking**: Confirm the Gumroad product ID allowlist and `analysis_id` custom field.
- **PDF download fails**: Ensure the report is unlocked and the token query param is present.
