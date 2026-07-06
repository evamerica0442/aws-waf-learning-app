import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPillars, PillarSummary } from '../api';

const pillarIcons: Record<string, string> = {
  'operational-excellence': '⚙️',
  security: '🔒',
  reliability: '🔄',
  'performance-efficiency': '⚡',
  'cost-optimization': '💰',
  sustainability: '🌱',
};

export default function LandingPage() {
  const [pillars, setPillars] = useState<PillarSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPillars()
      .then(setPillars)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-aws-dark-blue mb-4">
          AWS Well-Architected Framework
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          The AWS Well-Architected Framework helps cloud architects build secure,
          high-performing, resilient, and efficient infrastructure for their applications.
          Explore each of the six pillars below to deepen your understanding.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aws-orange" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">Failed to load pillars: {error}</p>
        </div>
      )}

      {/* Pillar cards grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <Link
              key={pillar.id}
              to={`/pillars/${pillar.slug}`}
              className="pillar-card group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{pillarIcons[pillar.slug] || '📚'}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-aws-dark-blue group-hover:text-aws-orange transition-colors mb-2">
                    {pillar.name}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {pillar.summary}
                  </p>
                  <span className="inline-block mt-3 text-aws-orange text-sm font-medium group-hover:underline">
                    Learn more →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && pillars.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No pillars found. The database may need to be seeded.</p>
        </div>
      )}

      {/* Practice Scenarios CTA */}
      {!loading && !error && pillars.length > 0 && (
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="text-3xl mb-3">🎯</div>
          <h2 className="text-xl font-semibold text-aws-dark-blue mb-2">
            Ready to Practice?
          </h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto mb-5">
            Test your knowledge with realistic on-the-job scenarios — multiple choice and open ended,
            across all six pillars. Track your progress as you go.
          </p>
          <Link
            to="/scenarios"
            className="inline-block px-6 py-2.5 bg-aws-orange text-white rounded-lg font-medium hover:bg-aws-orange/90 transition-colors"
          >
            Go to Practice Scenarios →
          </Link>
        </div>
      )}
    </div>
  );
}