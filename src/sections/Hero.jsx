import React, { useState, useEffect } from 'react';

const titles = [
  "Digitalization for business workflows",
  "AI integrations on real company data",
  "Legacy modernization without losing operations",
  "Full stack engineering and solution architecture",
  "SaaS, APIs, automation, and platform delivery",
];

const descriptions = [
  "Turn manual work, spreadsheets, and disconnected tools into stable digital workflows.",
  "Connect CRM, ERP, e-commerce, portals, documents, and APIs into one practical operating layer.",
  "Add LLMs, RAG/CAG, LangChain, and automations where they can reduce real business friction.",
  "Keep delivery grounded in production engineering: Linux, Docker, nginx, databases, monitoring, and recovery.",
];

const proofPoints = [
  { label: "15+ years", text: "software delivery" },
  { label: "AI + RAG", text: "business data workflows" },
  { label: "EU projects", text: "finance, SaaS, automotive" },
];

// Separate configs for each typing loop
const titleConfig = {
  TYPING_SPEED: 15,
  ERASING_SPEED: 15,
  DISPLAY_DELAY: 10500,
  SWITCH_DELAY: 100,
};

const descConfig = {
  TYPING_SPEED: 20,
  ERASING_SPEED: 15,
  DISPLAY_DELAY: 5000,
  SWITCH_DELAY: 60,
};

function useTypingLoop(strings, config) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout;
    const fullText = strings[idx];

    if (typing) {
      if (displayed.length < fullText.length) {
        timeout = setTimeout(
          () => setDisplayed(fullText.slice(0, displayed.length + 1)),
          config.TYPING_SPEED
        );
      } else {
        timeout = setTimeout(() => setTyping(false), config.DISPLAY_DELAY);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(
          () => setDisplayed(fullText.slice(0, displayed.length - 1)),
          config.ERASING_SPEED
        );
      } else {
        timeout = setTimeout(() => {
          setIdx((idx + 1) % strings.length);
          setTyping(true);
        }, config.SWITCH_DELAY);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, idx, strings, config]);

  return { displayed, typing };
}

const Hero = () => {
  const titleTyping = useTypingLoop(titles, titleConfig);
  const descTyping = useTypingLoop(descriptions, descConfig);

  return (
    <section id="hero" className="hero">
      <p className="hero-kicker">SystemPro Tech / Zoran Panev</p>
      <h1>Business Modernization & AI Integration</h1>

      <h2 className="hero-type">
        {titleTyping.displayed}
        <span className="typing-cursor" style={{ opacity: titleTyping.typing ? 1 : 0 }}>|</span>
      </h2>
      
      <p className="hero-description">
        {descTyping.displayed}
        <span className="typing-cursor" style={{ opacity: descTyping.typing ? 1 : 0 }}>|</span>
      </p>

      <div className="hero-actions" aria-label="Primary actions">
        <a className="hero-cta primary" href="#get-in-touch">
          Start modernization
        </a>
        <a className="hero-cta secondary" href="#projects">
          Review proof of work
        </a>
      </div>

      <div className="hero-proof" aria-label="Delivery proof points">
        {proofPoints.map((item) => (
          <div className="hero-proof-item" key={item.label}>
            <strong>{item.label}</strong>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
