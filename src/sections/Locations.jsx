import { Link } from "react-router-dom"

export const locations = [
  { id: 'dach', title: "EU - DACH", description: "No Office", address: "SchafwiesenStrasse 30G, 4600 Wels, Austria", coords: [48.16500921128455, 14.051316422530224] },
  { id: 'austria', title: "Austria", description: "Main Office", address: "SchafwiesenStrasse 30G, 4600 Wels, Austria", coords: [48.16500921128455, 14.051316422530224] },
  { id: 'germany', title: "Germany", description: "No Office", address: "", coords: [48.16500921128455, 14.051316422530224] },
  { id: 'switzerland', title: "Switzerland", description: "No Office", address: "", coords: [48.16500921128455, 14.051316422530224] },
  { id: 'balkans', title: "Balkans", description: "Macedonia Offices: Bitola, Skopje, Tetovo", address: "Јавен Адвертајзинг Дооел Битола, MK, Климент Охридски 4/4, Bitola 7000, Macedonia", coords: [41.0272180, 21.3341320] },
  { id: 'usa', title: "USA", description: "No Office", address: "No Office", coords: [41.88921778493731, -87.61809182156995] },
];

const Locations = () => (
  <section id="locations" className="locations">
    <h2>Locations</h2>
    <ul>
      {locations.map((loc, idx) => (
        <li key={idx}>
          <Link to={`/locations/${loc.id}`} style={{ textDecoration: 'none', color: '#1a73e8' }}>
            {loc.title}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default Locations;