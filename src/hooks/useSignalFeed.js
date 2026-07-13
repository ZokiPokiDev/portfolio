import { useEffect, useMemo, useState } from "react";

export const fallbackFeedItems = [
  {
    source: "Now",
    title: "AI modernization lab",
    text: "Preparing practical assistants for project notes, documents, support flows, and business operations.",
    href: "#lead-capture",
  },
  {
    source: "LinkedIn / pinned",
    title: "Business digitalization offer",
    text: "A concise campaign entry point for modernization, integrations, and AI adoption.",
    href: "https://linkedin.com/in/zoranpanev",
  },
  {
    source: "GitHub",
    title: "Engineering activity",
    text: "Public code, experiments, and technical references.",
    href: "https://github.com/zokipokidev",
  },
];

function normalizeItem(item) {
  return {
    source: item.source || "Signal",
    title: item.title || "Current update",
    text: item.text || item.summary || "Latest public activity and campaign signal.",
    href: item.href || "#get-in-touch",
    published_at: item.published_at || null,
    kind: item.kind || "manual",
  };
}

export function useSignalFeed(limit = 5) {
  const [backendItems, setBackendItems] = useState([]);
  const [curatedItems, setCuratedItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/feed.php?route=items&limit=${limit}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Feed backend unavailable");
        return response.json();
      })
      .then((payload) => {
        const items = Array.isArray(payload?.items) ? payload.items : [];
        setBackendItems(items.map(normalizeItem));
        setStatus(items.length ? "live" : "empty");
      })
      .catch(() => {
        fetch("/signal-feed.json", { signal: controller.signal })
          .then((response) => {
            if (!response.ok) throw new Error("Curated feed unavailable");
            return response.json();
          })
          .then((items) => {
            const curated = Array.isArray(items) ? items.map(normalizeItem) : [];
            setCuratedItems(curated);
            setStatus(curated.length ? "curated" : "fallback");
          })
          .catch(() => setStatus("fallback"));
      });

    return () => controller.abort();
  }, [limit]);

  const items = useMemo(() => {
    const merged = backendItems.length ? backendItems : curatedItems;
    return (merged.length ? merged : fallbackFeedItems).slice(0, limit);
  }, [backendItems, curatedItems, limit]);

  return { items, status };
}
