import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css" // Agregar esta línea
import { Link } from "react-router-dom";

export default function Map() {
  return (
        <MapContainer
          className="w-[90%] lg:w-[60%] h-[600px] rounded-lg z-40"
          center={[36.4826, -4.99190]}
          zoom={22}
          scrollWheelZoom={false}

        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[36.4826, -4.99190]} >
            <Popup>
            <Link target="_blank" to={"https://share.google/5MyZ9AADgKrOLnI1z"}>BAR PEREJIL 🌿</Link>
            </Popup>
          </Marker>
        </MapContainer>
  );}
