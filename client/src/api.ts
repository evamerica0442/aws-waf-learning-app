const API_BASE = '/api';

export interface PillarSummary {
  id: number;
  slug: string;
  name: string;
  summary: string;
  iconName: string;
}

export interface DesignPrinciple {
  id: number;
  pillarId: number;
  title: string;
  description: string;
}

export interface Example {
  id: number;
  useCaseId: number;
  title: string;
  scenario: string;
  architectureNotes: string;
  codeOrConfigSnippet: string | null;
  diagramUrl: string | null;
}

export interface UseCase {
  id: number;
  pillarId: number;
  title: string;
  problemStatement: string;
  recommendedApproach: string;
  awsServicesInvolved: string[];
  examples: Example[];
}

export interface PillarDetail {
  id: number;
  slug: string;
  name: string;
  summary: string;
  iconName: string;
  designPrinciples: DesignPrinciple[];
  useCases: UseCase[];
}

export interface QuizQuestion {
  id: number;
  pillarId: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

// ─── SCENARIO TYPES ────────────────────────────────────────────────

export interface ScenarioPillarLink {
  id: string;
  scenarioId: string;
  pillarId: number;
  isPrimary: boolean;
  pillar: {
    slug: string;
    name: string;
  };
}

export interface ScenarioOption {
  id: string;
  scenarioId: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ScenarioSummary {
  id: string;
  title: string;
  scenarioText: string;
  type: string;
  isCrossPillar: boolean;
  difficulty: string;
  pillars: ScenarioPillarLink[];
  _count: {
    options: number;
  };
}

export interface ScenarioDetail {
  id: string;
  title: string;
  scenarioText: string;
  type: string;
  isCrossPillar: boolean;
  difficulty: string;
  modelAnswer: string | null;
  pillars: ScenarioPillarLink[];
  options: ScenarioOption[];
}

export interface UserScenarioAttempt {
  id: string;
  sessionId: string;
  scenarioId: string;
  selectedOptionId: string | null;
  userAnswerText: string | null;
  isCorrect: boolean | null;
  selfRating: string | null;
  attemptedAt: string;
}

export interface PillarProgress {
  pillarSlug: string;
  pillarName: string;
  attempted: number;
  total: number;
}

export interface ProgressResponse {
  perPillar: PillarProgress[];
  overall: {
    attempted: number;
    total: number;
  };
}

// ─── API FUNCTIONS ─────────────────────────────────────────────────

export async function fetchPillars(): Promise<PillarSummary[]> {
  const res = await fetch(`${API_BASE}/pillars`);
  if (!res.ok) throw new Error('Failed to fetch pillars');
  return res.json();
}

export async function fetchPillarBySlug(slug: string): Promise<PillarDetail> {
  const res = await fetch(`${API_BASE}/pillars/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch pillar');
  return res.json();
}

export async function fetchQuizQuestions(slug: string): Promise<QuizQuestion[]> {
  const res = await fetch(`${API_BASE}/pillars/${slug}/quiz`);
  if (!res.ok) throw new Error('Failed to fetch quiz questions');
  return res.json();
}

export async function fetchScenarios(params?: {
  pillar?: string;
  difficulty?: string;
  crossPillar?: string;
}): Promise<ScenarioSummary[]> {
  const searchParams = new URLSearchParams();
  if (params?.pillar) searchParams.set('pillar', params.pillar);
  if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
  if (params?.crossPillar) searchParams.set('crossPillar', params.crossPillar);
  const qs = searchParams.toString();
  const res = await fetch(`${API_BASE}/scenarios${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch scenarios');
  return res.json();
}

export async function fetchScenarioById(id: string): Promise<ScenarioDetail> {
  const res = await fetch(`${API_BASE}/scenarios/${id}`);
  if (!res.ok) throw new Error('Failed to fetch scenario');
  return res.json();
}

export async function submitAttempt(
  scenarioId: string,
  body: {
    sessionId: string;
    selectedOptionId?: string;
    userAnswerText?: string;
    selfRating?: string;
  }
): Promise<UserScenarioAttempt> {
  const res = await fetch(`${API_BASE}/scenarios/${scenarioId}/attempts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to submit attempt');
  return res.json();
}

export async function fetchProgress(sessionId: string): Promise<ProgressResponse> {
  const res = await fetch(`${API_BASE}/progress/${sessionId}`);
  if (!res.ok) throw new Error('Failed to fetch progress');
  return res.json();
}