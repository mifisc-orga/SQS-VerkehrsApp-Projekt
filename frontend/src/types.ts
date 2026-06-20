/** Possible risk levels for a motorway */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/** Represents a single traffic event */
export interface TrafficEvent {
  /** Unique event ID */
  id: string;
  /** Motorway identifier, e.g. "A3" */
  roadId: string;
  /** Short title of the event */
  title: string;
  /** Subtitle with additional information */
  subtitle: string;
  /** Full description of the event */
  description: string;
  /** Event type, e.g. "ROADWORK" or "CLOSURE" */
  type: string;
  /** Latitude of the event location */
  latitude: number;
  /** Longitude of the event location */
  longitude: number;
  /** Calculated risk level of the event */
  riskLevel: RiskLevel;
}

/** Traffic data for a saved motorway used in the dashboard */
export interface DashboardRoadData {
  /** Motorway ID, e.g. "A3" */
  roadId: string;
  /** List of current traffic events */
  events: TrafficEvent[];
  /** Calculated risk score for the motorway */
  riskScore: number;
}