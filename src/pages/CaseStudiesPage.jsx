import { Link } from "react-router-dom";
import Seo, { seoConfig } from "../components/Seo";
import './CaseStudiesPage.css';

const caseStudies = [
  {
    id: 'finance-ai-assistant',
    slug: 'finance-ai-assistant',
    title: 'AI Assistant for Financial Services - Secure Document Intelligence',
    client: 'Confidential - European Financial Institution',
    industry: 'Finance',
    summary: 'Implemented a private RAG assistant that searches internal documents while preserving access permissions and citing source materials.',
    problem: 'A European bank needed to provide AI-powered document search for internal knowledge bases while maintaining strict security, compliance, and access control requirements.',
    constraints: [
      'GDPR and financial regulations compliance',
      'Document-level access permissions must be preserved',
      'No data can leave the private cloud environment',
      'All responses must cite source documents',
      'Integration with existing identity management system',
      'Support for multiple document formats (PDF, Word, Excel, emails)',
    ],
    solution: 'Built a private RAG (Retrieval-Augmented Generation) assistant deployed in the bank\'s Azure environment with the following capabilities:',
    architecture: [
      'Azure Kubernetes Service for container orchestration',
      'Azure Cognitive Search for document indexing',
      'Azure OpenAI Service for LLM inference',
      'Azure Key Vault for secrets management',
      'Custom API gateway for access control',
      'Frontend integration with existing portal',
    ],
    result: [
      'Reduced document search time from 20+ minutes to under 30 seconds',
      '100% compliance with GDPR and financial regulations',
      '95% accuracy in source document citation',
      'Seamless integration with existing identity system',
      'Scalable to millions of documents',
    ],
    technologies: [
      'Azure Kubernetes Service',
      'Azure Cognitive Search',
      'Azure OpenAI',
      'React',
      'Node.js',
      'TypeScript',
      'Keycloak',
    ],
  },
  {
    id: 'logistics-route-optimization',
    slug: 'logistics-route-optimization',
    title: 'AI-Powered Route Optimization for Transportation Fleet',
    client: 'Confidential - Austrian Logistics Provider',
    industry: 'Transport & Logistics',
    summary: 'Developed a route optimization system that reduced fuel costs by 15% and improved delivery times across a fleet of 200+ vehicles.',
    problem: 'A logistics company with 200+ vehicles needed to optimize daily routes considering traffic patterns, delivery windows, vehicle capacities, and driver schedules.',
    constraints: [
      'Real-time traffic data integration',
      'Driver working hour regulations',
      'Vehicle capacity and weight limits',
      'Customer delivery time windows',
      'Multi-depot operations',
      'Integration with existing fleet management system',
    ],
    solution: 'Implemented an AI-powered route optimization engine that uses machine learning to predict optimal routes based on historical data and real-time conditions.',
    architecture: [
      'Microservices architecture with Docker containers',
      'Google Maps API for real-time traffic',
      'PostgreSQL with PostGIS for geospatial queries',
      'Python ML models for route prediction',
      'Redis for caching frequently accessed routes',
      'React dashboard for dispatchers',
    ],
    result: [
      '15% reduction in fuel costs',
      '20% improvement in on-time deliveries',
      '30% reduction in driver overtime',
      'Real-time route adjustments for traffic changes',
      'Integration with existing telematics systems',
    ],
    technologies: [
      'Docker',
      'Kubernetes',
      'Python',
      'Google Maps API',
      'PostgreSQL/PostGIS',
      'Redis',
      'React',
      'FastAPI',
    ],
  },
  {
    id: 'ecommerce-ai-search',
    slug: 'ecommerce-ai-search',
    title: 'AI-Powered Product Search for E-Commerce Platform',
    client: 'Confidential - European Retailer',
    industry: 'E-Commerce',
    summary: 'Implemented semantic search and recommendation system that increased conversion rates by 25%.',
    problem: 'An e-commerce platform with 50,000+ products needed to improve search relevance and provide personalized recommendations to increase sales.',
    constraints: [
      'Handle typos and natural language queries',
      'Personalize results for each user',
      'Maintain sub-second response times',
      'Scale to peak holiday traffic',
      'Integrate with existing product catalog',
    ],
    solution: 'Built a hybrid search system combining semantic search with traditional keyword search, plus a recommendation engine based on user behavior.',
    architecture: [
      'Elasticsearch for product indexing',
      'AI embedding models for semantic search',
      'User behavior tracking pipeline',
      'Collaborative filtering for recommendations',
      'CDN for fast delivery',
      'A/B testing framework',
    ],
    result: [
      '25% increase in conversion rate',
      '40% improvement in search result relevance',
      '30% increase in average order value from recommendations',
      'Sub-200ms response times at scale',
      'Successfully handled Black Friday traffic (10x normal load)',
    ],
    technologies: [
      'Elasticsearch',
      'Python',
      'TensorFlow',
      'Redis',
      'React',
      'Node.js',
      'Kafka',
    ],
  },
];

const CaseStudiesPage = () => {
  const seo = {
    title: 'Case Studies | SystemPro Tech',
    description: 'Explore our technical case studies showcasing AI integration, legacy modernization, and digital transformation projects with measurable outcomes.',
    canonical: 'https://www.system-pro.tech/case-studies',
    ogTitle: 'Technical Case Studies | SystemPro Tech',
    ogDescription: 'Real-world examples of AI integration, software modernization, and business automation projects with concrete engineering details and measurable results.',
    ogUrl: 'https://www.system-pro.tech/case-studies',
  };

  return (
    <div className="case-studies-page">
      <Seo {...seoConfig.homepage} {...seo} />
      
      <Link className="topbar-link" to="/" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Back to Portfolio
      </Link>
      <div className="spacer"></div>

      <header className="case-studies-header">
        <h1>Technical Case Studies</h1>
        <p className="header-subtitle">
          Real projects. Measurable outcomes. Concrete engineering details.
        </p>
      </header>

      <div className="case-studies-list">
        {caseStudies.map((study, index) => (
          <article key={study.id} className="case-study-card box-card">
            <header className="case-study-header">
              <h2>
                <span className="case-number">Case {index + 1}</span>
                {study.title}
              </h2>
              <div className="case-meta">
                <span className="case-client">{study.client}</span>
                <span className="case-industry">{study.industry}</span>
              </div>
            </header>

            <div className="case-content">
              <section className="case-section">
                <h3>Problem</h3>
                <p>{study.problem}</p>
              </section>

              <section className="case-section">
                <h3>Constraints</h3>
                <ul>
                  {study.constraints.map((constraint, i) => (
                    <li key={i}>{constraint}</li>
                  ))}
                </ul>
              </section>

              <section className="case-section">
                <h3>Solution</h3>
                <p>{study.solution}</p>
              </section>

              <section className="case-section">
                <h3>Architecture</h3>
                <ul>
                  {study.architecture.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="case-section">
                <h3>Results</h3>
                <ul className="results-list">
                  {study.result.map((result, i) => (
                    <li key={i} className="result-item">{result}</li>
                  ))}
                </ul>
              </section>

              <section className="case-section">
                <h3>Technologies</h3>
                <div className="tech-tags">
                  {study.technologies.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </section>
            </div>

            <footer className="case-footer">
              <Link to={`/case-studies/${study.slug}`} className="read-more-link">
                Read full case study →
              </Link>
            </footer>
          </article>
        ))}
      </div>

      <footer className="case-studies-footer">
        <p>Want to discuss a similar project for your business?</p>
        <Link to="#lead-capture" className="cta-button">
          Get in Touch
        </Link>
      </footer>
    </div>
  );
};

export default CaseStudiesPage;
