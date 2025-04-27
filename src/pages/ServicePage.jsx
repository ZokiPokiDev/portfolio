import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import { services } from "../sections/Services"

const ServicePage = () => {
    const { id } = useParams()
    const service = services.find(service => service.id === Number(id))

    return (
        <>
            <Link className="topbar-link" to="/" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 'bold' }}>
                ← Back to Portfolio
            </Link>
            <div className="spacer"></div>

            <h2>Service {service.title}</h2>
            <h4>{service.description}</h4>
            <h5>{service.summary}</h5>

            <div className="services-area">
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {service.custom && service.custom.map((custom, customIdx) => (
                        <li key={customIdx} className="box-card" style={{ marginBottom: '1em' }}>
                            <h3>{custom.title}</h3>
                            {custom.description && <h4>{custom.description}</h4>}
                            {custom.points &&
                                <div className="points">
                                    {custom.points.map((point, pointIdx) => (
                                        <div key={`${customIdx}-${pointIdx}`}>
                                            <h5>{point.title}</h5>
                                            <ul>
                                                {point.values.map((value, valueIdx) => (
                                                    <li key={`${customIdx}-${pointIdx}-${valueIdx}`}>{value}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            }
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default ServicePage
