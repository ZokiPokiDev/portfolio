import React, { useState } from "react";
import { useSignalFeed } from "../hooks/useSignalFeed";
import {
    formatEngagement,
    formatFeedDate,
    getContentTypeLabel,
    groupExternalFeedItems,
    groupInternalFeedItems,
    ITEMS_PER_PROVIDER,
    SIGNAL_FEED_LIMIT,
} from "../services/signalFeed";
import "./SitemapTree.css";

const treeData = [
    { id: "home", label: "Home", link: "#hero" },
    { id: "modernization", label: "Modernization", link: "#modernization" },
    { id: "packages", label: "Packages", link: "#packages" },
    { id: "proof-demos", label: "Proof Demos", link: "#proof-demos" },
    {
        id: "regions",
        label: "Regions",
        children: [
            { id: "dach-modernization", label: "DACH", link: "/dach-modernization" },
            { id: "gcc-ai-integration", label: "GCC", link: "/gcc-ai-integration" },
            { id: "uk-saas-rescue", label: "UK", link: "/uk-saas-rescue" },
            { id: "asia-ai-integration", label: "Asia", link: "/asia-ai-integration" },
        ],
    },
    {
        id: "about",
        label: "About",
        children: [
            { id: "about", label: "About Us", link: "#about" },
            { id: "founder", label: "Founder", link: "/founder" },
            { id: "case-studies", label: "Case Studies", link: "/case-studies" },
            { id: "industries", label: "Industries", link: "#industries" },
            { id: "services", label: "Services", link: "#services" },
        ],
    },
    { id: "tech-stack", label: "Tech Stack", link: "#tech-stack" },
    { id: "posts", label: "Posts", link: "#posts" },
    {
        id: "projects",
        label: "Projects",
        children: [
            { id: "ktm", label: "KTM", link: "#ktm" },
            { id: "vw", label: "Volkswagen", link: "#vw" },
            { id: "redbull", label: "Red Bull", link: "#redbull" },
            { id: "dazn", label: "DAZN", link: "#dazn" },
            { id: "planet", label: "Planet", link: "#planet" },
            { id: "ivote", label: "iVote", link: "#ivote" },
            { id: "whmcs", label: "WHMCS", link: "#whmcs" },
            { id: "dach", label: "DACH", link: "#dach" },
            { id: "ecommerce", label: "E-commerce", link: "#ecommerce" },
            { id: "email-campaign", label: "Email Campaign", link: "#email-campaign" },
            { id: "pdf-reader", label: "PDF Reader", link: "#pdf-reader" },
            { id: "business-locator", label: "Business Locator", link: "#business-locator" },
            { id: "e-learning", label: "E-learning", link: "#e-learning" },
        ],
    },
    { id: "live-signals", label: "Live Signals", link: "#live-signals" },
    { id: "lead-capture", label: "Lead Form", link: "#lead-capture" },
    { id: "get-in-touch", label: "Get in touch", link: "#get-in-touch" },
    { id: "locations", label: "Locations", link: "#locations" },
    { id: "contact", label: "Contact", link: "#contact" },
];

const providerMarks = {
    github: "GH",
    hackernews: "Y",
    linkedin: "in",
    reddit: "r/",
};

