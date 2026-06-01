import { useState, useEffect } from 'react';
import { fetchSavedRoads, fetchDashboardTraffic, deleteFavourite } from '../services/trafficService';
import { RiskBadge } from './RiskBadge';
import type { TrafficEvent } from './IncidentMap';

interface DashboardProps {
  token: string;
}

export function Dashboard({ token }: DashboardProps) {
  const [savedRoads, setSavedRoads] = useState<string[]>([]);
  const [trafficEvents, setTrafficEvents] = useState<TrafficEvent[]>([]);

  useEffect(() => {
    fetchSavedRoads(token).then(setSavedRoads).catch(console.error);
    fetchDashboardTraffic(token).then(setTrafficEvents).catch(console.error);
  }, [token]);

  async function handleDelete(roadId: string) {
    try {
      await deleteFavourite(token, roadId);
      setSavedRoads((prev) => prev.filter((r) => r !== roadId));
    } catch {
      alert('Fehler beim Löschen');
    }
  }

  return (
    <div data-testid="dashboard">
      <h2>Meine Favouriten</h2>
      {savedRoads.length === 0 && <p>Keine gespeicherten Autobahnen.</p>}
      {savedRoads.map((roadId) => {
        const events = trafficEvents.filter((e) => e.roadId === roadId);
        return (
          <div key={roadId} data-testid={`dashboard-road-${roadId}`}>
            <h3>{roadId}</h3>
            {events.length === 0 ? (
              <p>Keine aktuellen Ereignisse.</p>
            ) : (
              <ul>
                {events.map((event) => (
                  <li key={event.id}>
                    <strong>{event.title}</strong> — {event.subtitle}
                    <RiskBadge riskLevel={event.riskLevel} />
                  </li>
                ))}
              </ul>
            )}
            <button
              data-testid={`delete-favourite-${roadId}`}
              onClick={() => handleDelete(roadId)}
            >
              {roadId} entfernen
            </button>
          </div>
        );
      })}
    </div>
  );
}
