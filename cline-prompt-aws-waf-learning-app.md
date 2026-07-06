# Build Prompt for Cline: AWS Well-Architected Framework Learning App

## Project Overview
Build a full-stack web application that helps users learn the AWS Well-Architected Framework (WAF) in depth. The app must have a dedicated page for each of the 6 WAF pillars, each containing structured content: an overview, core design principles, common use cases, and worked examples. The app must be deployable on Render and use a real database (not flat files) to store all content, so it can be edited/extended later via an admin interface or seed script.

## Tech Stack (use exactly this unless there's a strong reason not to — explain if you deviate)
- **Backend:** Node.js + Express (or Fastify) REST API
- **Frontend:** React (Vite) with React Router — single-page app served as static build
- **Database:** PostgreSQL (Render offers managed Postgres — use it)
- **ORM:** Prisma (makes migrations and seeding clean)
- **Styling:** Tailwind CSS
- **Deployment target:** Render — one Web Service (Node API + serves built frontend, OR two services: a Static Site for frontend + a Web Service for API) and one Render PostgreSQL instance

## The 6 AWS Well-Architected Framework Pillars
1. Operational Excellence
2. Security
3. Reliability
4. Performance Efficiency
5. Cost Optimization
6. Sustainability

## Database Schema (via Prisma)
Design tables roughly like this (adjust as needed, but keep it normalized):

```
Pillar
- id
- slug (e.g. "security")
- name
- summary (short description)
- iconName (for UI)

DesignPrinciple
- id
- pillarId (FK)
- title
- description

UseCase
- id
- pillarId (FK)
- title
- problemStatement
- recommendedApproach
- awsServicesInvolved (string array or join table)

Example
- id
- useCaseId (FK)
- title
- scenario (narrative description)
- architectureNotes
- codeOrConfigSnippet (nullable, text)
- diagramUrl (nullable, for future diagram support)

QuizQuestion (optional, nice-to-have)
- id
- pillarId (FK)
- question
- options (array)
- correctAnswerIndex
- explanation
```

## Seed Data Requirement
Write a seed script (`prisma/seed.ts` or `.js`) that populates the database with real, accurate content for all 6 pillars — not placeholder text. For each pillar include:
- 3–5 design principles (from actual AWS WAF documentation)
- 3–4 use cases per pillar
- 1–2 worked examples per use case, with realistic architecture notes and, where relevant, a short config/code snippet (e.g. an IAM policy snippet for Security, an Auto Scaling config for Reliability, a Cost Explorer/Budgets example for Cost Optimization)

Ground this content in AWS's publicly published Well-Architected Framework whitepapers rather than inventing details.

## Pages / Routes
- `/` — Landing page: brief intro to the WAF, cards linking to each of the 6 pillar pages
- `/pillars/:slug` — Pillar detail page showing:
  - Pillar summary
  - Design principles (list)
  - Use cases (expandable/accordion), each showing its examples
  - "Test yourself" section if quiz questions exist for that pillar
- `/about` — Short page explaining what the Well-Architected Framework is and how to use this app to study it

## API Endpoints
- `GET /api/pillars` — list all pillars (id, slug, name, summary)
- `GET /api/pillars/:slug` — full pillar detail including principles, use cases, and nested examples
- `GET /api/pillars/:slug/quiz` — quiz questions for a pillar (optional feature)
- Basic error handling and JSON responses throughout

## Frontend Requirements
- Clean, readable, textbook-like design — this is a learning tool, prioritize readability over flashiness (good typography, generous whitespace, clear visual hierarchy)
- Sidebar or top nav with links to all 6 pillars, highlighting the active one
- Use cases displayed as expandable accordions or tabs so the page isn't a wall of text
- Code/config snippets rendered in a monospace code block with syntax highlighting (use a lightweight library like `prismjs` or `react-syntax-highlighter`)
- Fully responsive (mobile-friendly)
- Loading and empty states handled gracefully

## Render Deployment Requirements
- Include a `render.yaml` (Infrastructure as Code) at the repo root that defines:
  - A PostgreSQL database service
  - A Web Service for the backend (build command installs deps + runs `prisma migrate deploy`, start command runs the server)
  - Either the frontend built and served by the same Express server as static files, OR a separate Static Site service — pick one approach and be consistent
- Environment variables should include `DATABASE_URL` (auto-populated by Render from the Postgres service) and any others needed (e.g. `PORT`, `NODE_ENV`)
- Add a `postinstall` or build step that runs `prisma generate` and `prisma migrate deploy`
- Include a one-time seed command documented in the README (e.g. `npm run seed`) for populating the database after first deploy
- Add a `.env.example` file showing required environment variables for local development

## Project Structure (suggested)
```
/
├── render.yaml
├── package.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── server/
│   ├── index.ts
│   └── routes/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.tsx
│   └── vite.config.ts
└── README.md
```

## README Requirements
Write a README that includes:
- Project description
- Local setup instructions (install deps, set up `.env`, run migrations, seed DB, run dev servers)
- Deployment instructions specific to Render (linking the repo, using `render.yaml`, running the seed command post-deploy)
- A short note on how to add/edit content (since it lives in the database via seed data, not hardcoded in components)

## Build Order (do this step by step, confirming each step works before moving to the next)
1. Scaffold repo structure and both `package.json`s (root or client/server split)
2. Set up Prisma schema and run first migration locally against a local/dev Postgres instance
3. Write and run the seed script with real WAF content for all 6 pillars
4. Build Express API endpoints, test them with curl/Postman before touching the frontend
5. Scaffold React app with routing and basic pages hitting the live API
6. Style with Tailwind, build out the accordion/tab UI for use cases and examples
7. Write `render.yaml` and deployment docs
8. Do a full local production build test (`npm run build` + `npm start`) before pushing
9. Push to GitHub and deploy on Render, run the seed script against the production DB
10. Verify all 6 pillar pages render correctly with real data in production

Please work through this incrementally, showing me the plan for each major step before writing large amounts of code, and flag any place where you're inferring a decision I didn't specify.
