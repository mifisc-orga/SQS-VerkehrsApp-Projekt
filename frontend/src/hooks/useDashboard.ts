import { useState, useEffect } from 'react';
import { fetchDashboardTraffic, deleteFavourite } from '../services/trafficService';
import type { DashboardRoadData } from '../types';

/** Return type of the useDashboard hook */
export interface UseDashboardResult {
  /** List of saved motorways with their traffic data */
  roadData: DashboardRoadData[];
  /** Road ID pending deletion confirmation, or null */
  confirmDeleteRoadId: string | null;
  /** Opens the delete confirmation dialog for the given road */
  handleDeleteRequest: (roadId: string) => void;
  /** Confirms deletion of the pending road and updates the list */
  handleDeleteConfirm: () => Promise<void>;
  /** Cancels the delete confirmation dialog */
  handleDeleteCancel: () => void;
}

/**
 * Manages dashboard state: fetches saved motorway data on mount,
 * and handles the delete confirmation flow.
 */
export function useDashboard(token: string, refreshKey: number): UseDashboardResult {
  const [roadData, setRoadData] = useState<DashboardRoadData[]>([]);
  const [confirmDeleteRoadId, setConfirmDeleteRoadId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardTraffic(token).then(setRoadData).catch(() => {});
  }, [token, refreshKey]);

  function handleDeleteRequest(roadId: string): void {
    setConfirmDeleteRoadId(roadId);
  }

  async function handleDeleteConfirm(): Promise<void> {
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

  function handleDeleteCancel(): void {
    setConfirmDeleteRoadId(null);
  }

  return { roadData, confirmDeleteRoadId, handleDeleteRequest, handleDeleteConfirm, handleDeleteCancel };
}