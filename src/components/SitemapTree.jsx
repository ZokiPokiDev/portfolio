import React, { useEffect, useMemo, useState } from "react";
import "./SitemapTree.css";

const treeData = [
    { id: "home", label: "Home", link: "#hero" },
    {
        id: "about",
        label: "About",
        children: [
            { id: "about", label: "About Us", link: "#about" },
            { id: "industries", label: "Industries", link: "#industries" },
            { id: "services", label: "Services", link: "#services" },
        ],
    },
    { id: "tech-stack", label: "Tech Stack", link: "#tech-stack" },
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
    { id: "get-in-touch", label: "Get in touch", link: "#get-in-touch" },
    { id: "locations", label: "Locations", link: "#locations" },
    { id: "contact", label: "Contact", link: "#contact" },
];

const fallbackFeedItems = [
    {
        source: "Now",
        title: "AI portfolio lab",
        text: "Preparing a real Ask Zoran assistant from project notes, CV context, and articles.",
        href: "#get-in-touch",
    },
    {
        source: "LinkedIn",
        title: "VPS rescue notes",
        text: "Plesk, Docker, memory pressure, Ollama, nginx, and certificate recovery.",
        href: "https://linkedin.com/in/zoranpanev",
    },
    {
        source: "GitHub",
        title: "GitHub activity",
        text: "Public work, experiments, and engineering references.",
        href: "https://github.com/zokipokidev",
    },
];

function formatRepoDate(value) {
    if (!value) return "Live";

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
    }).format(new Date(value));
}

function useSignalFeed() {
    const [githubItems, setGithubItems] = useState([]);
    const [curatedItems, setCuratedItems] = useState([]);

    useEffect(() => {
        const controller = new AbortController();

        fetch("https://api.github.com/users/zokipokidev/repos?sort=pushed&type=owner&per_page=4", {
            signal: controller.signal,
            headers: { Accept: "application/vnd.github+json" },
        })
            .then((response) => {
                if (!response.ok) throw new Error("GitHub feed unavailable");
                return response.json();
            })
            .then((repos) => {
                const mapped = repos
                    .filter((repo) => !repo.fork)
                    .slice(0, 3)
                    .map((repo) => ({
                        source: `GitHub / ${formatRepoDate(repo.pushed_at)}`,
                        title: repo.name,
                        text: repo.description || `Recent ${repo.language || "code"} repository activity.`,
                        href: repo.html_url,
                    }));

                setGithubItems(mapped);
            })
            .catch(() => setGithubItems([]));

        fetch("/signal-feed.json", { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error("Curated feed unavailable");
                return response.json();
            })
            .then((items) => {
                if (Array.isArray(items)) {
                    setCuratedItems(items);
                }
            })
            .catch(() => setCuratedItems([]));

        return () => controller.abort();
    }, []);

    return useMemo(() => {
        const merged = [...curatedItems, ...githubItems];
        return merged.length ? merged.slice(0, 5) : fallbackFeedItems;
    }, [curatedItems, githubItems]);
}

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
    const feedItems = useSignalFeed();

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
            <section className="signal-feed" aria-label="Developer signal feed">
                <div className="rail-heading">Signal Feed</div>
                {feedItems.map((item) => (
                    <a
                        className="signal-card"
                        href={item.href}
                        target={item.href.startsWith("#") ? undefined : "_blank"}
                        rel={item.href.startsWith("#") ? undefined : "noopener noreferrer"}
                        key={item.title}
                    >
                        <span>{item.source}</span>
                        <strong>{item.title}</strong>
                        <small>{item.text}</small>
                    </a>
                ))}
                <a className="rail-cta" href="mailto:zoran.panev@gmail.com">
                    Contact Zoran
                </a>
            </section>
        </aside>
    );
};

export default SitemapTree;
