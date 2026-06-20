import { useDashboard } from '../hooks/useDashboard';
import { ConfirmModal } from './ConfirmModal';
import { DashboardRoadCard } from './DashboardRoadCard';
import type { DashboardRoadData } from '../types';
import type { RiskLevel } from '../types';

/** Props for the dashboard showing saved motorways */
interface DashboardProps {
  /** JWT token for authentication */
  readonly token: string;
  /** Incremented to trigger a dashboard refresh after saving a favourite */
  readonly refreshKey: number;
  /** Called when the user clicks a motorway card */
  readonly onRoadSelect: (roadId: string) => void;
}

/** Returns the highest risk level among all events on a road, defaulting to LOW. */
function getMaxRiskLevel(events: DashboardRoadData['events']): RiskLevel {
  if (events.some(e => e.riskLevel === 'HIGH')) {
    return 'HIGH';
  }
  if (events.some(e => e.riskLevel === 'MEDIUM')) {
    return 'MEDIUM';
  }
  return 'LOW';
}

/** Renders a single road card with computed risk and event types. */
function renderRoadCard(
  { roadId, events }: DashboardRoadData,
  onRoadSelect: (roadId: string) => void,
  onDeleteRequest: (roadId: string) => void,
) {
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
      onDeleteRequest={onDeleteRequest}
    />
  );
}

/** Dashboard showing an overview of the user's saved motorways */
export function Dashboard({ token, refreshKey, onRoadSelect }: DashboardProps) {
  const { roadData, confirmDeleteRoadId, handleDeleteRequest, handleDeleteConfirm, handleDeleteCancel } = useDashboard(token, refreshKey);

  return (
    <div className="card" data-testid="dashboard">
      <div className="section-title">Meine Favouriten</div>
      {roadData.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Keine gespeicherten Autobahnen. Wähle eine Autobahn aus und speichere sie als Favorit.
        </p>
      )}
      <div className="dashboard-grid">
        {roadData.map(item => renderRoadCard(item, onRoadSelect, handleDeleteRequest))}
      </div>
      {confirmDeleteRoadId && (
        <ConfirmModal
          message={`Möchtest du ${confirmDeleteRoadId} wirklich aus deinen Favouriten entfernen?`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}