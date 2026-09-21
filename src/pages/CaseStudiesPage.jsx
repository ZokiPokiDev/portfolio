import { Link } from "react-router-dom";
import Seo, { seoConfig } from "../components/Seo";
import './CaseStudiesPage.css';

const caseStudies = [
  {
    id: 'ktm-dealer-platform',
    slug: 'ktm-dealer-platform',
    title: 'KTM Motor-Dealer Platform & Eshop',
    client: 'Automotive dealer and e-commerce platform',
    industry: 'Automotive / E-Commerce',
    summary: 'Engineering and consultancy work on a dealer management and e-commerce platform for KTM, including a mobile app and backend SAP e-commerce integration.',
    problem: 'The platform connected KTM dealers with a management portal, e-shop, and a mobile companion app, requiring coordinated work across the mobile client, backend, and SAP-based e-commerce layer.',
    constraints: [
      'Mobile app delivery alongside a backend SAP e-commerce platform',
      'Dealer-facing workflows that had to stay reliable across regions',
      'Coordination across mobile, backend, and SAP integration layers',
    ],
    solution: 'Provided consultancy services and contributed to the mobile app and the backend SAP e-commerce platform, working as a senior developer and engineer within the delivery team.',
    architecture: [
      'SAP-based backend e-commerce platform',
      'Flutter mobile companion app',
      'REST APIs connecting the mobile client and backend',
    ],
    result: [
      'Contributed to the mobile app and backend SAP e-commerce platform',
      'Supported dealer-facing workflows and e-commerce delivery',
      'Delivered within the existing team and platform constraints',
    ],
    technologies: [
      'SAP',
      'Flutter',
      'REST APIs',
    ],
  },
  {
    id: 'dach-job-portal',
    slug: 'dach-job-portal',
    title: 'Leading DACH Job Portal',
    client: 'Job search and recruitment platform, DACH region',
    industry: 'SaaS / Recruitment',
    summary: 'Contract engineering on a large DACH job search and recruitment platform, including a CMS for B2B page building and per-business mobile apps.',
    problem: 'The platform needed a maintainable CMS that supported B2B page building and mobile apps per business, on top of an existing Symfony/React stack.',
    constraints: [
      'B2B page building across multiple businesses',
      'Mobile apps per business on a shared platform',
      'Existing Symfony PHP and React.js codebase',
    ],
    solution: 'Worked as a contractor on the core and live codebase, building CMS tooling for B2B page construction and the associated mobile apps.',
    architecture: [
      'Symfony PHP framework backend with CMS',
      'React.js and Preact.js frontends',
      'React Native mobile apps per business',
      'MySQL and Redis for data and caching',
    ],
    result: [
      'Built CMS tooling for B2B page building',
      'Delivered mobile apps per business on the shared platform',
      'Worked as a contractor within the existing delivery team',
    ],
    technologies: [
      'Symfony PHP',
      'React.js',
      'Preact.js',
      'React Native',
      'MySQL',
      'Redis',
    ],
  },
  {
    id: 'ai-pdf-reader',
    slug: 'ai-pdf-reader',
    title: 'AI PDF Reader App & Web (SaaS)',
    client: 'Founder-built SaaS product',
    industry: 'AI / SaaS',
    summary: 'Code ownership and platform architecture for an AI-powered PDF reading and analysis SaaS using RAG/CAG and LangChain.',
    problem: 'The product needed grounded, citation-aware PDF analysis that could be operated as a SaaS rather than a disconnected demo.',
    constraints: [
      'Grounded answers with retrievable source context (RAG/CAG)',
      'SaaS packaging and delivery',
      'Practical LLM integration rather than a research prototype',
    ],
    solution: 'Owned the code and platform architecture, building a SaaS for PDF reading and analysis with AI-powered features built on RAG/CAG and LangChain.',
    architecture: [
      'LangChain-based RAG/CAG retrieval pipeline',
      'LLM integration for reading and analysis',
      'SaaS packaging for web delivery',
    ],
    result: [
      'Built a SaaS platform for PDF reading and analysis',
      'Implemented AI-powered features on a RAG/CAG and LangChain foundation',
      'Owned the codebase and platform architecture end to end',
    ],
    technologies: [
      'LangChain',
      'LLMs',
      'RAG / CAG',
      'SaaS',
    ],
  },
];

const CaseStudiesPage = () => {
  const seo = {
    title: 'Selected Delivery Experience | SystemPro Tech',
    description: 'Selected delivery experience across automotive, SaaS, recruitment, and AI platforms, with the engineering context behind each project.',
    canonical: 'https://www.system-pro.tech/case-studies',
    ogTitle: 'Selected Delivery Experience | SystemPro Tech',
    ogDescription: 'Engineering context behind selected projects across automotive, SaaS, recruitment, and AI delivery.',
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
        <h1>Selected Delivery Experience</h1>
        <p className="header-subtitle">
          Engineering context behind selected projects, including the scope, constraints,
          architecture, and delivery work involved.
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
        <a href="/#lead-capture" className="cta-button">
          Get in Touch
        </a>
      </footer>
    </div>
  );
};

export default CaseStudiesPage;
