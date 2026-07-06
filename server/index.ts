import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/pillars', async (_req: Request, res: Response) => {
  try {
    const pillars = await prisma.pillar.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        summary: true,
        iconName: true,
      },
      orderBy: { id: 'asc' },
    });
    res.json(pillars);
  } catch (error) {
    console.error('Error fetching pillars:', error);
    res.status(500).json({ error: 'Failed to fetch pillars' });
  }
});

app.get('/api/pillars/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const pillar = await prisma.pillar.findUnique({
      where: { slug },
      include: {
        designPrinciples: {
          orderBy: { id: 'asc' },
        },
        useCases: {
          orderBy: { id: 'asc' },
          include: {
            examples: {
              orderBy: { id: 'asc' },
            },
          },
        },
      },
    });

    if (!pillar) {
      return res.status(404).json({ error: 'Pillar not found' });
    }

    res.json(pillar);
  } catch (error) {
    console.error('Error fetching pillar:', error);
    res.status(500).json({ error: 'Failed to fetch pillar' });
  }
});

app.get('/api/pillars/:slug/quiz', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const pillar = await prisma.pillar.findUnique({
      where: { slug },
    });

    if (!pillar) {
      return res.status(404).json({ error: 'Pillar not found' });
    }

    const questions = await prisma.quizQuestion.findMany({
      where: { pillarId: pillar.id },
      orderBy: { id: 'asc' },
    });

    res.json(questions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ error: 'Failed to fetch quiz questions' });
  }
});

// ─── SCENARIOS API ─────────────────────────────────────────────────

// GET /api/scenarios — list scenarios with optional filters
app.get('/api/scenarios', async (req: Request, res: Response) => {
  try {
    const { pillar, difficulty, crossPillar } = req.query;

    const where: any = {};

    if (difficulty) {
      where.difficulty = difficulty as string;
    }

    if (crossPillar === 'true') {
      where.isCrossPillar = true;
    }

    // Filter by pillar slug at the DB level via a nested relation condition
    if (pillar) {
      where.pillars = {
        some: {
          pillar: { slug: pillar as string },
        },
      };
    }

    const scenarios = await prisma.scenario.findMany({
      where,
      include: {
        pillars: {
          include: {
            pillar: {
              select: { slug: true, name: true },
            },
          },
        },
        _count: {
          select: { options: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    res.json(scenarios);
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ error: 'Failed to fetch scenarios' });
  }
});

// GET /api/scenarios/:id — full scenario detail
app.get('/api/scenarios/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const scenario = await prisma.scenario.findUnique({
      where: { id },
      include: {
        pillars: {
          include: {
            pillar: {
              select: { slug: true, name: true },
            },
          },
        },
        options: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    res.json(scenario);
  } catch (error) {
    console.error('Error fetching scenario:', error);
    res.status(500).json({ error: 'Failed to fetch scenario' });
  }
});

// POST /api/scenarios/:id/attempts — submit an attempt
app.post('/api/scenarios/:id/attempts', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sessionId, selectedOptionId, userAnswerText, selfRating } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const scenario = await prisma.scenario.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    let isCorrect: boolean | null = null;

    if (scenario.type === 'multiple_choice') {
      // Server-side correctness check — don't trust the client
      if (!selectedOptionId) {
        return res.status(400).json({ error: 'selectedOptionId is required for multiple_choice scenarios' });
      }
      const selectedOption = scenario.options.find((o) => o.id === selectedOptionId);
      if (!selectedOption) {
        return res.status(400).json({ error: 'Invalid selectedOptionId' });
      }
      isCorrect = selectedOption.isCorrect;
    }

    const attempt = await prisma.userScenarioAttempt.create({
      data: {
        sessionId,
        scenarioId: id,
        selectedOptionId: selectedOptionId || null,
        userAnswerText: userAnswerText || null,
        isCorrect,
        selfRating: selfRating || null,
      },
    });

    res.json(attempt);
  } catch (error) {
    console.error('Error creating attempt:', error);
    res.status(500).json({ error: 'Failed to save attempt' });
  }
});

// GET /api/progress/:sessionId — per-pillar and overall progress
app.get('/api/progress/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    // Get all pillars
    const pillars = await prisma.pillar.findMany({
      orderBy: { id: 'asc' },
    });

    // Get all scenarios with their pillar links
    const allScenarios = await prisma.scenario.findMany({
      include: {
        pillars: true,
      },
    });

    // Get all attempts for this session
    const attempts = await prisma.userScenarioAttempt.findMany({
      where: { sessionId },
    });

    // Use unique scenario IDs — a user retrying doesn't inflate progress
    const attemptedScenarioIds = new Set(attempts.map((a) => a.scenarioId));

    // Build per-pillar progress
    const perPillar = pillars.map((pillar) => {
      const pillarScenarioIds = allScenarios
        .filter((s) => s.pillars.some((sp) => sp.pillarId === pillar.id))
        .map((s) => s.id);

      const total = pillarScenarioIds.length;
      const attempted = pillarScenarioIds.filter((id) => attemptedScenarioIds.has(id)).length;

      return {
        pillarSlug: pillar.slug,
        pillarName: pillar.name,
        attempted,
        total,
      };
    });

    // Overall totals — count unique scenarios attempted, not total attempt rows
    const totalScenarios = allScenarios.length;
    const totalAttempted = attemptedScenarioIds.size;

    res.json({
      perPillar,
      overall: {
        attempted: totalAttempted,
        total: totalScenarios,
      },
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Serve static frontend in production
const clientBuildPath = path.resolve(process.cwd(), 'client', 'dist');
app.use(express.static(clientBuildPath));

// SPA fallback - serve index.html for any non-API routes
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;