import { useState, useEffect } from 'react';
import { fetchDashboardTraffic, deleteFavourite } from '../services/trafficService';
import type { DashboardRoadData, RiskLevel } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { DashboardRoadCard } from './DashboardRoadCard';

/** Props for the dashboard showing saved motorways */
interface DashboardProps {
  /** JWT token for authentication */
  token: string;
  /** Incremented to trigger a dashboard refresh after saving a favourite */
  refreshKey: number;
  /** Called when the user clicks a motorway card */
  onRoadSelect: (roadId: string) => void;
}

/** Returns the highest risk level among all events on a road, defaulting to LOW. */
function getMaxRiskLevel(events: DashboardRoadData['events']): RiskLevel {
  if (events.length === 0) {
    return 'LOW';
  }
  if (events.some(e => e.riskLevel === 'HIGH')) {
    return 'HIGH';
  }
  if (events.some(e => e.riskLevel === 'MEDIUM')) {
    return 'MEDIUM';
  }
  return 'LOW';
}

/** Dashboard showing an overview of the user's saved motorways */
export function Dashboard({ token, refreshKey, onRoadSelect }: DashboardProps) {
  const [roadData, setRoadData] = useState<DashboardRoadData[]>([]);
  const [confirmDeleteRoadId, setConfirmDeleteRoadId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardTraffic(token).then(setRoadData).catch(() => {});
  }, [token, refreshKey]);

  function handleDeleteRequest(roadId: string) {
    setConfirmDeleteRoadId(roadId);
  }

  async function handleDeleteConfirm() {
    if (!confirmDeleteRoadId) {
      return;
    }
    try {
      await deleteFavourite(token, confirmDeleteRoadId);
      setRoadData(prev => prev.filter(r => r.roadId !== confirmDeleteRoadId));
    } catch {
      // ignore
    } finally {
      setConfirmDeleteRoadId(null);
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
          const uniqueTypes = [...new Set(events.map(e => e.type))];
          return (
            <DashboardRoadCard
              key={roadId}
              roadId={roadId}
              events={events}
              maxRiskLevel={maxRisk}
              uniqueTypes={uniqueTypes}
              onRoadSelect={onRoadSelect}
              onDeleteRequest={handleDeleteRequest}
            />
          );
        })}
      </div>
      {confirmDeleteRoadId && (
        <ConfirmModal
          message={`Möchtest du ${confirmDeleteRoadId} wirklich aus deinen Favouriten entfernen?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDeleteRoadId(null)}
        />
      )}
    </div>
  );
}
