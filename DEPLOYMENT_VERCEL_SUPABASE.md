# Vercel + Supabase Deployment

## 1. Supabase

Create a Supabase project, then run the SQL in:

`supabase/schema.sql`

This creates:
- `portfolio_items`
- `gallery_items`
- public storage bucket `thepolity-media`

## 2. Vercel Environment Variables

Set these in Vercel:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=thepolity-media
ADMIN_PASSWORD="your-strong-admin-password"
ADMIN_SESSION_SECRET="a-long-random-secret"
```

## 3. Vercel Project

Import the GitHub repo into Vercel and deploy the `main` branch.

Framework preset:
- `Next.js`

Build command:
- `npm run build`

Output:
- default Vercel Next.js output

## 4. Domain

Add your Namecheap domain in Vercel, then point the DNS records from Namecheap to the values Vercel gives you.

## 5. Admin

After deployment:
- login at `/secure-admin-dashboard`
- upload portfolio items
- upload gallery images/videos

Public pages will read from the live Supabase data automatically.
