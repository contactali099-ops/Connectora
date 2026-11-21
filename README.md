# Connectora — International 18+ Connections, Friendship & Relationship Platform

Connectora is a responsive, privacy-first web application built with **React**, **TypeScript**, and **Tailwind CSS**, architected for **Supabase** (Authentication, PostgreSQL with Row-Level Security, and restricted Storage) and deployable via **GitHub** and **Hostinger**.

> **18+ Exclusively:** Connectora is strictly for adults aged 18 and above. Under-18 registration is blocked at both the UI validation layer and the PostgreSQL `CHECK` constraint layer.
>
> **Launch Market:** Primary launch in the **United States (USD)** with built-in international support for **Canada** and the **United Kingdom**.

---

## Project Structure

```text
├── .env.example              # Safe public environment variable template
├── .gitignore                # Excludes node_modules, dist, logs, and .env* secrets
├── index.html                # HTML entry point with typography & SEO metadata
├── metadata.json             # Application metadata
├── package.json              # Scripts and dependencies
├── README.md                 # Setup, Supabase, GitHub & Hostinger deployment guide
├── supabase/
│   └── schema.sql            # Full PostgreSQL schema, triggers, RLS & storage policies
└── src/
    ├── assets/images/        # High-resolution editorial & sample profile images
    ├── components/           # Reusable UI components (Header, Footer, Logo, SafeImage, Modals)
    ├── data/                 # Country metadata and clearly labeled sample/demo profiles
    ├── lib/                  # Supabase-ready configuration & client adapter
    ├── pages/                # Home, Discover, Auth, Profile, Matches, Messages, Safety, Membership, About/FAQ, Legal
    ├── services/             # Application state & API service layer
    ├── types/                # Domain TypeScript interfaces
    ├── utils/                # 18+ age verification & privacy helpers
    ├── App.tsx               # Client-side router & shell
    ├── index.css             # Tailwind v4 design tokens & reduced-motion support
    └── main.tsx              # Application mount
```

---

## Local Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables (optional for Demo Preview, required for live backend)**
   Copy `.env.example` to `.env.local` and fill in your public Supabase values:
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-public-supabase-anon-key"
   ```
   > Never place `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` or any `VITE_*` variable.

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Type-check & build for production**
   ```bash
   npm run lint
   npm run build
   ```

---

## Supabase Integration Steps

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in the Supabase Dashboard and run `supabase/schema.sql`. This creates:
   - `profiles` with a strict `date_of_birth <= CURRENT_DATE - INTERVAL '18 years'` check constraint.
   - `public_profiles` view that hides `date_of_birth`, phone numbers, and private flags.
   - `likes`, `matches`, and `conversations` with an automatic mutual-like trigger.
   - `messages` with Row-Level Security restricted to mutually matched, non-blocked users plus a 12 messages/minute anti-spam trigger.
   - `reports` and `moderation_actions` restricted strictly to `moderator` / `admin` roles.
   - Restricted `profile-photos` storage bucket (5 MB max, JPEG/PNG/WebP only).
3. In **Authentication → Providers**, enable Email/Password (and optionally third-party age-assurance verification providers via Edge Functions before granting full dating access).
4. Install `@supabase/supabase-js` (`npm install @supabase/supabase-js`) and wire `src/lib/supabase.ts` and `src/services/platformService.ts` to call the live Supabase client.

---

## GitHub Upload Instructions

1. Initialize and verify `.gitignore` excludes `.env*` and `dist/`:
   ```bash
   git init
   git add .
   git commit -m "Initial Connectora frontend and Supabase architecture"
   ```
2. Create a private repository on GitHub and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/connectora.git
   git push -u origin main
   ```

---

## Hostinger Deployment Instructions

> **Important Architectural Note:** Static web hosting (such as Hostinger Shared/Cloud static hosting) serves the compiled React SPA (`dist/`). Static hosting alone **does not** provide authentication, private messaging, or database security—those must remain powered by **Supabase** (or a dedicated backend API) over HTTPS.

1. Run the production build locally or in CI:
   ```bash
   npm run build
   ```
   This outputs optimized static files into `dist/`.
2. **Option A — Hostinger GitHub Auto-Deploy (Node / Static App)**:
   - Connect your GitHub repository inside Hostinger hPanel.
   - Set Build Command: `npm run build`
   - Set Output Directory: `dist`
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Hostinger environment settings.
3. **Option B — Manual Upload to `public_html`**:
   - Upload the contents of `dist/` into `public_html`.
   - Add an `.htaccess` file in `public_html` for clean SPA fallback routing if using path-based routes:
     ```apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     ```

---

## Feature Readiness Overview

### Completed in This Frontend & Schema Release
- Full responsive landing page (Hero, 3-Step How It Works, 4 Connection Categories, Privacy & Trust Architecture).
- Original **Connectora** brand identity, SVG mark, typography, and design system.
- **Discover Members** interface with Country, Adult Age Range (18+), Connection Intention, Interest, and Language filters, plus Profile Detail modal.
- Clearly labeled **Sample Profiles (Demo)** with generated editorial portraits (never presented as real live members).
- **18+ Registration, Login & Password Reset** flows with strict DOB age calculation blocking under-18 signups and an explicit age-assurance confirmation step.
- **User Profile & Privacy Settings** dashboard (profile editing, validated photo upload UI, public visibility controls, account deletion workflow).
- **Likes, Mutual Matches, Blocks & Private Messaging** interactive preview UI with anti-spam rate-limit safeguards, block, report, and unmatch controls.
- **Safety Center**, private **Report Form**, and **Admin Moderation Desk** (status workflow, suspension actions, audit log).
- **Free Launch Plan** & future-ready disabled **Premium Membership** preview, **About & FAQ**, **Contact**, and **Legal Policy** pages.
- Production PostgreSQL + RLS + Storage schema in `supabase/schema.sql`.

### Backend Features Requiring Live Supabase Connection & Testing
- Live user authentication, email verification, and password reset emails via Supabase Auth.
- Server-side age-assurance / ID verification integration before unlocking adult dating features.
- Live PostgreSQL persistence and Row-Level Security verification for profiles, likes, matches, blocks, and messages.
- Realtime WebSocket message delivery and server-side unread counts via Supabase Realtime.
- Signed URL generation and virus/MIME scanning for `profile-photos` Storage uploads.
- Role-gated JWT claims (`moderator` / `admin`) for the Admin Moderation Dashboard.
