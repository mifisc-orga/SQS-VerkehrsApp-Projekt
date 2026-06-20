import { RiskBadge } from './RiskBadge';
import type { DashboardRoadData, RiskLevel } from '../types';

/** Props for a single saved-motorway card in the dashboard */
interface DashboardRoadCardProps {
  /** Motorway identifier, e.g. "A3" */
  readonly roadId: string;
  /** Traffic events currently active on this motorway */
  readonly events: DashboardRoadData['events'];
  /** Highest risk level among all events */
  readonly maxRiskLevel: RiskLevel;
  /** Deduplicated list of event types on this motorway */
  readonly uniqueTypes: string[];
  /** Called when the card is clicked to select the motorway */
  readonly onRoadSelect: (roadId: string) => void;
  /** Called when the delete button is clicked */
  readonly onDeleteRequest: (roadId: string) => void;
}

/** Maps an event type key to a human-readable German label with emoji. */
function getEventTypeLabel(type: string): string {
  switch (type) {
    case 'ROADWORK': return '🚧 Baustelle';
    case 'CLOSURE': return '🚫 Sperrung';
    case 'WARNING': return '⚠️ Warnung';
    default: return type;
  }
}

/** A single road card in the dashboard */
export function DashboardRoadCard({
  roadId, events, maxRiskLevel, uniqueTypes, onRoadSelect, onDeleteRequest
}: DashboardRoadCardProps) {
  return (
    <div className="dashboard-card">
      <button
        className="dashboard-card__clickable-area"
        data-testid={`dashboard-road-${roadId}`}
        onClick={() => onRoadSelect(roadId)}
        onKeyDown={(e) => { if (e.key === 'Enter') onRoadSelect(roadId); }}
      >
        <div className="dashboard-card__header">
          <span className="dashboard-card__title">🛣️ {roadId}</span>
          <RiskBadge riskLevel={maxRiskLevel} />
        </div>
        <div className="dashboard-card__stats">
          <span>{events.length} {events.length === 1 ? 'Ereignis' : 'Ereignisse'}</span>
        </div>
        {uniqueTypes.length > 0 && (
          <div className="dashboard-card__types">
            {uniqueTypes.map(type => (
              <span key={type} className="event-type-badge">{getEventTypeLabel(type)}</span>
            ))}
          </div>
        )}
        {events.length === 0 && (
          <p className="dashboard-card__empty">Keine aktuellen Ereignisse.</p>
        )}
      </button>
      <button
        className="btn btn-danger"
        data-testid={`delete-favourite-${roadId}`}
        onClick={() => onDeleteRequest(roadId)}
      >
        ✕ Entfernen
      </button>
    </div>
  );
}