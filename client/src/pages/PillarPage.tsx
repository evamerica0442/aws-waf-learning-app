import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPillarBySlug, fetchQuizQuestions, PillarDetail, QuizQuestion } from '../api';
import Accordion from '../components/Accordion';
import CodeBlock from '../components/CodeBlock';

export default function PillarPage() {
  const { slug } = useParams<{ slug: string }>();
  const [pillar, setPillar] = useState<PillarDetail | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetchPillarBySlug(slug),
      fetchQuizQuestions(slug).catch(() => [] as QuizQuestion[]),
    ])
      .then(([pillarData, quizData]) => {
        setPillar(pillarData);
        setQuizQuestions(quizData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

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
        <Link to="/" className="mt-4 inline-block text-aws-orange hover:underline">
          ← Back to all pillars
        </Link>
      </div>
    );
  }

  if (!pillar) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Pillar not found.</p>
        <Link to="/" className="mt-4 inline-block text-aws-orange hover:underline">
          ← Back to all pillars
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-aws-orange hover:underline">
          All Pillars
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{pillar.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-aws-dark-blue mb-4">
          {pillar.name}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">{pillar.summary}</p>
      </div>

      {/* Design Principles */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-aws-dark-blue mb-6 flex items-center gap-2">
          <span className="w-1 h-7 bg-aws-orange rounded-full" />
          Design Principles
        </h2>
        <div className="space-y-4">
          {pillar.designPrinciples.map((dp) => (
            <div key={dp.id} className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{dp.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{dp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-aws-dark-blue mb-6 flex items-center gap-2">
          <span className="w-1 h-7 bg-aws-orange rounded-full" />
          Use Cases
        </h2>
        <Accordion
          items={pillar.useCases.map((uc) => ({
            title: uc.title,
            content: (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Problem Statement</h4>
                  <p className="text-gray-600 text-sm">{uc.problemStatement}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Recommended Approach</h4>
                  <p className="text-gray-600 text-sm">{uc.recommendedApproach}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">AWS Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {uc.awsServicesInvolved.map((svc, i) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1 bg-aws-orange/10 text-aws-orange text-xs font-medium rounded-full"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Examples */}
                <div className="space-y-4 mt-4">
                  <h4 className="font-medium text-gray-700">Worked Examples</h4>
                  {uc.examples.map((ex) => (
                    <div key={ex.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{ex.title}</h5>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div>
                          <span className="font-medium text-gray-700">Scenario: </span>
                          {ex.scenario}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Architecture: </span>
                          {ex.architectureNotes}
                        </div>
                        {ex.codeOrConfigSnippet && (
                          <div>
                            <span className="font-medium text-gray-700 block mb-2">
                              Configuration / Code:
                            </span>
                            <CodeBlock code={ex.codeOrConfigSnippet} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          }))}
        />
      </section>

      {/* Quiz Section */}
      {quizQuestions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-aws-dark-blue mb-6 flex items-center gap-2">
            <span className="w-1 h-7 bg-aws-orange rounded-full" />
            Test Yourself
          </h2>
          <QuizSection questions={quizQuestions} />
        </section>
      )}

      {/* Practice Scenarios Link */}
      <section className="mb-12">
        <div className="bg-aws-orange/5 border border-aws-orange/20 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-aws-dark-blue mb-2">
            Practice Scenarios
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Test your knowledge with realistic on-the-job scenarios for this pillar.
          </p>
          <Link
            to={`/scenarios?pillar=${slug}`}
            className="inline-block px-6 py-2.5 bg-aws-orange text-white rounded-lg font-medium hover:bg-aws-orange/90 transition-colors"
          >
            Practice Scenarios for {pillar.name} →
          </Link>
        </div>
      </section>
    </div>
  );
}

function QuizSection({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
    setShowResults(false);
  };

  const score = questions.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctAnswerIndex ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <div key={q.id} className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="font-medium text-gray-900 mb-3">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, idx) => {
              const isSelected = answers[q.id] === idx;
              const isCorrect = showResults && idx === q.correctAnswerIndex;
              const isWrong = showResults && isSelected && idx !== q.correctAnswerIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(q.id, idx)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm border transition-colors ${
                    isCorrect
                      ? 'bg-green-50 border-green-400 text-green-800'
                      : isWrong
                      ? 'bg-red-50 border-red-400 text-red-800'
                      : isSelected
                      ? 'bg-aws-orange/10 border-aws-orange/50 text-aws-dark-blue'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              );
            })}
          </div>
          {showResults && answers[q.id] !== undefined && (
            <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
              {q.explanation}
            </p>
          )}
        </div>
      ))}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowResults(true)}
          className="px-6 py-2.5 bg-aws-orange text-white rounded-lg font-medium hover:bg-aws-orange/90 transition-colors"
        >
          Check Answers
        </button>
        {showResults && (
          <span className="text-sm font-medium text-gray-700">
            Score: {score}/{questions.length}
          </span>
        )}
      </div>
    </div>
  );
}