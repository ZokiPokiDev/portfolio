import { servicePackages } from "../base/campaign";
import { trackEvent } from "../hooks/useCampaignTracking";

const ServicePackages = () => (
  <section id="packages" className="campaign-section">
    <div className="section-head">
      <p className="section-kicker">Simple first engagement</p>
      <h2>Start with a controlled scope</h2>
      <p>
        The goal is to make the first collaboration easy to approve: one audit, one rescue sprint,
        or one AI pilot before expanding into a larger delivery roadmap.
      </p>
    </div>

    <div className="package-grid">
      {servicePackages.map((service) => (
        <article className="package-card" key={service.id}>
          <div className="package-card-head">
            <h3>{service.title}</h3>
            <span>{service.timeframe}</span>
          </div>
          <p>{service.description}</p>
          <ul>
            {service.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
          <small>{service.bestFor}</small>
          <a
            href="#lead-capture"
            className="project-open"
            onClick={() => trackEvent("cta_click", { package: service.id, target: "lead-capture" })}
          >
            Discuss this package
          </a>
        </article>
      ))}
    </div>
  </section>
);

export default ServicePackages;