function TreeNode({ node, expanded, toggle }) {
    const hasChildren = node.children && node.children.length > 0;

    // Handler for both +/- and label (when expandable)
    const handleExpand = (e) => {
        if (hasChildren) {
            e.preventDefault();
            toggle(node.id);
        }
    };

    // Handler for anchor scroll
    const handleAnchorClick = (e) => {
        if (hasChildren) {
            handleExpand(e);
        } else if (node.link && node.link.startsWith("#")) {
            e.preventDefault();
            const el = document.getElementById(node.link.substring(1));
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    return (
        <li>
            <div className={`tree-node${hasChildren ? " expandable" : ""}`}>
                {hasChildren && (
                    <span
                        className="tree-toggle"
                        onClick={handleExpand}
                        role="button"
                        tabIndex={0}
                    >
                        {expanded[node.id] ? "−" : "+"}
                    </span>
                )}
                {node.link ? (
                    <a
                        href={node.link}
                        className="tree-label"
                        onClick={handleAnchorClick}
                        tabIndex={0}
                    >
                        {node.label}
                    </a>
                ) : (
                    <span
                        className="tree-label"
                        onClick={hasChildren ? handleExpand : undefined}
                        tabIndex={hasChildren ? 0 : -1}
                        role={hasChildren ? "button" : undefined}
                    >
                        {node.label}
                    </span>
                )}
            </div>
            {hasChildren && expanded[node.id] && (
                <ul>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            expanded={expanded}
                            toggle={toggle}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

const SitemapTree = () => {
    const [expanded, setExpanded] = useState({});
    const { items: feedItems, status } = useSignalFeed(SIGNAL_FEED_LIMIT);
    const internalGroups = groupInternalFeedItems(feedItems);
    const providerGroups = groupExternalFeedItems(feedItems);
    const firstLiveGroupIndex = providerGroups.findIndex((group) =>
        group.items.some((item) => !item.fallback_only),
    );

    const toggle = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <aside className="sitemap-tree" aria-label="Site rail">
            <nav className="rail-block" aria-label="Site map">
                <div className="rail-heading">Index</div>
                <ul>
                    {treeData.map((node) => (
                        <TreeNode
                            key={node.id}
                            node={node}
                            expanded={expanded}
                            toggle={toggle}
                        />
                    ))}
                </ul>
            </nav>
            <section className="signal-feed" aria-label="SystemPro pages and live signals">
                {internalGroups.length > 0 && (
                    <div className="rail-feed-group">
                        <div className="rail-heading">Explore SystemPro</div>
                        <div className="feed-accordion-list">
                            {internalGroups.map((group) => (
                                <details className="feed-accordion" open={group.open || undefined} key={group.id}>
                                    <summary>
                                        <span>{group.label}</span>
                                        <span className="feed-group-count">{group.items.length}</span>
                                    </summary>
                                    <div className="featured-link-list">
                                        {group.items.map((item) => (
                                            <a
                                                className="featured-link-card"
                                                data-content-type={item.content_type}
                                                href={item.href}
                                                key={`${item.href}-${item.title}`}
                                            >
                                                <span className="feed-kind">{getContentTypeLabel(item)}</span>
                                                <strong>{item.title}</strong>
                                                <span className="feed-arrow" aria-hidden="true">→</span>
                                            </a>
                                        ))}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                )}

                <div className="rail-feed-group live-feed-group">
                    <div className="rail-heading rail-heading-live">
                        <span>Live signals</span>
                        <span className={`feed-mode ${status}`} role="status">
                            <span className="live-indicator" aria-hidden="true" />
                            {status === "live" ? "Live" : status === "loading" ? "Loading" : "Curated"}
                        </span>
                    </div>
                    <div className="feed-accordion-list provider-accordion-list">
                        {providerGroups.map((group, groupIndex) => {
                            const isCurated = group.items.every((item) => item.fallback_only);

                            return (
                                <details
                                    className="feed-accordion provider-accordion"
                                    data-feed-mode={isCurated ? "curated" : "live"}
                                    open={groupIndex === Math.max(0, firstLiveGroupIndex) || undefined}
                                    key={group.id}
                                >
                                    <summary>
                                        <span className={`provider-mark provider-mark-${group.id}`} aria-hidden="true">
                                            {providerMarks[group.id] || "•"}
                                        </span>
                                        <span className="provider-name">
                                            {group.label}
                                            <small>{isCurated ? "Curated link" : "Latest updates"}</small>
                                        </span>
                                        <span className="feed-group-count">{Math.min(group.items.length, ITEMS_PER_PROVIDER)}</span>
                                    </summary>
                                    <div className="signal-list">
                                        {group.items.slice(0, ITEMS_PER_PROVIDER).map((item) => {
                                            const date = formatFeedDate(item.published_at);
                                            const engagement = formatEngagement(item.metrics);

                                            return (
                                                <a
                                                    className="signal-list-item"
                                                    data-content-type={item.content_type}
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    key={`${item.href}-${item.title}`}
                                                >
                                                    <span className="signal-marker" aria-hidden="true" />
                                                    <span className="signal-copy">
                                                        <span className="signal-meta">
                                                            <span>{getContentTypeLabel(item)}</span>
                                                            {date && (
                                                                <time
                                                                    dateTime={item.published_at}
                                                                    title={new Date(item.published_at).toLocaleString()}
                                                                >
                                                                    {date}
                                                                </time>
                                                            )}
                                                        </span>
                                                        <strong>{item.title}</strong>
                                                        {engagement && <small>{engagement}</small>}
                                                    </span>
                                                    <span className="signal-external" aria-hidden="true">↗</span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </details>
                            );
                        })}
                    </div>
                    <a className="all-signals-link" href="#live-signals">
                        View all updates <span aria-hidden="true">→</span>
                    </a>
                </div>
            </section>
            <a className="rail-cta" href="mailto:panev.zoran.te@gmail.com">
                Contact Zoran
            </a>
        </aside>
    );
};

export default SitemapTree;
