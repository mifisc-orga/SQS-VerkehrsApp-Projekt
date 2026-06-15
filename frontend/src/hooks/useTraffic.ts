import { useState, useEffect } from 'react';
import { fetchTrafficEvents } from '../services/trafficService';
import { type TrafficEvent } from '../components/IncidentMap';

/** Return type of the useTraffic hook */
export interface UseTrafficResult {
  /** Traffic events filtered by the selected roads */
  events: TrafficEvent[];
  /** Currently selected road IDs */
  selectedRoads: string[];
  /** Whether the data is live or served from cache */
  isLive: boolean;
  /** ISO timestamp of the last cache update, or null */
  cachedAt: string | null;
  /** Updates the road selection and filters the displayed events */
  handleRoadSelect: (roadIds: string[]) => void;
}

/**
 * Fetches traffic data on mount and manages road selection state.
 * Filters displayed events whenever the road selection changes.
 */
export function useTraffic(): UseTrafficResult {
  const [allEvents, setAllEvents] = useState<TrafficEvent[]>([]);
  const [events, setEvents] = useState<TrafficEvent[]>([]);
  const [selectedRoads, setSelectedRoads] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [cachedAt, setCachedAt] = useState<string | null>(null);

  async function loadTrafficData(): Promise<void> {
    try {
      const result = await fetchTrafficEvents();
      setAllEvents(result.events);
      setIsLive(result.live);
      setCachedAt(result.cachedAt);
      const available = [...new Set(result.events.map(e => e.roadId))].sort();
      const defaults = available.slice(0, 3);
      setSelectedRoads(defaults);
      setEvents(result.events.filter(e => defaults.includes(e.roadId)));
    } catch {
      // Traffic data failed to load — app remains functional
    }
  }

  useEffect(() => {
    loadTrafficData();
  }, []);

  function handleRoadSelect(roadIds: string[]): void {
    setSelectedRoads(roadIds);
    if (roadIds.length === 0) {
      setEvents(allEvents);
    } else {
      setEvents(allEvents.filter(e => roadIds.includes(e.roadId)));
    }
  }

  return { events, selectedRoads, isLive, cachedAt, handleRoadSelect };
}
