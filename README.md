# THE POLITY Services Website

A modern marketing website for THE POLITY Services with Framer Motion animations, portfolio/gallery/blog management, and a **secured password-protected admin dashboard**. Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## ✨ Features

### 🎬 **Stunning UI with Framer Motion**
- Smooth page transitions and animations
- Animated hero sections with slideshows and blob effects
- Hover animations on all interactive elements
- Staggered animations for lists and grids
- Mobile-responsive animations

### 📱 **Complete Marketing Website**
- Home, About, Services, Portfolio, Gallery, Blog, Work, Team, Reviews, FAQs, Contact
- Service pages (IT Consultancy, Project Management, Media) with nested media sub-services and slideshows
- Newsletter signup, contact form
- Legal pages (Terms, Privacy Policy)

### 🔐 **Secure Admin Dashboard**
- **URL:** `/secure-admin-dashboard` (old `/admin` and `/admin-login` routes redirect here)
- Password authentication (`ADMIN_PASSWORD` env var — no default password)
- HMAC-signed session tokens in httpOnly, sameSite-strict cookies (7-day expiry)
- Every mutating API route validates the session cookie
- Completely hidden from public navigation

### 📋 **Full Content Management**
The admin dashboard manages all content types:
- **Portfolio items** (Project, Case Study, Campaign, Branding, Design)
- **Gallery items** (images and videos)
- **Blog posts**
- **Work projects**
- **Team members**
- **Customer reviews**
- **Homepage hero / slideshow images**

### 💾 **Hybrid Data Layer**
- **Supabase-first:** Postgres tables + `thepolity-media` storage bucket when `SUPABASE_SERVICE_ROLE_KEY` is configured
- **Local JSON fallback:** reads/writes `public/data/*.json` when Supabase is not configured (local dev without a backend)

