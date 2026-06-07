import { useState, useEffect } from 'react';
import { fetchSavedRoads, fetchDashboardTraffic, deleteFavourite } from '../services/trafficService';
import { RiskBadge } from './RiskBadge';
import type { TrafficEvent } from './IncidentMap';

interface DashboardProps {
  token: string;
  refreshKey: number;
}

export function Dashboard({ token, refreshKey }: DashboardProps) {
  const [savedRoads, setSavedRoads] = useState<string[]>([]);
  const [trafficEvents, setTrafficEvents] = useState<TrafficEvent[]>([]);

  useEffect(() => {
    fetchSavedRoads(token).then(setSavedRoads).catch(console.error);
    fetchDashboardTraffic(token).then(setTrafficEvents).catch(console.error);
  }, [token, refreshKey]);

  async function handleDelete(roadId: string) {
    try {
      await deleteFavourite(token, roadId);
      setSavedRoads((prev) => prev.filter((r) => r !== roadId));
    } catch {
      alert('Fehler beim Löschen');
    }
  }

  return (
    <div className="card" data-testid="dashboard">
      <div className="section-title">Meine Favouriten</div>
      {savedRoads.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Keine gespeicherten Autobahnen. Wähle eine Autobahn aus und speichere sie als Favorit.
        </p>
      )}
      <div className="dashboard-grid">
        {savedRoads.map((roadId) => {
          const events = trafficEvents.filter((e) => e.roadId === roadId);
          return (
            <div key={roadId} className="dashboard-card" data-testid={`dashboard-road-${roadId}`}>
              <div className="dashboard-card__title">
                🛣️ {roadId}
              </div>
              {events.length === 0 ? (
                <p className="dashboard-card__empty">Keine aktuellen Ereignisse.</p>
              ) : (
                <ul className="dashboard-card__events">
                  {events.map((event) => (
                    <li key={event.id}>
                      <span>{event.title}</span>
                      <RiskBadge riskLevel={event.riskLevel} />
                    </li>
                  ))}
                </ul>
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
