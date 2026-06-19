import { RiskBadge } from './RiskBadge';
import type { DashboardRoadData } from '../types';
import type { RiskLevel } from '../types';

interface DashboardRoadCardProps {
    roadId: string;
    events: DashboardRoadData['events'];
    maxRiskLevel: RiskLevel;
    uniqueTypes: string[];
    onRoadSelect: (roadId: string) => void;
    onDeleteRequest: (roadId: string) => void;
}

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
  roadId,
  events,
  maxRiskLevel,
  uniqueTypes,
  onRoadSelect,
  onDeleteRequest
}: DashboardRoadCardProps) {
    return (
        <div
            className="dashboard-card dashboard-card--clickable"
            data-testid={`dashboard-road-${roadId}`}
            onClick={() => onRoadSelect(roadId)}
            onKeyDown={(e) => { if (e.key === 'Enter') onRoadSelect(roadId); }}
            role="button"
            tabIndex={0}
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
            <button
                className="btn btn-danger"
                data-testid={`delete-favourite-${roadId}`}
                onClick={(e) => { e.stopPropagation(); onDeleteRequest(roadId); }}
            >
                ✕ Entfernen
            </button>
        </div>
    )
}