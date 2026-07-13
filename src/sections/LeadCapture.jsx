import { useState } from "react";
import { getAttribution, trackEvent } from "../hooks/useCampaignTracking";

const initialForm = {
  name: "",
  email: "",
  company: "",
  region: "",
  project_type: "Modernization audit",
  budget: "",
  timeline: "",
  message: "",
  website: "",
};

const LeadCapture = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitLead(event) {
    event.preventDefault();
    setStatus("sending");

    const attribution = getAttribution();
    const payload = {
      ...form,
      path: `${window.location.pathname}${window.location.search}`,
      source: attribution.source || "",
      campaign: attribution.campaign || "",
      referrer: attribution.referrer || document.referrer || "",
    };

    fetch("/api/metrics.php?route=lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Lead submit failed");
        return response.json();
      })
      .then(() => {
        trackEvent("lead_form_success", {
          project_type: form.project_type,
          region: form.region,
          budget: form.budget,
        });
        setForm(initialForm);
        setStatus("sent");
      })
      .catch(() => {
        try {
          const pending = JSON.parse(localStorage.getItem("systempro_pending_leads") || "[]");
          pending.push({ ...payload, created_at: new Date().toISOString() });
          localStorage.setItem("systempro_pending_leads", JSON.stringify(pending.slice(-20)));
        } catch {
          // Local preview fallback is best-effort only.
        }
        trackEvent("lead_form_error", { project_type: form.project_type });
        setStatus("local");
      });
  }

  return (
    <section id="lead-capture" className="lead-capture">
      <div className="section-head">
        <p className="section-kicker">Start with enough context</p>
        <h2>Send a short project signal</h2>
        <p>
          This stores the request in the site metrics database so campaign responses can be reviewed
          before a full CRM is needed.
        </p>
      </div>

      <form className="lead-form" onSubmit={submitLead}>
        <input
          className="lead-honeypot"
          name="website"
          value={form.website}
          onChange={updateField}
          tabIndex="-1"
          autoComplete="off"
          aria-hidden="true"
        />

        <label>
          Name
          <input name="name" value={form.name} onChange={updateField} placeholder="Your name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} placeholder="name@company.com" required />
        </label>
        <label>
          Company
          <input name="company" value={form.company} onChange={updateField} placeholder="Company or project" />
        </label>
        <label>
          Region
          <select name="region" value={form.region} onChange={updateField}>
            <option value="">Select region</option>
            <option value="DACH">DACH</option>
            <option value="GCC">GCC</option>
            <option value="UK">UK</option>
            <option value="EU">EU / Remote</option>
            <option value="International">International</option>
          </select>
        </label>
        <label>
          Project type
          <select name="project_type" value={form.project_type} onChange={updateField}>
            <option>Modernization audit</option>
            <option>Rescue sprint</option>
            <option>AI / RAG pilot</option>
            <option>SaaS or dashboard build</option>
            <option>API / system integration</option>
          </select>
        </label>
        <label>
          Budget range
          <select name="budget" value={form.budget} onChange={updateField}>
            <option value="">Not sure yet</option>
            <option value="under-5k">Under 5k EUR</option>
            <option value="5k-15k">5k-15k EUR</option>
            <option value="15k-40k">15k-40k EUR</option>
            <option value="40k-plus">40k+ EUR</option>
          </select>
        </label>
        <label>
          Timeline
          <select name="timeline" value={form.timeline} onChange={updateField}>
            <option value="">Flexible</option>
            <option value="now">Now / urgent</option>
            <option value="2-4-weeks">2-4 weeks</option>
            <option value="1-3-months">1-3 months</option>
            <option value="planning">Planning phase</option>
          </select>
        </label>
        <label className="lead-message">
          What needs to change?
          <textarea
            name="message"
            value={form.message}
            onChange={updateField}
            placeholder="Shortly describe the workflow, system, app, or AI idea."
            rows="5"
            required
          />
        </label>

        <div className="lead-submit-row">
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send project signal"}
          </button>
          <span className={`lead-status ${status}`}>
            {status === "sent" && "Request stored. I will review it before replying."}
            {status === "local" && "Saved in this browser for local preview. Deploy to PHP to store server-side."}
            {status === "error" && "Could not store the request. Email is still available below."}
          </span>
        </div>
      </form>
    </section>
  );
};

export default LeadCapture;
