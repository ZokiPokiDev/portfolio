import { Link } from 'react-router-dom';
import { projects } from '../base/projects';

const Projects = () => (
    <section className="projects">
        <h2>Projects</h2>
        <ul>
            {projects.map((proj, idx) => (
                <li key={idx}>
                    <Link to={`/projects/${proj.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {proj.image && (
                            <img
                                src={proj.image}
                                alt={`${proj.name} logo`}
                                style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '0.5em' }}
                            />
                        )}
                        <h3>{proj.name}</h3>
                        <p>{proj.description}</p>
                        <p><span className="role">{proj.role}</span></p>
                        <p><span className="tech">{proj.tech}</span></p>
                    </Link>
                </li>
            ))}
        </ul>
    </section>
);

export default Projects;