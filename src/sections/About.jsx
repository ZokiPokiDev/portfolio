import Industries from './Industries';
import Services from './Services';

const About = () => (
  <section id="about" className="about">
    <h2>About Us</h2>
    <p>
      SystemPro Tech is a founder-led software engineering and AI consultancy built around more than 15
      years of hands-on software delivery. We work across full-stack product engineering, backend and
      API architecture, cloud delivery, platform modernization, and practical AI integration.
    </p>
    <p>
      Our founder's delivery experience spans automotive, finance, e-commerce, sports, education, SaaS,
      and enterprise platforms, including work on projects associated with organizations such as
      <strong> KTM, VW (Porsche), Red Bull, DAZN</strong>, and established European digital platforms. The focus
      is pragmatic delivery: understand the existing system, identify the highest-value technical
      improvements, and implement changes that can be operated and extended by the team after handover.
    </p>
    <br />

    <h3>AI & Advanced Integrations</h3>
    <p>
      We design and integrate AI capabilities around existing business data and workflows, including
      RAG/CAG knowledge assistants, document intelligence, LLM-powered search, internal support tools,
      and API-based AI features. The emphasis is on grounded context, controlled data access,
      evaluation, human review where appropriate, and integration with the systems your teams already
      use.
    </p>
    <br />

    <h3>Security & Production Readiness</h3>
    <p>
      Security is treated as part of architecture and delivery rather than a separate final step. Our work
      can include authentication and authorization design, secure API patterns, secrets and environment
      management, dependency and vulnerability checks, CI/CD security controls, infrastructure hardening,
      observability, and production-readiness reviews.
    </p>
    <p>
      Where deeper security assessment is required, we can support vulnerability analysis,
      penetration-testing workflows, cloud and network hardening, and security-focused remediation as
      part of a broader engineering engagement. Supporting tooling we work with includes
      <strong> Snyk, Okta, Sophos, CrowdStrike, and Palo Alto</strong>, alongside Kali Linux for assessment work.
    </p>
    <br />

    <Industries />
    <Services />
  </section>
);

export default About;