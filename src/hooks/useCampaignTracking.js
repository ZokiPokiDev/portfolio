import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ATTRIBUTION_KEY = "systempro_campaign_attribution";

function readStoredAttribution() {
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getAttribution() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const current = {
    source: params.get("utm_source") || params.get("source") || "",
    medium: params.get("utm_medium") || "",
    campaign: params.get("utm_campaign") || params.get("campaign") || "",
    region: params.get("region") || "",
    term: params.get("utm_term") || "",
    content: params.get("utm_content") || "",
    referrer: document.referrer || "",
  };

  const hasCurrent = Object.values(current).some(Boolean);
  if (hasCurrent) {
    const merged = { ...readStoredAttribution(), ...current };
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(merged));
    return merged;
  }

  return readStoredAttribution();
}

export function trackEvent(eventName, metadata = {}) {
  if (typeof window === "undefined") return;

  const attribution = getAttribution();
  const payload = {
    event: eventName,
    path: `${window.location.pathname}${window.location.search}`,
    source: attribution.source || "",
    campaign: attribution.campaign || "",
    region: attribution.region || "",
    referrer: attribution.referrer || document.referrer || "",
    metadata: {
      medium: attribution.medium || "",
      term: attribution.term || "",
      content: attribution.content || "",
      ...metadata,
    },
  };

  const body = JSON.stringify(payload);
  const endpoint = "/api/metrics.php?route=event";

  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function useCampaignTracking() {
  const location = useLocation();

  useEffect(() => {
    trackEvent("page_view", {
      title: document.title,
    });
  }, [location.pathname, location.search]);
}
