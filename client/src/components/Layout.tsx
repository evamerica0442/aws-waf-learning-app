import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

const pillars = [
  { slug: 'operational-excellence', name: 'Operational Excellence' },
  { slug: 'security', name: 'Security' },
  { slug: 'reliability', name: 'Reliability' },
  { slug: 'performance-efficiency', name: 'Performance Efficiency' },
  { slug: 'cost-optimization', name: 'Cost Optimization' },
  { slug: 'sustainability', name: 'Sustainability' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-aws-dark-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="text-aws-orange text-2xl font-bold">AWS</span>
              <span className="text-white/90 text-lg font-medium hidden sm:inline">Well-Architected Framework</span>
              <span className="text-white/90 text-lg font-medium sm:hidden">WAF</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {pillars.map((p) => (
                <Link
                  key={p.slug}
                  to={`/pillars/${p.slug}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === `/pillars/${p.slug}`
                      ? 'bg-aws-orange/20 text-aws-orange'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p.name}
                </Link>
              ))}
              <Link
                to="/scenarios"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/scenarios')
                    ? 'bg-aws-orange/20 text-aws-orange'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Scenarios
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/about'
                    ? 'bg-aws-orange/20 text-aws-orange'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                About
              </Link>
            </nav>
            {/* Mobile menu button */}
            <details className="md:hidden relative">
              <summary className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer list-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Menu
              </summary>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                {pillars.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/pillars/${p.slug}`}
                    className={`block px-4 py-2 text-sm ${
                      location.pathname === `/pillars/${p.slug}`
                        ? 'bg-aws-orange/10 text-aws-orange font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p.name}
                  </Link>
                ))}
                <hr className="my-2 border-gray-200" />
                <Link
                  to="/scenarios"
                  className={`block px-4 py-2 text-sm ${
                    location.pathname.startsWith('/scenarios')
                      ? 'bg-aws-orange/10 text-aws-orange font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Scenarios
                </Link>
                <Link
                  to="/about"
                  className={`block px-4 py-2 text-sm ${
                    location.pathname === '/about'
                      ? 'bg-aws-orange/10 text-aws-orange font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  About
                </Link>
              </div>
            </details>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-aws-dark-blue text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>AWS Well-Architected Framework Learning App</p>
          <p className="mt-1">
            Content based on the{' '}
            <a
              href="https://aws.amazon.com/architecture/well-architected/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-aws-orange hover:underline"
            >
              AWS Well-Architected Framework
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}