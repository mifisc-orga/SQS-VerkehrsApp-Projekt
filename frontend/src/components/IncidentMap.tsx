import type { TrafficEvent } from '../types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for missing marker icons in Leaflet + Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Vite does not expose Leaflet's bundled images at the expected paths,
// so we delete the internal URL resolver and supply the imports manually.
const ICON_PROTO = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown };
delete ICON_PROTO._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

/** Props for the IncidentMap component */
interface IncidentMapProps {
  /** List of traffic events to display */
  events: TrafficEvent[];
}

/**
 * Displays all provided traffic events as markers on an
 * interactive Leaflet map (OpenStreetMap).
 */
export function IncidentMap({ events }: IncidentMapProps) {
  return (
    <div data-testid="incident-map" style={{ height: '500px', width: '100%' }}>
      <MapContainer
        center={[51.1657, 10.4515]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => (
          <Marker key={event.id} position={[event.latitude, event.longitude]}>
            <Popup>
              <strong>{event.title}</strong>
              <br />
              {event.subtitle}
              <br />
              Risiko: {event.riskLevel}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
