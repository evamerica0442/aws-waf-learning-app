import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchScenarioById, fetchScenarios, submitAttempt, ScenarioDetail, ScenarioSummary } from '../api';
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

export default function ScenarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);
  const [allScenarios, setAllScenarios] = useState<ScenarioSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Multiple choice state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Open ended state
  const [userAnswer, setUserAnswer] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [selfRating, setSelfRating] = useState<string | null>(null);
  const [openSubmitted, setOpenSubmitted] = useState(false);

  // Submitting state
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    // Reset interaction state when navigating between scenarios
    setSelectedOptionId(null);
    setSubmitted(false);
    setIsCorrect(null);
    setUserAnswer('');
    setShowModelAnswer(false);
    setSelfRating(null);
    setOpenSubmitted(false);

    Promise.all([
      fetchScenarioById(id),
      fetchScenarios(),
    ])
      .then(([scenarioData, scenariosData]) => {
        setScenario(scenarioData);
        setAllScenarios(scenariosData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const nextScenario = (): ScenarioSummary | null => {
    if (!id || allScenarios.length === 0) return null;
    const currentIndex = allScenarios.findIndex((s) => s.id === id);
    if (currentIndex === -1) return null;
    return allScenarios[(currentIndex + 1) % allScenarios.length];
  };

  const handleNextScenario = () => {
    const next = nextScenario();
    if (next) {
      navigate(`/scenarios/${next.id}`);
    } else {
      navigate('/scenarios');
    }
  };

  const handleMultipleChoiceSubmit = async () => {
    if (!scenario || !selectedOptionId || submitting) return;
    setSubmitting(true);
    try {
      const sessionId = getSessionId();
      const attempt = await submitAttempt(scenario.id, {
        sessionId,
        selectedOptionId,
      });
      setIsCorrect(attempt.isCorrect);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEndedSubmit = async (rating: string) => {
    if (!scenario || submitting) return;
    setSubmitting(true);
    setSelfRating(rating);
    try {
      const sessionId = getSessionId();
      await submitAttempt(scenario.id, {
        sessionId,
        userAnswerText: userAnswer,
        selfRating: rating,
      });
      setOpenSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aws-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">Error: {error}</p>
        <Link to="/scenarios" className="mt-4 inline-block text-aws-orange hover:underline">
          ← Back to scenarios
        </Link>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Scenario not found.</p>
        <Link to="/scenarios" className="mt-4 inline-block text-aws-orange hover:underline">
          ← Back to scenarios
        </Link>
      </div>
    );
  }

  const next = nextScenario();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/scenarios" className="text-aws-orange hover:underline">
          Scenarios
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{scenario.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* For cross-pillar: show a single combined badge; for single-pillar: show one pillar tag */}
          {scenario.isCrossPillar ? (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              {scenario.pillars.map((sp) => sp.pillar.name).join(' × ')}
            </span>
          ) : (
            scenario.pillars.map((sp) => (
              <span
                key={sp.id}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-aws-orange/10 text-aws-orange"
              >
                {sp.pillar.name}
              </span>
            ))
          )}
          {/* Difficulty badge */}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[scenario.difficulty] || 'bg-gray-100 text-gray-600'}`}>
            {difficultyLabels[scenario.difficulty] || scenario.difficulty}
          </span>
          {/* Type badge */}
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {scenario.type === 'multiple_choice' ? 'Multiple Choice' : 'Open Ended'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-aws-dark-blue">
          {scenario.title}
        </h1>
      </div>

      {/* Scenario narrative */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{scenario.scenarioText}</p>
      </div>

      {/* Multiple Choice */}
      {scenario.type === 'multiple_choice' && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-aws-dark-blue mb-4">Your Answer</h2>
          <div className="space-y-3">
            {scenario.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectOption = submitted && option.isCorrect;
              const isWrongOption = submitted && isSelected && !option.isCorrect;
              return (
                <button
                  key={option.id}
                  onClick={() => !submitted && setSelectedOptionId(option.id)}
                  disabled={submitted}
                  className={`w-full text-left px-5 py-4 rounded-lg border text-sm transition-colors ${
                    isCorrectOption
                      ? 'bg-green-50 border-green-400 text-green-800'
                      : isWrongOption
                      ? 'bg-red-50 border-red-400 text-red-800'
                      : isSelected
                      ? 'bg-aws-orange/10 border-aws-orange/50 text-aws-dark-blue'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="font-medium mb-1">{option.text}</div>
                  {submitted && (
                    <div className={`text-xs mt-2 ${option.isCorrect ? 'text-green-700' : 'text-gray-500'}`}>
                      {option.explanation}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {!submitted && (
            <button
              onClick={handleMultipleChoiceSubmit}
              disabled={!selectedOptionId || submitting}
              className="mt-6 px-6 py-2.5 bg-aws-orange text-white rounded-lg font-medium hover:bg-aws-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          )}

          {submitted && (
            <div className="mt-6 space-y-4">
              <div className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleNextScenario}
                  className="inline-block px-6 py-2.5 bg-aws-orange text-white rounded-lg font-medium hover:bg-aws-orange/90 transition-colors"
                >
                  {next ? `Next: ${next.title} →` : 'Back to Scenarios →'}
                </button>
                <Link
                  to="/scenarios"
                  className="inline-block px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  All Scenarios
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Open Ended */}
      {scenario.type === 'open_ended' && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-aws-dark-blue mb-4">Your Answer</h2>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={openSubmitted}
            placeholder="Write your response here. Consider which Well-Architected design principles apply and what AWS services you would recommend..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-aws-orange/50 disabled:bg-gray-50 disabled:cursor-default"
          />

          {!openSubmitted && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-3">
                After writing your answer, rate your confidence before submitting.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleOpenEndedSubmit('confident')}
                  disabled={!userAnswer.trim() || submitting}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit — Confident'}
                </button>
                <button
                  onClick={() => handleOpenEndedSubmit('needs_review')}
                  disabled={!userAnswer.trim() || submitting}
                  className="px-5 py-2.5 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit — Needs Review'}
                </button>
              </div>
            </div>
          )}

          {openSubmitted && (
            <div className="mt-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="font-semibold text-blue-900 mb-2">Model Answer</h3>
                <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">
                  {scenario.modelAnswer || 'No model answer available for this scenario.'}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Your Self-Rating</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selfRating === 'confident'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selfRating === 'confident' ? 'Confident' : 'Needs Review'}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleNextScenario}
                  className="inline-block px-6 py-2.5 bg-aws-orange text-white rounded-lg font-medium hover:bg-aws-orange/90 transition-colors"
                >
                  {next ? `Next: ${next.title} →` : 'Back to Scenarios →'}
                </button>
                <Link
                  to="/scenarios"
                  className="inline-block px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  All Scenarios
                </Link>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}