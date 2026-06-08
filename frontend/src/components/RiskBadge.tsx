export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface RiskBadgeProps {
  riskLevel: RiskLevel;
}

const labels: Record<RiskLevel, string> = {
  LOW: 'Niedrig',
  MEDIUM: 'Mittel',
  HIGH: 'Hoch',
};

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
