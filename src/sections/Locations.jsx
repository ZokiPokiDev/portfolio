import { Link } from "react-router-dom";

export const locations = [
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
    id: "macedonia-balkan",
    slug: "macedonia-balkan",
    title: "Macedonia - Balkan Region Hub",
    description: "Software development and IT services hub for the Balkan region",
    address: "Street B. Toska nr. 47/13, Tetovo 1200, Macedonia",
    coords: [41.9973, 20.9678],
    seoTitle: "Macedonia Balkan IT Services | SystemPro Tech",
    seoDescription: "Software development and IT services hub in Macedonia serving the Balkan region. Expert engineering and digital transformation solutions.",
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
