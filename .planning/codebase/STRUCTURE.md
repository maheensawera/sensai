# Project Structure

```text
├── actions/             # Next.js Server Actions for data mutation
│   ├── cover-letter.js  # Cover letter generation logic
│   ├── dashboard.js     # Dashboard data fetching/mutation
│   ├── interview.js     # Interview assessment logic
│   ├── resume.js        # Resume saving/parsing logic
│   └── user.js          # User profile operations
├── app/                 # Next.js App Router directory
│   ├── (auth)/          # Authentication routes (Clerk)
│   ├── (main)/          # Core feature routes (dashboard, resume, interview, ai-cover-letter)
│   ├── api/             # API routes (likely contains inngest webhook)
│   └── globals.css      # Global Tailwind styles
├── components/          # Reusable UI components
│   ├── Header.jsx       # Global navigation header
│   ├── hero.jsx         # Landing page hero section
│   ├── theme-provider.jsx # Next-themes provider for dark mode
│   └── ui/              # Radix UI/shadcn-like base components
├── lib/                 # Utility functions and shared clients
│   ├── inngest/         # Inngest client and background functions
│   ├── prisma.js        # Prisma client singleton
│   ├── checkUser.js     # User verification utility
│   └── utils.js         # General helper functions (e.g., tailwind merge)
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Data models (User, Assessment, Resume, CoverLetter, IndustryInsight)
│   └── migrations/      # Prisma migration history
├── data/                # Static data or seed files
├── hooks/               # Custom React hooks
└── public/              # Static assets (images, icons)
```
