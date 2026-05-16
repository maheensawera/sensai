# Architecture

The application is built using the **Next.js App Router** architecture, leveraging server components, server actions, and client components.

## Core Paradigms
- **Server Actions:** Used for data mutation and form submissions. Located in the `/actions` directory.
- **App Router:** Directory-based routing using the `/app` folder. Contains route groups like `(auth)` for authentication pages and `(main)` for application features.
- **API Routes:** Used for handling webhooks and background jobs (Inngest).

## Data Flow
1. **Client -> Server:** Interactions are handled via Next.js Server Actions or API routes.
2. **Server -> DB:** Prisma ORM is used inside Server Actions/API routes to interact with the PostgreSQL database.
3. **Background Tasks:** Long-running tasks or scheduled tasks (like updating industry insights) are offloaded to Inngest to prevent blocking the main request cycle.
4. **AI Generation:** Server-side calls are made to Google Generative AI for content generation based on user inputs or stored data.

## Key Modules
- **Authentication (`/app/(auth)`):** Clerk-based auth pages.
- **Features (`/app/(main)`):** Contains specific routes for AI tools:
  - `ai-cover-letter`: Generates tailored cover letters.
  - `dashboard`: User hub with industry insights.
  - `interview`: Mock interviews and assessments.
  - `resume`: Resume creation and ATS score analysis.
  - `onboarding`: Initial user setup.
