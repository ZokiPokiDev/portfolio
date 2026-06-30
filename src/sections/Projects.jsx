import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../base/projects';

const categories = [
    { id: 'all', label: 'All' },
    { id: 'ai', label: 'AI' },
    { id: 'saas', label: 'SaaS' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'enterprise', label: 'Enterprise' },
    { id: 'commerce', label: 'Commerce' },
];

function projectText(project) {
    return `${project.name} ${project.description} ${project.role} ${project.tech} ${project.impact || ''}`.toLowerCase();
}

function projectCategories(project) {
    const text = projectText(project);
    const matches = ['all'];

    if (/ai|llm|rag|cag|langchain|pdf/.test(text)) matches.push('ai');
    if (/saas|campaign|hosting|platform|api/.test(text)) matches.push('saas');
    if (/mobile|flutter|react native|cordova|app/.test(text)) matches.push('mobile');
    if (/sap|finance|porsche|volkswagen|voting|government|erp|red-bull|dazn/.test(text)) matches.push('enterprise');
    if (/e-commerce|ecommerce|woocommerce|magento|shop|dealer/.test(text)) matches.push('commerce');

    return matches;
}

function ProjectOpenLink({ project }) {
    const link = project.link ?? `/projects/${project.id}`;
    const label = project.link ? 'Open live reference' : 'Open case study';

    if (project.link) {
        return (
            <a className="project-open" href={link} target="_blank" rel="noopener noreferrer">
                {label}
            </a>
        );
    }

    return (
        <Link className="project-open" to={link}>
            {label}
        </Link>
    );
}

const Projects = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [query, setQuery] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const filteredProjects = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return projects.filter((project) => {
            const categoriesForProject = projectCategories(project);
            const categoryMatch = selectedCategory === 'all' || categoriesForProject.includes(selectedCategory);
            const queryMatch = !normalizedQuery || projectText(project).includes(normalizedQuery);

            return categoryMatch && queryMatch;
        });
    }, [selectedCategory, query]);

    const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6);
    const hiddenCount = filteredProjects.length - visibleProjects.length;

    return (
        <section id="projects" className="projects">
            <div className="projects-head">
                <div>
                    <h2>Projects</h2>
                    <p>Filter the long list, then expand the work that matters for your current context.</p>
                </div>
                <div className="project-count">{filteredProjects.length} matched</div>
            </div>

            <div className="project-controls">
                <div className="project-filter" aria-label="Project filters">
                    {categories.map((category) => (
                        <button
                            type="button"
                            key={category.id}
                            className={selectedCategory === category.id ? 'active' : ''}
                            onClick={() => {
                                setSelectedCategory(category.id);
                                setShowAll(false);
                            }}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
                <input
                    className="project-search"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setShowAll(false);
                    }}
                    placeholder="Search projects, stack, role..."
                    aria-label="Search projects"
                />
            </div>

            <ul className="project-list">
                {visibleProjects.map((project) => {
                    const isExpanded = expandedId === project.id;

                    return (
                        <li id={project.id} className={`project-row ${isExpanded ? 'expanded' : ''}`} key={project.id}>
                            <button
                                type="button"
                                className="project-summary"
                                onClick={() => setExpandedId(isExpanded ? null : project.id)}
                                aria-expanded={isExpanded}
                                aria-controls={`${project.id}-details`}
                            >
                                {project.image && (
                                    <img
                                        src={project.image}
                                        alt=""
                                        className="project-logo"
                                    />
                                )}
                                <span className="project-main">
                                    <strong>{project.name}</strong>
                                    <small>{project.description}</small>
                                </span>
                                <span className="project-chevron">{isExpanded ? '−' : '+'}</span>
                            </button>

                            {isExpanded && (
                                <div id={`${project.id}-details`} className="project-details">
                                    <p>{project.impact || project.description}</p>
                                    <div className="project-meta">
                                        <span className="role">{project.role}</span>
                                        <span className="tech">{project.tech}</span>
                                    </div>
                                    <ProjectOpenLink project={project} />
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>

            {hiddenCount > 0 && (
                <button type="button" className="project-more" onClick={() => setShowAll(true)}>
                    Show {hiddenCount} more projects
                </button>
            )}
            {showAll && filteredProjects.length > 6 && (
                <button type="button" className="project-more secondary" onClick={() => setShowAll(false)}>
                    Collapse project list
                </button>
            )}
        </section>
    );
};

export default Projects;
