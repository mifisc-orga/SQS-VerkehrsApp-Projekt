import { useState } from 'react';
import { useAutobahnSelector } from '../../hooks/useAutobahnSelector';

const INITIAL_VISIBLE = 10;

/** Props for the motorway multi-select chip grid */
interface AutobahnSelectorProps {
  /** Currently selected motorway identifiers */
  readonly selected: string[];
  /** Called when the selection changes */
  readonly onSelect: (roadIds: string[]) => void;
  /** Maximum number of selectable motorways. Default: 5 */
  readonly max?: number;
}

/** Single toggleable motorway chip. Green when selected, ghost when not, disabled when max reached. */
function RoadChip({ road, isSelected, isDisabled, onToggle }: {
  readonly road: string;
  readonly isSelected: boolean;
  readonly isDisabled: boolean;
  readonly onToggle: (road: string) => void;
}) {
  return (
    <button
      data-testid={`road-chip-${road}`}
      className={`road-chip${isSelected ? ' road-chip--selected' : ''}${isDisabled ? ' road-chip--disabled' : ''}`}
      onClick={() => onToggle(road)}
      disabled={isDisabled}
      aria-pressed={isSelected}
    >
      {road}{isSelected && <span aria-hidden="true"> ×</span>}
    </button>
  );
}

/** Expand/collapse button shown when there are more than INITIAL_VISIBLE roads. */
function ShowMoreButton({ total, expanded, onToggle }: {
  readonly total: number;
  readonly expanded: boolean;
  readonly onToggle: () => void;
}) {
  return (
    <div style={{ textAlign: 'center', marginTop: '14px' }}>
      <button data-testid="show-more-button" className="show-more-btn" onClick={onToggle}>
        <i className={`ti ti-chevron-${expanded ? 'up' : 'down'}`} aria-hidden="true"></i>
        {expanded ? 'Weniger anzeigen' : `Alle ${total} Autobahnen anzeigen`}
      </button>
    </div>
  );
}

/** Chip grid for selecting multiple motorways with expand/collapse support. */
export function AutobahnSelector({ selected, onSelect, max = 5 }: AutobahnSelectorProps) {
  const { roads, error, toggle } = useAutobahnSelector(selected, onSelect, max);
  const [expanded, setExpanded] = useState(false);

  if (error) return <p>{error}</p>;

  const atMax = selected.length >= max;
  const visible = expanded ? roads : roads.slice(0, INITIAL_VISIBLE);

  return (
    <div data-testid="autobahn-selector">
      {atMax && <p className="selector-max-hint" data-testid="max-reached-hint">Maximum {max} Autobahnen erreicht</p>}
      <div className="road-chip-grid">
        {visible.map(road => (
          <RoadChip key={road} road={road} isSelected={selected.includes(road)} isDisabled={atMax && !selected.includes(road)} onToggle={toggle} />
        ))}
      </div>
      {roads.length > INITIAL_VISIBLE && <ShowMoreButton total={roads.length} expanded={expanded} onToggle={() => setExpanded(v => !v)} />}
    </div>
  );
}
