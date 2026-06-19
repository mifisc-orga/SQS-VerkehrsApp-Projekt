import { IncidentMap } from './IncidentMap';
import { RiskBadge } from './RiskBadge';
import { formatCachedAt } from '../utils/formatCachedAt';
import type { TrafficEvent } from '../types';

interface TrafficViewProps {
  isLive: boolean;
  cachedAt: string | null;
  events: TrafficEvent[];
}

export function TrafficView({ isLive, cachedAt, events }: TrafficViewProps) {
  return (
    <div className="map-events-layout">
      <div>
        <div className="data-status" style={{ marginBottom: '6px' }}>
          {isLive ? (
            <span data-testid="live-indicator" className="status-live">
              <span className="live-dot" aria-hidden="true"></span>
              Live-Daten
            </span>
          ) : (
            <span data-testid="cached-indicator" className="status-cached">
              Gecacht · {formatCachedAt(cachedAt)}
            </span>
          )}
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="map-container">
            <IncidentMap events={events} />
          </div>
        </div>
      </div>

      {events.length > 0 && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="section-title">
            Aktuelle Ereignisse
            <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 400, color: 'var(--color-text-muted)' }}>
              {events.length} Ereignisse
            </span>
          </div>
          <ul className="events-list events-list--scroll">
            {events.map(event => (
              <li key={event.id} className="event-item" data-testid={`event-item-${event.id}`}>
                <span className="event-item__road">{event.roadId}</span>
                <span className="event-item__title">{event.title}</span>
                <RiskBadge riskLevel={event.riskLevel} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}