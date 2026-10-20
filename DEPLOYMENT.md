# Independent deployment

ALU KICKS can be run outside Runable using this Dockerfile on a Bun/Docker-compatible host.

## Required environment variables

Configure these in the hosting provider's private environment-variable settings. Never commit a real `.env` file or paste secrets into public issues.

- `DATABASE_URL`: Turso/libSQL database URL (required for order/newsletter routes).
- `DATABASE_AUTH_TOKEN`: Turso database token (required for a protected remote database).
- `WEBSITE_URL`: the final public site origin, e.g. `https://your-domain.example` (used by the API CORS allowlist).
- `PORT`: usually provided by the host; this image defaults to `3000`.

Generate a strong, unique secret for any authentication integration before enabling it. Do not expose server secrets in variables prefixed with `VITE_`.

## Deploy

1. Create a new Docker web service from this repository.
2. Set the build context to the repository root and use the included `Dockerfile`.
3. Add the required environment variables in the provider dashboard.
4. Deploy and check `/api/health`.
5. Attach a custom domain if desired; use HTTPS.

## Security status and limitations

The app adds baseline security response headers, safer static-file path handling, a restricted API CORS allowlist, and bounds on checkout input sizes. Keep dependencies updated and review host logs.

**This is not a payment-ready storefront yet.** Checkout currently records an order but does not charge a card; integrate a real payment provider and verify webhooks before accepting money. Add rate limiting/bot protection and a privacy/retention policy before public production use. Never store payment card details yourself.
