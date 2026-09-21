const INTERNAL_GROUP_DEFINITIONS = [
  { id: "offers", label: "Offers", kinds: ["offer"], open: true },
  { id: "regions", label: "Regional pages", kinds: ["regional"] },
  { id: "posts", label: "Posts and notes", kinds: ["post", "manual"] },
];

const PROVIDER_DEFINITIONS = [
  { id: "linkedin", label: "LinkedIn", kinds: ["linkedin", "social"] },
  { id: "github", label: "GitHub", kinds: ["github"] },
  { id: "reddit", label: "Reddit", kinds: ["reddit", "rss"] },
  { id: "hackernews", label: "Hacker News", kinds: ["hackernews"] },
  { id: "x", label: "X", kinds: ["x"] },
  { id: "discord", label: "Discord", kinds: ["discord"] },
];

const CONTENT_TYPE_LABELS = {
  ad: "Ad",
  discussion: "Discussion",
  offer: "Offer",
  post: "Post",
  regional: "Region",
  repository: "Repository",
  update: "Update",
};

export const ITEMS_PER_PROVIDER = 5;
export const SIGNAL_FEED_LIMIT = 40;

function isInternalHref(href) {
  return href.startsWith("#") || href.startsWith("/");
}

function findProviderFromSource(item) {
  const searchable = `${item.provider || ""} ${item.kind || ""} ${item.source || ""} ${item.href || ""}`.toLowerCase();
  const match = PROVIDER_DEFINITIONS.find((provider) =>
    provider.kinds.some((token) => searchable.includes(token)),
  );

  return match?.id || "community";
}

function inferContentType(item, origin) {
  if (item.content_type) return item.content_type;
  if (item.promoted) return "ad";
  if (["offer", "regional", "post"].includes(item.kind)) return item.kind;
  if (item.kind === "github") return "repository";
  if (["rss", "hackernews", "reddit", "discord"].includes(item.kind)) return "discussion";
  return origin === "internal" ? "post" : "update";
}

export function normalizeFeedItem(item = {}) {
  const href = item.href || "#get-in-touch";
  const origin = item.origin || (isInternalHref(href) ? "internal" : "external");

  return {
    source: item.source || "Signal",
    title: item.title || "Current update",
    text: item.text || item.summary || "Latest public activity and engineering updates.",
    href,
    published_at: item.published_at || null,
    kind: item.kind || "manual",
    origin,
    provider: findProviderFromSource(item),
    content_type: inferContentType(item, origin),
    promoted: Boolean(item.promoted),
    featured: Boolean(item.featured),
    fallback_only: Boolean(item.fallback_only),
    metrics: item.metrics && typeof item.metrics === "object" ? item.metrics : {},
  };
}

function feedItemIdentity(item) {
  return `${item.href}::${item.title}`;
}

export function mergeFeedItems(primaryItems, fallbackItems) {
  const merged = [...primaryItems];
  const identities = new Set(merged.map(feedItemIdentity));

  fallbackItems.forEach((item) => {
    const identity = feedItemIdentity(item);
    const providerAlreadyAvailable = item.fallback_only
      && item.origin === "external"
      && merged.some((candidate) => candidate.origin === "external" && candidate.provider === item.provider);

    if (!identities.has(identity) && !providerAlreadyAvailable) {
      merged.push(item);
      identities.add(identity);
    }
  });

  return merged;
}

export function isInternalFeedItem(item) {
  return item?.origin === "internal" || isInternalHref(item?.href || "");
}

function groupByDefinitions(items, definitions, getItemGroup) {
  const remaining = [...items];
  const groups = definitions.map((definition) => {
    const groupItems = remaining.filter((item) => getItemGroup(item, definition));

    groupItems.forEach((item) => {
      const index = remaining.indexOf(item);
      if (index >= 0) remaining.splice(index, 1);
    });

    return { ...definition, items: groupItems };
  });

  if (remaining.length) {
    groups.push({ id: "other", label: "Other updates", items: remaining });
  }

  return groups.filter((group) => group.items.length > 0);
}

export function groupInternalFeedItems(items) {
  return groupByDefinitions(
    items.filter(isInternalFeedItem),
    INTERNAL_GROUP_DEFINITIONS,
    (item, definition) => definition.kinds.includes(item.kind),
  );
}

export function groupExternalFeedItems(items) {
  const groups = groupByDefinitions(
    items.filter((item) => !isInternalFeedItem(item)),
    PROVIDER_DEFINITIONS,
    (item, definition) => item.provider === definition.id,
  );

  return groups.map((group) => ({
    ...group,
    items: [...group.items].sort((left, right) => {
      if (left.fallback_only !== right.fallback_only) {
        return left.fallback_only ? 1 : -1;
      }

      const leftTime = Date.parse(left.published_at || "") || 0;
      const rightTime = Date.parse(right.published_at || "") || 0;
      return rightTime - leftTime;
    }),
  }));
}

export function getContentTypeLabel(item) {
  return CONTENT_TYPE_LABELS[item.content_type] || "Update";
}

export function formatFeedDate(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const elapsedSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(elapsedSeconds);
  const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absoluteSeconds < 60) return relative.format(elapsedSeconds, "second");
  if (absoluteSeconds < 3600) return relative.format(Math.round(elapsedSeconds / 60), "minute");
  if (absoluteSeconds < 86400) return relative.format(Math.round(elapsedSeconds / 3600), "hour");
  if (absoluteSeconds < 604800) return relative.format(Math.round(elapsedSeconds / 86400), "day");

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

export function formatEngagement(metrics = {}) {
  const parts = [];
  if (Number(metrics.score) > 0) parts.push(`${metrics.score} points`);
  if (Number(metrics.comments) > 0) parts.push(`${metrics.comments} comments`);
  if (Number(metrics.reactions) > 0) parts.push(`${metrics.reactions} reactions`);
  return parts.join(" · ");
}
