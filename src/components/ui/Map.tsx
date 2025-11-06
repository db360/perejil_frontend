import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css" // Agregar esta línea

export default function Map() {
  return (
        <MapContainer
          className="w-[60%] h-[500px] rounded-lg"
          center={[36.4826, -4.99190]}
          zoom={22}
          scrollWheelZoom={false}

        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[36.4826, -4.99190]} >
            <Popup>
              BAR PEREJIL 🌿
            </Popup>
          </Marker>
        </MapContainer>
  );}
