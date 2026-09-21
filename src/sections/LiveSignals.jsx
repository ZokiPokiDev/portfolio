import { useSignalFeed } from "../hooks/useSignalFeed";
import {
  formatEngagement,
  getContentTypeLabel,
  groupExternalFeedItems,
  groupInternalFeedItems,
  ITEMS_PER_PROVIDER,
  SIGNAL_FEED_LIMIT,
} from "../services/signalFeed";

const statusLabels = {
  live: "updated recently",
  curated: "curated updates",
  fallback: "selected updates",
  empty: "new signals soon",
  loading: "loading updates",
};

const LiveSignals = () => {
  const { items, status } = useSignalFeed(SIGNAL_FEED_LIMIT);
  const internalGroups = groupInternalFeedItems(items);
  const providerGroups = groupExternalFeedItems(items);

  return (
    <section id="live-signals" className="live-signals">
      <div className="section-head live-signals-head">
        <div>
          <p className="section-kicker">Signals and featured work</p>
          <h2>What we're building and watching</h2>
          <p>
            Explore selected SystemPro services separately from recent engineering, social, and community updates.
          </p>
        </div>
        <span className={`feed-status ${status}`}>{statusLabels[status] || status}</span>
      </div>

      <div className="compact-feed-layout">
        {internalGroups.length > 0 && (
          <div className="main-feed-group">
            <h3 className="feed-group-title">Explore SystemPro</h3>
            <div className="main-feed-stack">
              {internalGroups.map((group) => (
                <details className="main-feed-accordion" key={group.id}>
                  <summary>
                    <span className="main-feed-summary-copy">
                      <strong>{group.label}</strong>
                      <small>Services and selected work</small>
                    </span>
                    <span className="main-feed-count">{group.items.length}</span>
                  </summary>
                  <div className="compact-signal-list">
                    {group.items.map((item) => (
                      <a
                        className="compact-signal-row"
                        data-content-type={item.content_type}
                        href={item.href}
                        key={`${item.href}-${item.title}`}
                      >
                        <span className="compact-signal-copy">
                          <span className="compact-signal-meta">{getContentTypeLabel(item)}</span>
                          <strong>{item.title}</strong>
                          <small>{item.text}</small>
                        </span>
                        <span className="compact-signal-action" aria-hidden="true">→</span>
                      </a>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        <div className="main-feed-group">
          <h3 className="feed-group-title">Live signals</h3>
          <div className="main-feed-stack">
            {providerGroups.map((group) => {
              const isCurated = group.items.every((item) => item.fallback_only);
              const visibleItems = group.items.slice(0, ITEMS_PER_PROVIDER);

              return (
                <details className="main-feed-accordion provider-feed-accordion" key={group.id}>
                  <summary>
                    <span className="main-feed-summary-copy">
                      <strong>{group.label}</strong>
                      <small className={`provider-mode ${isCurated ? "curated" : "live"}`}>
                        {isCurated ? "Curated source" : "Latest updates"}
                      </small>
                    </span>
                    <span className="main-feed-count">{visibleItems.length}</span>
                  </summary>
                  <div className="compact-signal-list">
                    {visibleItems.map((item) => {
                      const engagement = formatEngagement(item.metrics);

                      return (
                        <a
                          className="compact-signal-row"
                          data-content-type={item.content_type}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={`${item.href}-${item.title}`}
                        >
                          <span className="compact-signal-copy">
                            <span className="compact-signal-meta">
                              {getContentTypeLabel(item)} · {item.source}
                            </span>
                            <strong>{item.title}</strong>
                            {engagement && <small>{engagement}</small>}
                          </span>
                          <span className="compact-signal-action" aria-hidden="true">↗</span>
                        </a>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveSignals;
