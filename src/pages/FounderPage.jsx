import { Link } from "react-router-dom";
import Seo, { seoConfig } from "../components/Seo";
import './FounderPage.css';

const FounderPage = () => {
  const seo = {
    title: "Zoran Panev - Founder & CEO | SystemPro Tech",
    description: "Zoran Panev is the founder and CEO of SystemPro Tech, with over 20 years of experience in software engineering, AI integration, and digital transformation.",
    canonical: 'https://www.system-pro.tech/founder',
    ogTitle: "Zoran Panev - Founder & CEO | SystemPro Tech",
    ogDescription: "Experienced software engineer and AI specialist helping European businesses modernize their digital platforms.",
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
          <p className="founder-title">Founder & Chief Engineer</p>
          <p className="founder-company">SystemPro Tech</p>
        </header>

        <section className="founder-bio">
          <h2>About Zoran</h2>
          <p>
            Zoran Panev is a seasoned software engineer and digital transformation specialist 
            with over two decades of experience building enterprise-grade applications and AI systems. 
            As the founder of SystemPro Tech, he leads a team of expert engineers helping European 
            businesses modernize legacy systems, integrate AI capabilities, and automate business workflows.
          </p>
          
          <p>
            With a strong background in cloud architecture, API design, and full-stack development, 
            Zoran has successfully delivered complex projects for clients across multiple industries, 
            including finance, logistics, e-commerce, and telecommunications.
          </p>
        </section>

        <section className="founder-expertise">
          <h2>Expertise</h2>
          <ul className="expertise-list">
            <li><strong>AI Integration:</strong> Building production-grade AI systems, RAG assistants, and automation solutions</li>
            <li><strong>Legacy Modernization:</strong> Transforming monolithic applications into modern, scalable architectures</li>
            <li><strong>Cloud Architecture:</strong> Designing and implementing cloud-native solutions on AWS, Azure, and GCP</li>
            <li><strong>API Design:</strong> RESTful and GraphQL API development with best practices</li>
            <li><strong>Digital Transformation:</strong> Helping enterprises adopt new technologies and processes</li>
            <li><strong>Team Leadership:</strong> Building and mentoring high-performing engineering teams</li>
          </ul>
        </section>

        <section className="founder-credentials">
          <h2>Professional Background</h2>
          <div className="credentials-grid">
            <div className="credential-card">
              <h3>Education</h3>
              <p>Computer Science degree with focus on software engineering and distributed systems</p>
            </div>
            <div className="credential-card">
              <h3>Certifications</h3>
              <ul>
                <li>AWS Certified Solutions Architect</li>
                <li>Microsoft Certified: Azure Solutions Architect</li>
                <li>Google Professional Cloud Architect</li>
              </ul>
            </div>
            <div className="credential-card">
              <h3>Industry Experience</h3>
              <p>20+ years in software development, consulting, and technical leadership</p>
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
              href="https://github.com/zoranpanev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              GitHub Profile
            </a>
            <a 
              href="mailto:zoran.panev@gmail.com" 
              className="social-link"
            >
              Email: zoran.panev@gmail.com
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
            not just technical challenges. My approach combines deep technical expertise 
            with a focus on delivering measurable business value.
          </p>
          <p>
            At SystemPro Tech, we don't just write code - we help our clients transform 
            their operations, improve efficiency, and unlock new capabilities through 
            strategic technology adoption.
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
