import { proofDemos } from "../base/campaign";
import { trackEvent } from "../hooks/useCampaignTracking";

const ProofDemos = () => (
  <section id="proof-demos" className="campaign-section">
    <div className="section-head">
      <p className="section-kicker">Small Proofs of Value</p>
      <h2>Two practical ways to validate value before a larger engagement</h2>
      <p>
        These focused proof concepts are designed to validate the workflow, technical approach, and
        business value before committing to a broader implementation.
      </p>
    </div>

    <div className="proof-demo-grid">
      {proofDemos.map((demo) => (
        <article className="proof-demo-card" key={demo.id}>
          <span className="proof-demo-signal">{demo.signal}</span>
          <h3>{demo.title}</h3>
          <p>{demo.description}</p>
          <div className="proof-flow">
            {demo.workflow.map((step, index) => (
              <span key={step}>{index + 1}. {step}</span>
            ))}
          </div>
          <a
            href={demo.route}
            className="project-open"
            onClick={() => trackEvent("cta_click", { proof_demo: demo.id, target: demo.route })}
          >
            Ask about this proof concept
          </a>
        </article>
      ))}
    </div>
  </section>
);

export default ProofDemos;
