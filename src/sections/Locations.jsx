import { Link } from "react-router-dom";

export const locations = [
  {
    id: "austria-ai-integration",
    slug: "austria-ai-integration",
    title: "Austria - AI Integration & Software Modernization",
    description: "Main Office - AI integration and legacy software modernization services in Austria",
    address: "SchafwiesenStrasse 30G, 4600 Wels, Austria",
    coords: [48.16500921128455, 14.051316422530224],
    seoTitle: "AI Integration Austria | SystemPro Tech",
    seoDescription: "Expert AI integration and software modernization services in Austria. Connect with our Wels office for European AI and legacy system transformation projects.",
  },
  {
    id: "dach-software-modernization",
    slug: "dach-software-modernization",
    title: "DACH Region - Software Modernization Hub",
    description: "Software modernization and digital transformation services across Germany, Austria, and Switzerland",
    address: "SchafwiesenStrasse 30G, 4600 Wels, Austria",
    coords: [48.16500921128455, 14.051316422530224],
    seoTitle: "DACH Software Modernization | SystemPro Tech",
    seoDescription: "Software modernization services for the DACH region (Germany, Austria, Switzerland). Legacy system transformation and digital transformation expertise.",
  },
  {
    id: "germany-business-automation",
    slug: "germany-business-automation",
    title: "Germany - Business Process Automation",
    description: "Business workflow automation and process optimization services in Germany",
    address: "Remote delivery with local partnership",
    coords: [51.1657, 10.4515],
    seoTitle: "Business Automation Germany | SystemPro Tech",
    seoDescription: "Business process automation and workflow optimization services in Germany. Automate operations, reduce costs, and improve efficiency with our expert team.",
  },
  {
    id: "switzerland-ai-consulting",
    slug: "switzerland-ai-consulting",
    title: "Switzerland - AI Consulting & Strategy",
    description: "AI strategy, consulting, and implementation services for Swiss enterprises",
    address: "Remote delivery with local partnership",
    coords: [46.8182, 8.2275],
    seoTitle: "AI Consulting Switzerland | SystemPro Tech",
    seoDescription: "AI consulting and strategy services in Switzerland. Expert guidance on AI adoption, implementation, and integration for Swiss businesses.",
  },
];

const Locations = () => (
  <section id="locations" className="locations">
    <h2>Locations</h2>
    <ul>
      {locations.map((loc, idx) => (
        <li key={idx}>
          <Link to={`/locations/${loc.slug}`} style={{ textDecoration: 'none', color: '#1a73e8' }}>
            {loc.title}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default Locations;
