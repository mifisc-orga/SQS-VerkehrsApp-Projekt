import type { TrafficEvent } from '../../types';
import { Dashboard } from '../dashboard/Dashboard';
import { SelectorCard } from '../selector/SelectorCard';
import { TrafficView } from '../traffic/TrafficView';
import { PageHero } from './PageHero';

/** Props for the main content section of the app. */
export interface AppMainProps {
  /** JWT token of the authenticated user, or null */
  readonly token: string | null;
  /** Currently selected motorway identifiers */
  readonly selectedRoads: string[];
  /** Feedback message after saving a favourite, or null */
  readonly savedMessage: string | null;
  /** Increments to trigger a dashboard refresh */
  readonly refreshKey: number;
  /** Whether the traffic data is live */
  readonly isLive: boolean;
  /** Cache timestamp of the traffic data, or null if live */
  readonly cachedAt: string | null;
  /** List of current traffic events */
  readonly events: TrafficEvent[];
  /** Called when the road selection changes */
  readonly onRoadSelect: (roads: string[]) => void;
  /** Called to save the current selection as favourites */
  readonly onSaveFavourite: () => void;
}

/** Main content: road selector, dashboard, and traffic events. */
export function AppMain({ token, selectedRoads, savedMessage, refreshKey, isLive, cachedAt, events, onRoadSelect, onSaveFavourite }: AppMainProps) {
  return (
    <main className="app-main">
      <PageHero />
      <SelectorCard token={token} selectedRoads={selectedRoads} savedMessage={savedMessage} onSelect={onRoadSelect} onSave={onSaveFavourite} />
      {token && <Dashboard token={token} refreshKey={refreshKey} onRoadSelect={roadId => onRoadSelect([roadId])} />}
      <TrafficView isLive={isLive} cachedAt={cachedAt} events={events} />
    </main>
  );
}
