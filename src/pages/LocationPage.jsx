import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { locations } from "../sections/Locations"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const LocationPage = () => {
    const { id } = useParams()
    const location = locations.find((loc) => loc.id === id)

    const [coords, setCoords] = useState(null)

    useEffect(() => {
        if (location && location.coords) {
            const query = encodeURIComponent(location.coords[0]) + "," + encodeURIComponent(location.coords[1])
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)])
                    }
                })
        }
    }, [location])

    return (
        <div className="location-page">
            <Link className="topbar-link" to="/" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 'bold' }}>
                ← Back to Portfolio
            </Link>
            <div className="spacer"></div>

            <h2>Location: {location.title}</h2>
            <p>{location.description}</p>
            <p>{location.address}</p>

            {coords ? (
                <MapContainer center={coords} zoom={13} style={{ height: "400px", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={coords}>
                        <Popup>
                            {location.title}<br/>{location.description}<br/>{location.address}
                        </Popup>
                    </Marker>
                </MapContainer>
            ) : (
                location.address && <p>Loading map...</p>
            )}
        </div>
    )
}

export default LocationPage