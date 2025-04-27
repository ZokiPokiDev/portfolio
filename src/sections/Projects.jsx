import { Link } from 'react-router-dom';
import { projects } from '../base/projects';

const Projects = () => (
    <section id="projects" className="projects">
        <h2>Projects</h2>
        <ul>
            {projects.map((proj, idx) => (
                <div id={proj.id} className="box-card" key={idx} style={{ marginBottom: '1em' }}>
                    <li>
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
                </div>
            ))}
        </ul>
    </section>
);

export default Projects;