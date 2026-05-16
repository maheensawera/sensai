# Integrations

## Authentication
- **Clerk:** Handles user authentication, registration, and session management. Integrated via `@clerk/nextjs`.

## Artificial Intelligence
- **Google Generative AI (Gemini):** Used for generating cover letters, mock interview assessments, resume feedback, and industry insights.

## Background Processing
- **Inngest:** Handles background jobs, asynchronous workflows, and cron tasks. Integrated via the `inngest` package, with functions located in `lib/inngest/functions.js`.

## Database
- **PostgreSQL:** Primary database, accessed through Prisma ORM. Stores user profiles, assessments, resumes, cover letters, and industry insights.
