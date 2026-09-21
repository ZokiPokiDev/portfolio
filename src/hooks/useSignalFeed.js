import { useEffect, useMemo, useState } from "react";
import { mergeFeedItems, normalizeFeedItem } from "../services/signalFeed";

export const fallbackFeedItems = [
  {
    source: "Now",
    kind: "offer",
    content_type: "offer",
    origin: "internal",
    title: "AI modernization lab",
    text: "Preparing practical assistants for project notes, documents, support flows, and business operations.",
    href: "#lead-capture",
  },
  {
    source: "LinkedIn / pinned",
    kind: "social",
    provider: "linkedin",
    content_type: "post",
    fallback_only: true,
    title: "Business digitalization offer",
    text: "A concise entry point for modernization, integrations, and AI adoption.",
    href: "https://linkedin.com/in/zoranpanev",
  },
  {
    source: "GitHub",
    kind: "github",
    provider: "github",
    content_type: "repository",
    fallback_only: true,
    title: "Engineering activity",
    text: "Public code, experiments, and technical references.",
    href: "https://github.com/zokipokidev",
  },
];

export function useSignalFeed(limit = 40) {
  const [backendItems, setBackendItems] = useState([]);
  const [curatedItems, setCuratedItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const backendRequest = fetch(`/api/feed.php?route=items&limit=${limit}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        if (!response.ok) throw new Error("Feed backend unavailable");
        return response.json();
      });

    const curatedRequest = fetch("/signal-feed.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Curated feed unavailable");
        return response.json();
      });

    Promise.allSettled([backendRequest, curatedRequest]).then(([backendResult, curatedResult]) => {
      if (!active) return;

      const backendPayload = backendResult.status === "fulfilled" ? backendResult.value : null;
      const backend = Array.isArray(backendPayload?.items)
        ? backendPayload.items.map(normalizeFeedItem)
        : [];
      const curatedPayload = curatedResult.status === "fulfilled" ? curatedResult.value : null;
      const curated = Array.isArray(curatedPayload) ? curatedPayload.map(normalizeFeedItem) : [];
      const hasLiveExternalItems = backend.some((item) => item.origin === "external");

      setBackendItems(backend);
      setCuratedItems(curated);
      setStatus(hasLiveExternalItems ? "live" : backend.length || curated.length ? "curated" : "fallback");
    });

    return () => {
      active = false;
      controller.abort();
    };
  }, [limit]);

  const items = useMemo(() => {
    const merged = mergeFeedItems(backendItems, curatedItems);
    const sourceItems = merged.length ? merged : fallbackFeedItems.map(normalizeFeedItem);
    return sourceItems.slice(0, limit);
  }, [backendItems, curatedItems, limit]);

  return { items, status };
}
