import { useState, useEffect } from 'react';
import { fetchDashboardTraffic, deleteFavourite } from '../services/trafficService';
import type { DashboardRoadData } from '../services/trafficService';
import { RiskBadge } from './RiskBadge';
import type { RiskLevel } from './RiskBadge';

interface DashboardProps {
  token: string;
  refreshKey: number;
  onRoadSelect: (roadId: string) => void;
}

function getMaxRiskLevel(events: DashboardRoadData['events']): RiskLevel | 'NONE' {
  if (events.length === 0) return 'LOW';
  if (events.some((e) => e.riskLevel === 'HIGH')) return 'HIGH';
  if (events.some((e) => e.riskLevel === 'MEDIUM')) return 'MEDIUM';
  return 'LOW';
}

function getEventTypeLabel(type: string): string {
  switch (type) {
    case 'ROADWORK': return '🚧 Baustelle';
    case 'CLOSURE': return '🚫 Sperrung';
    case 'WARNING': return '⚠️ Warnung';
    default: return type;
  }
}

export function Dashboard({ token, refreshKey, onRoadSelect }: DashboardProps) {
  const [roadData, setRoadData] = useState<DashboardRoadData[]>([]);

  useEffect(() => {
    fetchDashboardTraffic(token).then(setRoadData).catch(console.error);
  }, [token, refreshKey]);

  async function handleDelete(roadId: string) {
    try {
      await deleteFavourite(token, roadId);
      setRoadData((prev) => prev.filter((r) => r.roadId !== roadId));
    } catch {
      alert('Fehler beim Löschen');
    }
  }

  return (
    <div className="card" data-testid="dashboard">
      <div className="section-title">Meine Favouriten</div>
      {roadData.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Keine gespeicherten Autobahnen. Wähle eine Autobahn aus und speichere sie als Favorit.
        </p>
      )}
      <div className="dashboard-grid">
        {roadData.map(({ roadId, events }) => {
          const maxRisk = getMaxRiskLevel(events);
          const uniqueTypes = [...new Set(events.map((e) => e.type))];

          return (
            <div key={roadId} className="dashboard-card dashboard-card--clickable" data-testid={`dashboard-road-${roadId}`} onClick={() => onRoadSelect(roadId)}>
              <div className="dashboard-card__header">
                <span className="dashboard-card__title">🛣️ {roadId}</span>
                {maxRisk !== 'NONE' && <RiskBadge riskLevel={maxRisk} />}
                {maxRisk === 'NONE' && (
                  <span className="badge badge-ok">✓ Frei</span>
                )}
              </div>

              <div className="dashboard-card__stats">
                <span>{events.length} {events.length === 1 ? 'Ereignis' : 'Ereignisse'}</span>
              </div>

              {uniqueTypes.length > 0 && (
                <div className="dashboard-card__types">
                  {uniqueTypes.map((type) => (
                    <span key={type} className="event-type-badge">
                      {getEventTypeLabel(type)}
                    </span>
                  ))}
                </div>
              )}

              {events.length === 0 && (
                <p className="dashboard-card__empty">Keine aktuellen Ereignisse.</p>
              )}

              <button
                className="btn btn-danger"
                data-testid={`delete-favourite-${roadId}`}
                onClick={() => handleDelete(roadId)}
              >
                ✕ Entfernen
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}