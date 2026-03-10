# BBR Dashboard - Next.js Rebuild

## Phase 1: Scaffold & Config
- [x] Initialize Next.js with TypeScript, Tailwind, App Router
- [x] Install dependencies (next-auth, xlsx)
- [x] Configure Tailwind with custom colors
- [x] Set up fonts and global CSS
- [x] Create .env.local template

## Phase 2: Auth
- [x] Configure NextAuth with Google provider
- [x] Domain restriction + admin flag
- [x] Middleware for route protection

## Phase 3: Core Libraries
- [x] TypeScript types (lib/types.ts)
- [x] Data read/write helpers (lib/data.ts)
- [x] Excel parser port (lib/parse-excel.ts)

## Phase 4: API Routes
- [x] POST /api/upload
- [x] GET /api/data
- [x] NextAuth route handler

## Phase 5: Login Page
- [x] Glassmorphism login card
- [x] Google sign-in button

## Phase 6: Dashboard + Components
- [x] Root layout
- [x] Navbar
- [x] Team cards + standings grid
- [x] POTD hero section
- [x] POTD history table
- [x] No-data state
- [x] Footer

## Phase 7: Admin Page
- [x] Upload form with drag-and-drop
- [x] Loading/success/error states

## Phase 8: Verify
- [x] App builds without errors (`npm run build` passes)
- [x] Dev server starts, login page returns 200
- [ ] Full flow with real Google credentials (requires .env.local setup)

## Review
- Build: PASS (Next.js 16.1.6 Turbopack)
- All routes compile: /, /login, /admin, /api/auth, /api/data, /api/upload
- Note: middleware.ts has deprecation warning for Next.js 16 (middleware → proxy)
