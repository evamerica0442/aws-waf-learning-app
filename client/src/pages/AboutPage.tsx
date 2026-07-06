import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-aws-orange hover:underline">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">About</span>
      </nav>

      <article className="prose prose-gray max-w-none">
        <h1 className="text-3xl sm:text-4xl font-bold text-aws-dark-blue mb-6">
          About the AWS Well-Architected Framework
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-aws-dark-blue mb-3">
            What is the Well-Architected Framework?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The AWS Well-Architected Framework (WAF) is a set of best practices and guidelines
            developed by Amazon Web Services to help cloud architects build secure, high-performing,
            resilient, and efficient infrastructure for their applications. It provides a consistent
            approach for evaluating and improving cloud architectures.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Based on six pillars, the framework enables you to understand the trade-offs between
            different design decisions and make informed choices that align with your business
            requirements. Each pillar covers a specific aspect of cloud architecture and includes
            design principles, definitions, and best practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-aws-dark-blue mb-3">
            The Six Pillars
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Operational Excellence</h3>
              <p className="text-gray-600 text-sm">
                Focuses on running and monitoring systems to deliver business value, and
                continually improving processes and procedures.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Security</h3>
              <p className="text-gray-600 text-sm">
                Focuses on protecting information and systems through identity and access
                management, detective controls, infrastructure protection, and data protection.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Reliability</h3>
              <p className="text-gray-600 text-sm">
                Focuses on ensuring a workload performs its intended function correctly and
                consistently when it's expected to.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Performance Efficiency</h3>
              <p className="text-gray-600 text-sm">
                Focuses on using computing resources efficiently to meet system requirements,
                and maintaining that efficiency as demand changes.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Cost Optimization</h3>
              <p className="text-gray-600 text-sm">
                Focuses on avoiding unnecessary costs, understanding spending, and using the
                most appropriate resources to maximize business value.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                Focuses on minimizing the environmental impact of cloud workloads by optimizing
                resource usage and adopting sustainable practices.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-aws-dark-blue mb-3">
            How to Use This App
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            This learning app organizes the AWS Well-Architected Framework into an easy-to-navigate
            format. Start on the homepage and select any pillar to explore its content. Each pillar
            page includes:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>Design principles from the official AWS documentation</li>
            <li>Real-world use cases with recommended approaches and AWS services</li>
            <li>Worked examples with architecture notes and configuration snippets</li>
            <li>Quiz questions to test your understanding (where available)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mb-4">
            Use the <Link to="/scenarios" className="text-aws-orange hover:underline">Practice Scenarios</Link> section
            to test your knowledge with realistic on-the-job situations. Scenarios come in two formats:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li><strong>Multiple choice</strong> — select the best answer and get instant feedback with explanations for every option</li>
            <li><strong>Open ended</strong> — write your own response, then compare against a model answer and self-rate your confidence</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            Your progress is tracked automatically in your browser — no account needed. Cross-pillar scenarios highlight
            the real-world trade-offs between pillars, such as choosing between reliability and cost, or security and performance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-aws-dark-blue mb-3">
            Additional Resources
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://aws.amazon.com/architecture/well-architected/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aws-orange hover:underline"
              >
                AWS Well-Architected Framework Homepage
              </a>
            </li>
            <li>
              <a
                href="https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aws-orange hover:underline"
              >
                Official Documentation
              </a>
            </li>
            <li>
              <a
                href="https://aws.amazon.com/architecture/well-architected/well-architected-framework-pillars/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aws-orange hover:underline"
              >
                Pillar Whitepapers
              </a>
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}