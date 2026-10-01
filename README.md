# THE POLITY Services Website

A stunning, modern website replica for THE POLITY Services with beautiful Framer Motion animations, portfolio management, gallery system, and a **secure password-protected admin dashboard**. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

### 🎬 **Stunning UI with Framer Motion**
- Smooth page transitions and animations
- Animated hero sections with blob effects
- Hover animations on all interactive elements
- Staggered animations for lists and grids
- Mobile-responsive animations

### 📱 **Complete Website Replica**
- Responsive design matching thepolityservices.com
- Professional hero sections with gradient text
- Service showcases with animations
- Client testimonials and statistics
- Newsletter signup with validation
- Contact form with real-time feedback

### 🔐 **Secure Password-Protected Admin Dashboard**
- **URL:** `/secure-admin-dashboard`
- **Login Page:** Password authentication
- **Token-Based Sessions:** Secure session management
- **Admin-Only Access:** Only authorized users can access
- **No public links:** Admin is completely hidden from navigation

### 📱 **Full Portfolio Management**
- Upload portfolio items with images
- Categorize projects (Project, Case Study, Campaign, Branding, Design)
- Filter portfolio by category
- Beautiful admin interface with animations
- Easy add/delete functionality

### 🎥 **Gallery Management**
- Upload images and videos
- Filter gallery by media type
- Professional gallery display
- Real-time upload feedback
- Drag-and-drop file management

### 🎨 **Modern Design**
- Light, airy interface on white
- Glassmorphism effects
- Gradient backgrounds
- Brand palette: orange `#FF6B35` and navy `#001F3F`
- Smooth transitions
- Professional typography

## Project Structure

```
thepolity/
├── src/
│   ├── app/
│   │   ├── page.tsx                          # Home page
│   │   ├── services/page.tsx                 # Services page
│   │   ├── portfolio/page.tsx                # Portfolio page
│   │   ├── gallery/page.tsx                  # Gallery page
│   │   ├── about/page.tsx                    # About page
│   │   ├── contact/page.tsx                  # Contact page
│   │   ├── admin/page.tsx                    # OLD - DEPRECATED
│   │   ├── secure-admin-dashboard/
│   │   │   ├── page.tsx                      # Login page
│   │   │   └── dashboard/page.tsx            # Protected dashboard
│   │   ├── api/
│   │   │   ├── upload/route.ts               # File upload API
│   │   │   ├── portfolio/route.ts            # Portfolio API
│   │   │   ├── gallery/route.ts              # Gallery API
│   │   │   └── auth/verify/route.ts          # Auth verification
│   │   └── layout.tsx                        # Root layout
│   ├── components/
│   │   ├── Header.tsx                        # Navigation with animations
│   │   ├── Footer.tsx                        # Footer with animations
│   │   └── HeroSection.tsx                   # Animated hero component
│   └── lib/
│       ├── storage.ts                        # Data storage utilities
│       ├── animations.ts                     # Animation variants
│       └── auth.ts                           # Password authentication
├── public/
│   └── uploads/                              # Uploaded files directory
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
└── next.config.ts
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern browser with JavaScript enabled

### Installation

1. Navigate to the project directory:
```bash
cd thepolity
```

2. Install dependencies (if not already done):
```bash
npm install
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
2. **Password:** the value of `ADMIN_PASSWORD` in your `.env.local`. There is
   **no default password** — if the variable is unset the login endpoint
   returns `503` and rejects every password, so the dashboard stays locked
   rather than falling back to a known credential.
3. **Session Duration:** 8 hours by default (`ADMIN_SESSION_TTL_HOURS`), held in
   an `httpOnly` cookie — not in `localStorage`, so page scripts cannot read it.

### Security Features

- ✅ Password-protected login
- ✅ Session tokens for authenticated access
- ✅ Secure password hashing (SHA-256)
- ✅ No admin link in public navigation
- ✅ HttpOnly cookies for sensitive operations
- ✅ Logout functionality to clear sessions

### Changing the Admin Password

Edit `.env.local`:
```env
ADMIN_PASSWORD=YourNewSecurePassword123!@#
```

**For Production:**
- Use a strong, unique password
- Store in secure environment variables
- Use encrypted credential storage
- Implement 2FA for additional security

### Using the Admin Dashboard

**Portfolio Manager Tab:**
1. Fill in portfolio item details
2. Upload an image
3. Select category
4. Click "Add Portfolio Item"
5. Manage items from the list below

