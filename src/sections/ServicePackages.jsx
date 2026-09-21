import { servicePackages } from "../base/campaign";
import { trackEvent } from "../hooks/useCampaignTracking";

const ServicePackages = () => (
  <section id="packages" className="campaign-section">
    <div className="section-head">
      <p className="section-kicker">Start with a controlled scope</p>
      <h2>Start with a controlled scope</h2>
      <p>
        Begin with one audit, rescue sprint, or AI pilot. The first engagement is designed to create
        useful technical output quickly and establish a clear basis for the next delivery phase.
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
