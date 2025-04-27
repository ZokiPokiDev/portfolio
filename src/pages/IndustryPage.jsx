import { Link } from "react-router-dom";
import { industries } from "../sections/Industries";
import { useParams } from "react-router-dom";

const IndustryPage = () => {
    const { id } = useParams();
    const industry = industries.find(industry => industry.id === id)

    return (
        <div>
            <Link className="topbar-link" to="/" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 'bold' }}>
                ← Back to Portfolio
            </Link>
            <div className="spacer"></div>

            <section className="industry-section">
                <h2>{industry.title}</h2>
                <h4>{industry.description}</h4>
                <h5>{industry.summary}</h5>

                <div className="services-area">
                    <h2>Our services</h2>

                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {industry.services && industry.services.map((service, idx) => (
                            <li key={idx} className="box-card" style={{ marginBottom: '1em' }}>
                                <h3>{service.title}</h3>
                                {service.description && <h4>{service.description}</h4>}
                                {service.sensors && <h4>Sensors: {service.sensors.join(', ')}</h4>}
                                {service.ai && <h4>AI: {service.ai.join(', ')}</h4>}
                                {service.custom && service.custom.length > 0 &&
                                    <div>
                                        {service.custom.map((custom, customIdx) => {
                                            return (
                                                <div key={customIdx} className="box-card-lighter">
                                                    <p>
                                                        <span style={{ fontSize: '1em', fontWeight: 'bold' }}> {custom.title}: </span>
                                                        <span style={{ fontSize: '1em' }}>{custom.description}</span>
                                                    </p>
                                                    <p><span style={{ fontSize: '1em' }}>{custom.text}</span></p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    )
}

export default IndustryPage