**Gallery Manager Tab:**
1. Enter gallery item title
2. Select media type (Image/Video)
3. Upload file
4. Click "Add Gallery Item"
5. View and manage from grid below

## 🎨 Customization

### Colors
- Primary Orange: `#FF6B35`
- Navy: `#001F3F`
- Background: white (`#ffffff`)
- Foreground: near-black (`#0a0a0a`)

Edit component files or the CSS variables in `src/app/globals.css` to change colors.

### Animations
- Animation variants in `src/lib/animations.ts`
- Tailwind animations in `src/app/globals.css`
- Component-specific animations in individual files

### Content
- Home page: `src/app/page.tsx`
- Services: `src/app/services/page.tsx`
- About: `src/app/about/page.tsx`
- Contact: `src/app/contact/page.tsx`

## Building for Production

```bash
npm run build
npm run start
```

## Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
ADMIN_PASSWORD=YourStrongPassword123!@#
```

For production:
- Use strong, unique passwords
- Enable HTTPS only
- Set secure cookie flags
- Use environment-specific configs
- Implement rate limiting
- Add IP whitelisting for admin

## 📦 Dependencies

- **Next.js 15+** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React** - UI components

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Image optimization with Next.js
- Code splitting and lazy loading
- CSS minification
- Optimized animations
- Responsive images
- Static pre-rendering

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- Netlify
- AWS Amplify
- Azure App Service
- DigitalOcean
- Heroku
- Railway
- Render

## Security Best Practices

- ✅ Password hashing (SHA-256, upgrade to bcrypt for production)
- ✅ Secure session management
- ✅ No sensitive data in URLs
- ✅ HTTPS for production
- ✅ Environment variables for secrets
- ✅ Input validation
- ✅ CORS protection
- ✅ Rate limiting (recommended)

### Production Security Checklist

- [ ] Change admin password
- [ ] Enable HTTPS
- [ ] Set secure environment variables
- [ ] Enable rate limiting
- [ ] Implement logging
- [ ] Set up monitoring
- [ ] Regular backups
- [ ] Security headers (CSP, X-Frame-Options)
- [ ] WAF configuration
- [ ] 2FA for admin (recommended)

## API Endpoints

### Upload
```
POST /api/upload
Parameters: file, type ('portfolio' or 'gallery')
Response: { url, filename }
```

### Portfolio
```
GET /api/portfolio        # Get all items
POST /api/portfolio       # Create item
DELETE /api/portfolio?id= # Delete item
```

### Gallery
```
GET /api/gallery          # Get all items
POST /api/gallery         # Create item
DELETE /api/gallery?id=   # Delete item
```

### Authentication
```
POST /api/auth/verify
Body: { password }
Response: { success, token }
```

## Data Storage

- **Portfolio:** `public/data/portfolio.json`
- **Gallery:** `public/data/gallery.json`
- **Files:** `public/uploads/{type}/{filename}`

For production, consider:
- Firebase/Firestore
- MongoDB
- AWS S3
- Supabase
- PostgreSQL

## Troubleshooting

### Port 3000 in use
```bash
npm run dev -- -p 3001
```

### Admin login fails
- Check `.env.local` has correct password
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

### Files not uploading
- Verify `public/uploads/` exists
- Check file permissions
- Review browser console errors
- Check server logs

### Animations not working
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Verify Framer Motion is installed

## Performance Optimization

- Lazy load images: Use Next.js Image component
- Code splitting: Automatic with Next.js
- CSS in JS: Tailwind handles this
- Minification: Built into Next.js build
- Compression: Enable gzip on server
- Caching: Configure cache headers

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Advanced authentication (OAuth, 2FA)
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] SEO optimization
- [ ] Dark/light mode toggle
- [ ] Multi-language support
- [ ] Content scheduling
- [ ] Image optimization / CDN
- [ ] E-commerce integration

## Support

For issues or questions:
- Check [Next.js Docs](https://nextjs.org/docs)
- See [Tailwind Docs](https://tailwindcss.com)
- Review [Framer Motion Docs](https://www.framer.com/motion)
- Check [TypeScript Docs](https://www.typescriptlang.org)

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
| Admin Login | http://localhost:3000/secure-admin-dashboard |
| Admin Dashboard | http://localhost:3000/secure-admin-dashboard/dashboard |

## Default Credentials

There are no default credentials. Admin access is driven entirely by
`ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in `.env.local` (see
`.env.example`). If either is missing the admin login returns `503` and
rejects every password, so an unconfigured deploy is locked rather than
falling back to a guessable secret.
