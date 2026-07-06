# Follow-up Prompt for Cline: Add a "Scenarios" Practice Feature

## Context
This app already exists and is deployed (AWS Well-Architected Framework learning app — Node/Express + Prisma/PostgreSQL backend, React/Vite/Tailwind frontend, deployed on Render). Do not restructure or rewrite existing pillar pages, models, or routes unless directly required to support this new feature. This is an additive change — inspect the existing `prisma/schema.prisma`, `server/routes/`, and `client/src/pages/` structure first, and follow the existing code conventions/patterns already in the project.

## Goal
Add a new "Scenarios" feature: realistic situations the learner responds to in order to test their WAF knowledge, separate from the existing pillar content pages. Support both multiple-choice and open-ended formats, allow some scenarios to span multiple pillars (trade-off scenarios), and track the learner's progress without requiring login.

## 1. Schema Changes (Prisma)
Add these models to `prisma/schema.prisma` and generate a new migration (do not touch existing models except to add relations where needed):

```prisma
model Scenario {
  id            String   @id @default(uuid())
  title         String
  scenarioText  String
  type          String   // "multiple_choice" | "open_ended"
  isCrossPillar Boolean  @default(false)
  difficulty    String   // "beginner" | "intermediate" | "advanced"
  modelAnswer   String?  // used for open_ended type
  pillars       ScenarioPillar[]
  options       ScenarioOption[]
  attempts      UserScenarioAttempt[]
}

model ScenarioPillar {
  id         String   @id @default(uuid())
  scenarioId String
  pillarId   String
  isPrimary  Boolean  @default(true)
  scenario   Scenario @relation(fields: [scenarioId], references: [id])
  pillar     Pillar   @relation(fields: [pillarId], references: [id])
}

model ScenarioOption {
  id          String   @id @default(uuid())
  scenarioId  String
  text        String
  isCorrect   Boolean
  explanation String
  scenario    Scenario @relation(fields: [scenarioId], references: [id])
}

model UserScenarioAttempt {
  id               String   @id @default(uuid())
  sessionId        String
  scenarioId       String
  selectedOptionId String?
  userAnswerText   String?
  isCorrect        Boolean?
  selfRating       String?  // "confident" | "needs_review"
  attemptedAt      DateTime @default(now())
  scenario         Scenario @relation(fields: [scenarioId], references: [id])
}
```

Add the reverse relation (`scenarios ScenarioPillar[]`) to the existing `Pillar` model.

Run `npx prisma migrate dev --name add_scenarios` locally, confirm it applies cleanly, then commit the migration file.

## 2. Seed Data
Extend the existing seed script (don't overwrite existing pillar/use case/example seed logic) to add:
- 4–6 single-pillar scenarios per pillar, mixing `multiple_choice` and `open_ended` types, written as realistic on-the-job situations rather than dry quiz questions
- For each `multiple_choice` scenario: 3–4 `ScenarioOption` rows, exactly one `isCorrect: true`, and a short explanation on *every* option (including wrong ones — explaining why an option is wrong is where most of the learning value is)
- For each `open_ended` scenario: a solid `modelAnswer` the learner can compare their own reasoning against
- 6–10 cross-pillar scenarios (`isCrossPillar: true`) that create a genuine trade-off between two or more pillars (e.g. the "right" Reliability answer conflicts with a Cost Optimization constraint), linked to all relevant pillars via `ScenarioPillar`

Ground all content in AWS's actual published Well-Architected Framework guidance — do not invent AWS service behavior.

Make the seed idempotent (safe to re-run) using `upsert` where the existing seed script does, so re-running the full seed doesn't duplicate scenarios.

## 3. API Endpoints
Add these to the existing Express routes (follow the existing route file structure/conventions):

- `GET /api/scenarios` — list scenarios; supports query params `?pillar=:slug`, `?difficulty=`, `?crossPillar=true`
- `GET /api/scenarios/:id` — full scenario detail, including its options (if multiple_choice) or model answer (if open_ended), and its linked pillars
- `POST /api/scenarios/:id/attempts` — body: `{ sessionId, selectedOptionId? , userAnswerText?, selfRating? }`. For multiple_choice, compute and return `isCorrect` server-side (don't trust the client) by checking the selected option; for open_ended, store the answer and self-rating as-is. Save an `UserScenarioAttempt` row either way.
- `GET /api/progress/:sessionId` — returns per-pillar completion counts (e.g. `{ pillarSlug, attempted, total }` for each pillar) plus overall totals, derived from `UserScenarioAttempt` joined through `ScenarioPillar`

## 4. Frontend
- Add a session ID utility (e.g. `client/src/utils/session.ts`): on first load, generate a UUID via `crypto.randomUUID()`, store it in `localStorage` under a clear key (e.g. `waf-app-session-id`), and reuse it everywhere an attempt is submitted or progress is fetched. Note in a code comment that this ties progress to the browser, not a real account, and that swapping in real auth later is a drop-in replacement since `sessionId` is just a string.
- New route `/scenarios` — hub page:
  - Progress summary per pillar (e.g. "Security: 5/8 completed"), pulled from `GET /api/progress/:sessionId`
  - Filterable list (by pillar, difficulty, or cross-pillar only)
- New route `/scenarios/:id` — scenario detail page:
  - Renders the scenario narrative and a tag showing which pillar(s) it touches (distinct visual treatment for cross-pillar scenarios, e.g. "Reliability × Cost Optimization")
  - `multiple_choice`: selectable option cards; on submit, call the attempts endpoint, then reveal correctness plus the explanation for every option
  - `open_ended`: textarea for the learner's own answer; on submit, reveal the `modelAnswer`, then prompt the learner to self-rate ("Confident" / "Needs review") before saving the attempt
  - "Next scenario" button
- On each existing `/pillars/:slug` page, add a small "Practice Scenarios for this pillar" link/section that deep-links to `/scenarios?pillar=:slug`
- Match the existing Tailwind styling conventions already used elsewhere in the app — don't introduce a different visual style for this feature

## 5. Verification Steps (do these before considering it done)
1. Confirm the migration applies cleanly to a fresh local DB and to the existing dev DB without data loss
2. Confirm re-running the seed script doesn't duplicate scenarios or existing pillar content
3. Manually test both scenario types end-to-end, including that `isCorrect` is computed server-side, not trusted from the client
4. Confirm progress numbers on `/scenarios` update correctly after submitting an attempt
5. Confirm the existing pillar pages and their existing content/tests still work unchanged
6. Once verified locally, apply the migration to the production Render Postgres instance and run the extended seed against it

Work through this step by step, showing me the plan before writing large amounts of code, and flag anywhere you need to deviate from the existing project's conventions.
