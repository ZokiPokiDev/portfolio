import ktmLogo from '../assets/ktm.svg';
import volkswagenLogo from '../assets/volkswagen.svg';
import redbullLogo from '../assets/redbull.svg';
import daznLogo from '../assets/dazn.svg';
import planetLogo from '../assets/planet.svg';
import ivoteLogo from '../assets/ivote.png';
import whmcsLogo from '../assets/whmcs.jpg';
import advivusLogo from '../assets/advivus.jpeg';

const projects = [
  {
    name: "KTM Motor-Dealer Platform & Eshop",
    description: "E-commerce and management platform for KTM dealers, including a mobile app.",
    tech: "[Senior developer & engineer] Flutter, APIs",
    image: ktmLogo,
  },
  {
    name: "VW (Porsche)",
    description: "Automotive platform for VW/Porsche (details as allowed).",
    tech: "[Senior developer & engineer]",
    image: volkswagenLogo,
  },
  {
    name: "Parliamentary Elections Platform",
    description: "Voting platform for London, EU, Balkan, S. America regions.",
    tech: "[Senior developer & engineer]",
    image: ivoteLogo,
  },
  {
    name: "Finance Sector API Systems & Payment Gateway",
    description: "Secure APIs and payment gateway solutions for finance sector.",
    tech: "[Lead engineer & architect]",
    image: planetLogo,
  },
  {
    name: "Red-Bull Salzburg",
    description: "Sports platform and apps for Red-Bull Salzburg.",
    tech: "[Lead engineer & architect]",
    image: redbullLogo,
  },
  {
    name: "Leading DACH Job Portal",
    description: "Job search and recruitment platform for DACH region.",
    tech: "[Lead engineer & architect]",
  },
  {
    name: "WHMCS Hosting Platform",
    description: "Hosting automation and management platform.",
    tech: "[Lead engineer & architect]",
    image: whmcsLogo,
  },
  {
    name: "European E-Commerce Businesses",
    description: "Various e-commerce business platforms.",
    tech: "[Lead engineer & architect]",
  },
  {
    name: "Email Campaign Platform (SaaS)",
    description: "Bulk email, analytics, and automation SaaS.",
    tech: "[Code owner, Platform architect]",
    image: advivusLogo,
  },
  {
    name: "AI PDF Reader App & Web (SaaS)",
    description: "AI-powered PDF reading and analysis app using RAG/CAG and LangChain.",
    tech: "LangChain, LLMs, SaaS",
  },
  {
    name: "DAZN Mobile App",
    description: "Sports streaming mobile application.",
    tech: "[Lead mobile developer] React Native, APIs",
    image: daznLogo,
  },
  {
    name: "Business Locator",
    description: "Map geolocation with google maps and geofire for business discovery.",
    tech: "React Native, Geofire, Google Maps API",
  },
  {
    name: "E-learning App (B2B)",
    description: "Education platform for B2B clients.",
    tech: "[Lead engineer & architect] React Native, APIs",
  },
];

const Projects = () => (
  <section className="projects">
    <h2>Projects</h2>
    <ul>
      {projects.map((proj, idx) => (
        <li key={idx}>
          {proj.image && (
            <img
              src={proj.image}
              alt={`${proj.name} logo`}
              style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '0.5em' }}
            />
          )}
          <h3>{proj.name}</h3>
          <p>{proj.description}</p>
          <span className="tech">{proj.tech}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default Projects;