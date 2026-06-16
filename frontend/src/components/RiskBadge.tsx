/** Possible risk levels for a motorway */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/** Props for the RiskBadge component */
interface RiskBadgeProps {
  /** Risk level of the motorway: LOW, MEDIUM, or HIGH */
  riskLevel: RiskLevel;
}

const labels: Record<RiskLevel, string> = {
  LOW: 'Niedrig',
  MEDIUM: 'Mittel',
  HIGH: 'Hoch',
};

/**
 * Displays the risk level of a traffic event as a coloured badge.
 * LOW = green, MEDIUM = yellow, HIGH = red.
 */
export function RiskBadge({ riskLevel }: RiskBadgeProps) {
  const className = `risk-badge risk-${riskLevel.toLowerCase()}`;
  return (
    <span data-testid="risk-badge">
      <span
        className={className}
        data-testid={`risk-badge-${riskLevel}`}
      >
        {labels[riskLevel]}
      </span>
    </span>
  );
}
