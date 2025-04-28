import React, { useState } from "react";
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

    const toggle = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <nav className="sitemap-tree" aria-label="Site map">
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
    );
};

export default SitemapTree;