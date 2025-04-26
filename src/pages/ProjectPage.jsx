import { useParams, Link } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { projects } from '../base/projects';

const ProjectPage = () => {
    const { id } = useParams();
    const project = projects.find((p) => p.id === id);

    // Modal state for lightbox
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIdx, setModalIdx] = useState(0);

    // Carousel state for gallery
    const [galleryStart, setGalleryStart] = useState(0);
    const galleryLength = project && project.gallery ? project.gallery.length : 0;

    // Show 3 images at a time, loop around
    const getVisibleImages = () => {
        if (!project.gallery || galleryLength <= 3) return project.gallery;
        const images = [];
        for (let i = 0; i < 3; i++) {
            images.push(project.gallery[(galleryStart + i) % galleryLength]);
        }
        return images;
    };

    const scrollLeft = () => {
        setGalleryStart((prev) =>
            (prev - 1 + galleryLength) % galleryLength
        );
    };

    const scrollRight = () => {
        setGalleryStart((prev) =>
            (prev + 1) % galleryLength
        );
    };

    // Lightbox handlers
    const openModal = (idx) => {
        setModalIdx(idx);
        setModalOpen(true);
    };

    const closeModal = useCallback(() => setModalOpen(false), []);

    const prevImg = useCallback(() => {
        setModalIdx((prev) =>
            project.gallery ? (prev - 1 + galleryLength) % galleryLength : 0
        );
    }, [project, galleryLength]);

    const nextImg = useCallback(() => {
        setModalIdx((prev) =>
            project.gallery ? (prev + 1) % galleryLength : 0
        );
    }, [project, galleryLength]);

    // Keyboard navigation for modal
    useEffect(() => {
        if (!modalOpen) return;
        const handler = (e) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') prevImg();
            if (e.key === 'ArrowRight') nextImg();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [modalOpen, closeModal, prevImg, nextImg]);

    if (!project) return <div className="app-container">Project not found.</div>;

    return (
        <div className="project-page">
            <Link to="/" style={{ color: '#1a73e8', display: 'inline-block', marginBottom: '1em' }}>
                ← Back to Portfolio
            </Link>
            <section>
                <h2>{project.name}</h2>
                {project.image && (
                    <img src={project.image} alt={project.name} style={{ width: '120px', margin: '1em 0' }} />
                )}
                <p>{project.description}</p>

                {/* Collage */}
                {project.gallery && project.gallery.length > 0 && (
                    <div className={`collage-box collage-count-${Math.min(project.gallery.length, 4)}`}>
                        {project.gallery.slice(0, project.gallery.length >= 4 ? 4 : 3).map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Collage ${idx + 1}`}
                                className={`collage-img collage-img-${idx}`}
                            />
                        ))}
                    </div>
                )}

                {/* Gallery Carousel */}
                {project.gallery && project.gallery.length > 0 && (
                    <div className="gallery-carousel">
                        {galleryLength > 3 && (
                            <button className="gallery-arrow left" onClick={scrollLeft}>
                                &#8592;
                            </button>
                        )}
                        <div className="gallery">
                            {getVisibleImages().map((img, idx) => {
                                // Calculate the correct image index for modal opening
                                const realIdx = (galleryStart + idx) % galleryLength;
                                return (
                                    <img
                                        key={realIdx}
                                        src={img}
                                        alt={`${project.name} screenshot ${realIdx + 1}`}
                                        className="gallery-img"
                                        onClick={() => openModal(realIdx)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                );
                            })}
                        </div>
                        {galleryLength > 3 && (
                            <button className="gallery-arrow right" onClick={scrollRight}>
                                &#8594;
                            </button>
                        )}
                    </div>
                )}
                {/* Impact/Role */}
                {project.impact && (
                    <div style={{ marginTop: '1em', fontStyle: 'italic' }}>
                        <strong>My Impact:</strong> {project.impact}
                    </div>
                )}
                {/* Tech Stack */}
                <div>
                    <strong>Tech Used:</strong> {project.tech}
                </div>
            </section>
            {/* Lightbox Modal */}
            {modalOpen && project.gallery && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>&times;</button>
                        <button className="modal-arrow left" onClick={prevImg}>&#8592;</button>
                        <img
                            src={project.gallery[modalIdx]}
                            alt={`Gallery ${modalIdx + 1}`}
                            className="modal-img"
                        />
                        <button className="modal-arrow right" onClick={nextImg}>&#8594;</button>
                        <div className="modal-counter">
                            {modalIdx + 1} / {project.gallery.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectPage;