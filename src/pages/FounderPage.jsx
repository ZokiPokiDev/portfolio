import { Link } from "react-router-dom";
import Seo, { seoConfig } from "../components/Seo";
import './FounderPage.css';

const FounderPage = () => {
  const seo = {
    title: "Zoran Panev - Founder & Lead Engineer | SystemPro Tech",
    description: "Zoran Panev is the founder and lead engineer of SystemPro Tech, a founder-led software engineering and AI consultancy with more than 15 years of hands-on software delivery.",
    canonical: 'https://www.system-pro.tech/founder',
    ogTitle: "Zoran Panev - Founder & Lead Engineer | SystemPro Tech",
    ogDescription: "Founder-led software engineering and AI consultancy. Full-stack product engineering, modernization, APIs, cloud delivery, and practical AI integration.",
    ogUrl: 'https://www.system-pro.tech/founder',
  };

  return (
    <div className="founder-page">
      <Seo {...seoConfig.homepage} {...seo} />
      
      <Link className="topbar-link" to="/" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Back to Portfolio
      </Link>
      <div className="spacer"></div>

      <article className="founder-profile box-card">
        <header className="founder-header">
          <h1>Zoran Panev</h1>
          <p className="founder-title">Founder & Lead Engineer</p>
          <p className="founder-company">SystemPro Tech</p>
        </header>

        <section className="founder-bio">
          <h2>About Zoran</h2>
          <p>
            Zoran Panev is a senior software engineer and the founder of SystemPro Tech, a founder-led
            software engineering and AI consultancy built around more than 15 years of hands-on
            software delivery. He works across full-stack product engineering, backend and API
            architecture, cloud delivery, platform modernization, and practical AI integration.
          </p>

          <p>
            His delivery experience spans automotive, finance, e-commerce, sports, education, SaaS, and
            enterprise platforms, including work on projects associated with organizations such as KTM,
            VW (Porsche), Red Bull, DAZN, and established European digital platforms. The focus is
            pragmatic delivery: understand the existing system, identify the highest-value technical
            improvements, and implement changes that can be operated and extended by the team after
            handover.
          </p>
        </section>

        <section className="founder-expertise">
          <h2>Expertise</h2>
          <ul className="expertise-list">
            <li><strong>Full-Stack Engineering:</strong> TypeScript, React, Node.js/NestJS, and modern web platform delivery</li>
            <li><strong>Backend & API Architecture:</strong> REST APIs, integrations, and platform work across PHP, Python, and Node ecosystems</li>
            <li><strong>Legacy Modernization:</strong> Incremental modernization of existing platforms without risky big-bang rewrites</li>
            <li><strong>Practical AI Integration:</strong> RAG/CAG assistants, document intelligence, LLM-powered search, and API-based AI features</li>
            <li><strong>Cloud & DevOps:</strong> Docker, Kubernetes, CI/CD, and production delivery</li>
            <li><strong>Security & Production Readiness:</strong> Secure API patterns, dependency and vulnerability checks, and production-readiness reviews</li>
          </ul>
        </section>

        <section className="founder-credentials">
          <h2>Professional Background</h2>
          <div className="credentials-grid">
            <div className="credential-card">
              <h3>Education</h3>
              <p>Computer Science background with a focus on software engineering and distributed systems.</p>
            </div>
            <div className="credential-card">
              <h3>Industry Experience</h3>
              <p>15+ years in software development, contracting, and technical delivery across automotive, finance, e-commerce, sports, education, and SaaS.</p>
            </div>
            <div className="credential-card">
              <h3>Delivery Model</h3>
              <p>Founder-led engagement: direct ownership, focused scopes, and handover the team can extend.</p>
            </div>
          </div>
        </section>

        <section className="founder-links">
          <h2>Connect</h2>
          <div className="social-links">
            <a 
              href="https://www.linkedin.com/in/zoran-panev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              LinkedIn Profile
            </a>
            <a
              href="https://github.com/zokipokidev"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              GitHub Profile
            </a>
            <a 
              href="mailto:panev.zoran.te@gmail.com" 
              className="social-link"
            >
              Email: panev.zoran.te@gmail.com
            </a>
          </div>
        </section>

        <section className="founder-philosophy">
          <h2>Philosophy</h2>
          <p>
            <strong>"Technology should serve people, not the other way around."</strong>
          </p>
          <p>
            I believe in building software that solves real business problems,
            not just technical challenges. My approach combines deep technical work
            with a focus on delivery the team can operate and extend after handover.
          </p>
          <p>
            At SystemPro Tech, the model is founder-led: direct ownership, focused scopes, and
            practical AI and engineering work grounded in production reality rather than hype.
          </p>
        </section>

        <footer className="founder-footer">
          <Link to="/" className="cta-button">
            Back to Home
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default FounderPage;
