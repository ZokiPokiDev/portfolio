import React, { useState, useEffect } from 'react';

const titles = [
  "Full Stack Engineering",
  "AI/LLM Engineering & Architecture",
  "Lead Software Engineering & Solution Architecture",
  "AI Platform Specialization",
  "SaaS & API Integration Expertise",
];

const descriptions = [
  "Building modern web, mobile, and AI-powered solutions for global brands and startups.",
  "Delivering enterprise SaaS and API integrations with AI/LLM technologies.",
  "Crafting scalable platforms for e-commerce, finance, logistics, and automotive sectors.",
  "Specializing in RAG/CAG, LangChain, and advanced AI response reasoning.",
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
      <h1>Professional Software Solutions</h1>

      <h2 style={{ minHeight: '2.5em', fontFamily: 'monospace', fontWeight: 400 }}>
        {titleTyping.displayed}
        <span className="typing-cursor" style={{ opacity: titleTyping.typing ? 1 : 0 }}>|</span>
      </h2>
      
      <p style={{ minHeight: '3em', fontFamily: 'monospace', fontSize: '1.2em' }}>
        {descTyping.displayed}
        <span className="typing-cursor" style={{ opacity: descTyping.typing ? 1 : 0 }}>|</span>
      </p>
    </section>
  );
};

export default Hero;