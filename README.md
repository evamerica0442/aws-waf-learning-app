# AWS Well-Architected Framework Learning App

A full-stack web application for learning the AWS Well-Architected Framework (WAF) in depth. Built with Node.js/Express, React (Vite), PostgreSQL, and Prisma.

## Features

- **6 Pillar Pages** — Dedicated pages for Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability
- **Design Principles** — Official AWS WAF design principles for each pillar
- **Use Cases** — Real-world scenarios with recommended approaches and AWS services
- **Worked Examples** — Architecture notes and configuration/code snippets
- **Quiz Questions** — Test your knowledge with interactive quizzes
- **Responsive Design** — Works on desktop and mobile
- **Database-Backed Content** — All content stored in PostgreSQL, editable via seed script

## Tech Stack

- **Backend:** Node.js + Express REST API
- **Frontend:** React (Vite) with React Router
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Code Highlighting:** react-syntax-highlighter (Prism)

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (local instance or Docker)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd aws-waf-learning-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your `DATABASE_URL` to point to your local PostgreSQL instance.

4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Seed the database with WAF content:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```
   The API server runs on `http://localhost:3001`.

7. In a separate terminal, start the frontend dev server:
   ```bash
   cd client && npm run dev
   ```
   The frontend runs on `http://localhost:5173` and proxies API requests to port 3001.

### Production Build Test

To test the full production build locally:

```bash
npm run build
npm start
```

This builds the frontend and serves it from the Express server on port 3001.

## Deployment to Render

### One-Click Deploy (render.yaml)

This repo includes a `render.yaml` file for Render Blueprints. To deploy:

1. Push the repository to GitHub.
2. In the Render Dashboard, click **New → Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically create:
   - A PostgreSQL database (`aws-waf-db`)
   - A Web Service (`aws-waf-app`) that serves both the API and frontend

### Post-Deploy Steps

After the initial deployment, you need to seed the database:

1. Go to the Render Dashboard → your Web Service → **Shell** tab.
2. Run the seed command:
   ```bash
   npm run seed
   ```

3. Verify the app is working by visiting `https://your-app.onrender.com/api/pillars`.

### Manual Deployment

If not using Blueprints:

1. Create a **PostgreSQL** database on Render.
2. Create a **Web Service** with:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `DATABASE_URL` — from your Render PostgreSQL instance
     - `NODE_ENV` — `production`
     - `PORT` — `10000`

## Adding/Editing Content

All content is stored in the database via the seed script at `prisma/seed.ts`. To add or modify content:

1. Edit `prisma/seed.ts` to add new pillars, design principles, use cases, examples, or quiz questions.
2. Re-run the seed script:
   ```bash
   npm run seed
   ```

The seed script is idempotent — it clears existing data and re-inserts everything. For production, you may want to modify the script to only upsert new content.

To add content without reseeding, you can connect directly to the database and insert records into the tables:
- `Pillar` — The 6 WAF pillars
- `DesignPrinciple` — Design principles for each pillar
- `UseCase` — Use cases with problem statements and approaches
- `Example` — Worked examples with architecture notes and code snippets
- `QuizQuestion` — Quiz questions with multiple-choice options

## Project Structure

```
/
├── render.yaml              # Render Blueprint configuration
├── package.json             # Root package.json (server + scripts)
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script with WAF content
├── server/
│   └── index.ts             # Express server with API routes
├── client/
│   ├── index.html           # HTML entry point
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── src/
│       ├── main.tsx         # React entry point
│       ├── App.tsx          # Router setup
│       ├── api.ts           # API client functions
│       ├── index.css        # Tailwind imports + custom styles
│       ├── components/
│       │   ├── Layout.tsx   # Header, nav, footer layout
│       │   ├── Accordion.tsx # Expandable accordion component
│       │   └── CodeBlock.tsx # Syntax-highlighted code block
│       └── pages/
│           ├── LandingPage.tsx  # Home page with pillar cards
│           ├── PillarPage.tsx   # Pillar detail page
│           └── AboutPage.tsx    # About the WAF
└── .env.example             # Environment variable template
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pillars` | List all pillars |
| GET | `/api/pillars/:slug` | Full pillar detail with principles, use cases, and examples |
| GET | `/api/pillars/:slug/quiz` | Quiz questions for a pillar |