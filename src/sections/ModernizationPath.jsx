const tracks = [
  {
    step: "01",
    title: "Digitize operations",
    text: "Replace spreadsheets, email handoffs, and manual approvals with focused workflows that match how the business already works.",
    tags: ["workflow mapping", "admin portals", "document flows"],
  },
  {
    step: "02",
    title: "Connect systems",
    text: "Build API layers, sync jobs, and dashboards around CRM, ERP, e-commerce, finance, and internal data sources.",
    tags: ["REST APIs", "queues", "PostgreSQL"],
  },
  {
    step: "03",
    title: "Add practical AI",
    text: "Use LLMs, RAG, and automation where they improve search, support, reporting, document review, or internal decision support.",
    tags: ["OpenAI", "LangChain", "RAG/CAG"],
  },
];

const ModernizationPath = () => (
  <section id="modernization" className="modernization-path">
    <div className="section-head">
      <p className="section-kicker">From campaign click to delivery plan</p>
      <h2>Modernize the business without hiding the engineering</h2>
      <p>
        The first conversation stays practical: what is slow today, what data already exists, what systems must stay,
        and where automation or AI can create measurable value.
      </p>
    </div>

    <div className="modernization-grid">
      {tracks.map((track) => (
        <article className="modernization-card" key={track.title}>
          <span className="modernization-step">{track.step}</span>
          <h3>{track.title}</h3>
          <p>{track.text}</p>
          <div className="modernization-tags">
            {track.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default ModernizationPath;
