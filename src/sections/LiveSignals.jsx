import { useSignalFeed } from "../hooks/useSignalFeed";

const statusLabels = {
  live: "live backend",
  curated: "curated fallback",
  fallback: "local fallback",
  empty: "waiting for sources",
  loading: "loading",
};

const LiveSignals = () => {
  const { items, status } = useSignalFeed(6);

  return (
    <section id="live-signals" className="live-signals">
      <div className="section-head live-signals-head">
        <div>
          <p className="section-kicker">Campaign signal feed</p>
          <h2>Recent public updates and market signals</h2>
          <p>
            A lightweight feeder can collect curated campaign posts, public RSS sources, GitHub activity,
            and later authenticated LinkedIn or X API data through the PHP backend.
          </p>
        </div>
        <span className={`feed-status ${status}`}>{statusLabels[status] || status}</span>
      </div>

      <div className="live-signal-grid">
        {items.map((item) => (
          <a
            className="live-signal-card"
            href={item.href}
            target={item.href.startsWith("#") ? undefined : "_blank"}
            rel={item.href.startsWith("#") ? undefined : "noopener noreferrer"}
            key={`${item.source}-${item.title}`}
          >
            <span>{item.source}</span>
            <strong>{item.title}</strong>
            <small>{item.text}</small>
          </a>
        ))}
      </div>
    </section>
  );
};

export default LiveSignals;