### 🎨 **Modern Design**
- Dark theme (#0a0a0a) with orange accent (#FF6B35) and navy (#001F3F)
- Glassmorphism effects
- Tailwind CSS v4 (CSS-first configuration)

## Project Structure

```
thepolity/
├── src/
│   ├── app/                            # App Router pages + API routes
│   │   ├── layout.tsx                  # Root layout (fonts, dark theme)
│   │   ├── globals.css                 # Tailwind v4 + design tokens
│   │   ├── (site)/                     # Route group — marketing pages.
│   │   │   │                           # Gets shared <Header /> + <Footer />
│   │   │   │                           # from (site)/layout.tsx; pages keep
│   │   │   │                           # their own <main> so the home page's
│   │   │   │                           # full-bleed hero stays intact.
│   │   │   ├── page.tsx                # Home page
│   │   │   ├── about/  blog/  contact/  faqs/
│   │   │   ├── gallery/  portfolio/  reviews/  team/
│   │   │   ├── work/  terms/  privacy-policy/
│   │   │   └── services/               # Services landing
│   │   │       ├── [slug]/             # Dynamic service detail
│   │   │       ├── it-consultancy/  project-management/
│   │   │       └── media/              # Photography, Events, Photo-Tourism,
│   │   │                               # Portraits, Visuals
│   │   ├── services/media/<sub>/slideshow/   # Standalone fullscreen slideshows
│   │   │                               # (no header/footer by design)
│   │   ├── secure-admin-dashboard/     # Login + protected dashboard
│   │   ├── saas-template/  saas-components/   # Bundled SaaS demo pages
│   │   │                               # (outside the header/footer layout)
│   │   └── api/
│   │       ├── auth/verify|session|logout
│   │       ├── health                  # Admin-only storage diagnostics
│   │       ├── upload
│   │       ├── portfolio  gallery  blog  work  team  reviews
│   │       └── homepage-images  newsletter
│   ├── components/
│   │   ├── Header.tsx  Footer.tsx  HeroSection.tsx  Slideshow.tsx
│   │   └── SaaS/                       # SaaS template components
│   └── lib/
│       ├── auth.ts                     # Password + session auth
│       ├── db/                         # Data layer (Supabase-first)
│       │   ├── config.ts               # Env validation + Supabase client
│       │   ├── types.ts                # Shared entity types
│       │   ├── portfolio.ts  gallery.ts  blog.ts  work.ts  team.ts
│       │   ├── reviews.ts  homepage.ts  uploads.ts
│       │   └── index.ts                # Barrel export
│       ├── storage.ts                  # = export * from './db' (back-compat)
│       └── animations.ts               # Framer Motion variants
├── public/
│   ├── data/                           # JSON fallback store (blog, portfolio, ...)
│   └── uploads/                        # User-uploaded files
├── supabase/
│   └── schema.sql                      # Tables + RLS + storage bucket
├── .env.example
└── next.config.ts                      # Includes legacy /admin redirects
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern browser with JavaScript enabled

### Installation

1. Clone the repository and install dependencies:
```bash
git clone git@github.com:Intravent-Technologies/thepolity.git
cd thepolity
npm install
```

2. Create `.env.local` (see [Environment Variables](#environment-variables) below):
```bash
cp .env.example .env.local
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser:
```
http://localhost:3000
```

## 🔐 Admin Dashboard

### Accessing the Admin Dashboard

1. **URL:** `http://localhost:3000/secure-admin-dashboard`
2. **Password:** set via the `ADMIN_PASSWORD` environment variable (there is no default password)
3. **Session Duration:** 7 days (httpOnly cookie)

### Security Features

- ✅ Password-protected login (SHA-256 verified against `ADMIN_PASSWORD`)
- ✅ HMAC-SHA256 session tokens in httpOnly, sameSite-strict cookies
- ✅ Every mutating API route independently validates the session cookie
- ✅ No admin link in public navigation
- ✅ No hardcoded secrets — all credentials come from environment variables
- ✅ Logout clears the session cookie

### Changing the Admin Password

Edit `.env.local`:
```env
ADMIN_PASSWORD=YourNewSecurePassword123!@#
```

## 🎨 Customization

### Colors
- Primary Orange: `#FF6B35`
- Dark Background: `#0a0a0a`
- Navy: `#001F3F`

Design tokens live in `src/app/globals.css` (Tailwind v4 CSS-first config — there is no `tailwind.config.js`).

### Animations
- Animation variants in `src/lib/animations.ts`
- Tailwind animations in `src/app/globals.css`
- Component-specific animations in individual files

## Building for Production

```bash
npm run build
npm run start
```

## Environment Variables

Create `.env.local` from `.env.example`:

```env
# REQUIRED — the app throws at startup if either is missing
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=a-long-random-secret-string

# Supabase (REQUIRED for production writes/uploads)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=thepolity-media

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:**
- No default values exist — `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are mandatory, and `auth.ts` will throw at startup if they are unset.
- These must be configured in the **Production, Preview, and Development** environments of Vercel.
- `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` will be used wherever the Next.js API runs (any environment).

## 📦 Dependencies

- **Next.js 16** (App Router) — React framework
- **React 19** — UI
- **TypeScript** — type safety
- **Tailwind CSS 4** — styling
- **Framer Motion 12** — animations
- **lucide-react** — icons
- **Supabase** — Postgres + file storage

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/auth/session` | — | Check admin session |
| POST | `/api/auth/verify` | — | Verify password, set session cookie |
| POST | `/api/auth/logout` | — | Clear session cookie |
| GET | `/api/portfolio` | — | List portfolio items |
| POST | `/api/portfolio` | ✅ | Add portfolio item |
| DELETE | `/api/portfolio?id=` | ✅ | Delete portfolio item |
| GET | `/api/gallery` | — | List gallery items |
| POST | `/api/gallery` | ✅ | Add gallery item |
| DELETE | `/api/gallery?id=` | ✅ | Delete gallery item |
| GET | `/api/blog` | — | List blog posts |
| POST | `/api/blog` | ✅ | Add blog post |
| DELETE | `/api/blog?id=` | ✅ | Delete blog post |
| GET | `/api/work` | — | List work projects |
| POST | `/api/work` | ✅ | Add work project |
| DELETE | `/api/work?id=` | ✅ | Delete work project |
| GET | `/api/team` | — | List team members |
| POST | `/api/team` | ✅ | Add team member |
| DELETE | `/api/team?id=` | ✅ | Delete team member |
| GET | `/api/reviews` | — | List reviews |
| POST | `/api/reviews` | ✅ | Add review |
| DELETE | `/api/reviews?id=` | ✅ | Delete review |
| GET | `/api/homepage-images` | — | List homepage/slideshow images |
| POST | `/api/homepage-images` | ✅ | Save homepage image |
| DELETE | `/api/homepage-images?id=` | ✅ | Delete homepage image |
| POST | `/api/upload` | ✅ | Upload file (portfolio/gallery/homepage) |
| POST | `/api/newsletter` | — | Newsletter signup |
| GET | `/api/health` | ✅ | Storage/auth diagnostics (points at misconfigured Supabase) |

Auth column ✅ = requires valid admin session cookie.

## Data Storage

- **Supabase (when configured):** tables per content type (`portfolio_items`, `gallery_items`, `blog_posts`, `work_projects`, `team_members`, `reviews`, `homepage_images`), public read RLS, storage bucket `thepolity-media`. Schema in `supabase/schema.sql`.
- **Local JSON fallback:** `public/data/*.json` on the server filesystem.

> Note: the JSON fallback uses the server filesystem and will **not** work in serverless deployments (Vercel). Supabase is required there. Uploads via `public/uploads/` are git-ignored.

## Deployment (Vercel + Supabase)

1. Configure the environment variables above in Vercel (Production, Preview, Development).
2. In Supabase, run `supabase/schema.sql` to create tables, RLS policies, and the `thepolity-media` bucket.
3. Deploy normally to Vercel (`main` branch auto-deploys).

## Troubleshooting

### Port 3000 in use
```bash
npm run dev -- -p 3001
```

### Admin login fails
- Verify `ADMIN_PASSWORD` matches what's in `.env.local` / Vercel env vars
- Restart the dev server after changing `.env.local`
- Check browser console and server logs

### Files not uploading
- Verify Supabase env vars are set (uploads require Supabase in production)
- Check that the storage bucket exists (`thepolity-media`)
- Run the diagnostics: log into the admin dashboard, then open
  `https://<your-site>/api/health` to see exactly which check fails
- Review browser console and server logs

### Animations not working
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`

## Future Enhancements

- [ ] Stricter auth (brute-force rate limiting, 2FA)
- [ ] Email/notifications for newsletter subscribers
- [ ] Analytics dashboard
- [ ] Full SEO/OG metadata per page
- [ ] Dark/light mode toggle
- [ ] Multi-language support
- [ ] Content scheduling

## Support

For issues or questions:
- See [Next.js Docs](https://nextjs.org/docs)
- See [Tailwind Docs](https://tailwindcss.com)
- See [Framer Motion Docs](https://www.framer.com/motion)
- See [Supabase Docs](https://supabase.com/docs)
- See [TypeScript Docs](https://www.typescriptlang.org)

## License

Available for use and modification for THE POLITY Services.

---

## Quick Links

| Link | URL |
|------|-----|
| Home | http://localhost:3000 |
| Services | http://localhost:3000/services |
| Portfolio | http://localhost:3000/portfolio |
| Gallery | http://localhost:3000/gallery |
| Blog | http://localhost:3000/blog |
| Admin Login | http://localhost:3000/secure-admin-dashboard |
| Admin Dashboard | http://localhost:3000/secure-admin-dashboard/dashboard |