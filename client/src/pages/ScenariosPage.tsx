import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchScenarios, fetchProgress, fetchPillars, ScenarioSummary, PillarProgress, PillarSummary } from '../api';
import { getSessionId } from '../utils/session';

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

const difficultyLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export default function ScenariosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [progress, setProgress] = useState<PillarProgress[]>([]);
  const [pillars, setPillars] = useState<PillarSummary[]>([]);
  const [overallTotal, setOverallTotal] = useState(0);
  const [overallAttempted, setOverallAttempted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activePillar = searchParams.get('pillar') || '';
  const activeDifficulty = searchParams.get('difficulty') || '';
  const activeCrossPillar = searchParams.get('crossPillar') || '';

  // Fetch pillars once for the filter dropdown
  useEffect(() => {
    fetchPillars()
      .then(setPillars)
      .catch(() => {}); // non-critical; dropdown falls back gracefully
  }, []);

  useEffect(() => {
    const sessionId = getSessionId();
    setLoading(true);
    setError(null);

    const params: { pillar?: string; difficulty?: string; crossPillar?: string } = {};
    if (activePillar) params.pillar = activePillar;
    if (activeDifficulty) params.difficulty = activeDifficulty;
    if (activeCrossPillar) params.crossPillar = activeCrossPillar;

    Promise.all([
      fetchScenarios(params),
      fetchProgress(sessionId),
    ])
      .then(([scenariosData, progressData]) => {
        setScenarios(scenariosData);
        setProgress(progressData.perPillar);
        setOverallTotal(progressData.overall.total);
        setOverallAttempted(progressData.overall.attempted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activePillar, activeDifficulty, activeCrossPillar]);

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasFilters = activePillar || activeDifficulty || activeCrossPillar;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-aws-dark-blue mb-2">
        Practice Scenarios
      </h1>
      <p className="text-gray-600 mb-8">
        Test your knowledge with realistic on-the-job scenarios based on the AWS Well-Architected Framework.
      </p>

      {/* Progress Summary */}
      <section className="mb-8 bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-aws-dark-blue mb-4">Your Progress</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {progress.map((p) => (
            <div key={p.pillarSlug} className="text-center">
              <div className="text-xs font-medium text-gray-500 mb-1 truncate">{p.pillarName}</div>
              <div className="text-lg font-bold text-aws-dark-blue">
                {p.attempted}<span className="text-gray-400 text-sm font-normal">/{p.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-aws-orange h-1.5 rounded-full transition-all"
                  style={{ width: p.total > 0 ? `${(p.attempted / p.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-gray-500 text-center">
          Overall: {overallAttempted}/{overallTotal} completed
        </div>
      </section>

      {/* Filters */}
      <section className="mb-6 flex flex-wrap items-center gap-3">
        {/* Pillar filter — populated from API */}
        <select
          value={activePillar}
          onChange={(e) => setFilter('pillar', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-aws-orange/50"
        >
          <option value="">All Pillars</option>
          {pillars.map((p) => (
            <option key={p.slug} value={p.slug}>{p.name}</option>
          ))}
        </select>

        {/* Difficulty filter */}
        <select
          value={activeDifficulty}
          onChange={(e) => setFilter('difficulty', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-aws-orange/50"
        >
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {/* Cross-pillar toggle */}
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={activeCrossPillar === 'true'}
            onChange={(e) => setFilter('crossPillar', e.target.checked ? 'true' : '')}
            className="rounded border-gray-300 text-aws-orange focus:ring-aws-orange/50"
          />
          Cross-pillar only
        </label>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-aws-orange hover:underline"
          >
            Clear filters
          </button>
        )}
      </section>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aws-orange" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Scenario list */}
      {!loading && !error && (
        <div className="space-y-4">
          {scenarios.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No scenarios match your filters.</p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-aws-orange hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
          {scenarios.map((s) => (
            <Link
              key={s.id}
              to={`/scenarios/${s.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-5 hover:border-aws-orange/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{s.scenarioText}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {/* Pillar tags */}
                    {s.pillars.map((sp) => (
                      <span
                        key={sp.id}
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sp.isPrimary
                            ? 'bg-aws-orange/10 text-aws-orange'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {sp.pillar.name}
                      </span>
                    ))}
                    {/* Cross-pillar badge */}
                    {s.isCrossPillar && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        Trade-off
                      </span>
                    )}
                    {/* Difficulty badge */}
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[s.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                      {difficultyLabels[s.difficulty] || s.difficulty}
                    </span>
                    {/* Type badge */}
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {s.type === 'multiple_choice' ? 'Multiple Choice' : 'Open Ended'}
                    </span>
                  </div>
                </div>
                <span className="text-aws-orange text-lg shrink-0 mt-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}