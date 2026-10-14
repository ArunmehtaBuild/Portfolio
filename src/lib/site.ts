// Canonical site URL. On Vercel, VERCEL_PROJECT_PRODUCTION_URL is set automatically at build
// time; NEXT_PUBLIC_SITE_URL overrides it once a custom domain exists.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
