import { useState, useEffect } from 'react';
import { fetchAvailableRoads } from '../services/trafficService';

/** Return type of the useAutobahnSelector hook */
export interface UseAutobahnSelectorResult {
  /** List of all available motorway identifiers */
  roads: string[];
  /** Error message if roads failed to load, or null */
  error: string | null;
  /** Toggles a motorway in the selection */
  toggle: (road: string) => void;
  /** Removes a motorway from the selection */
  remove: (road: string) => void;
}

/**
 * Manages state and side effects for the AutobahnSelector component.
 * Handles road fetching and motorway toggle/remove logic.
 */
export function useAutobahnSelector(
  selected: string[],
  onSelect: (roadIds: string[]) => void,
  max: number,
): UseAutobahnSelectorResult {
  const [roads, setRoads] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableRoads()
      .then(setRoads)
      .catch(() => setError('Autobahnen konnten nicht geladen werden.'));
  }, []);

  function toggle(road: string) {
    let next: string[];
    if (selected.includes(road)) {
      next = selected.filter(r => r !== road);
    } else if (selected.length < max) {
      next = [...selected, road];
    } else {
      return;
    }
    onSelect(next);
  }

  function remove(road: string) {
    onSelect(selected.filter(r => r !== road));
  }

  return { roads, error, toggle, remove };
}
