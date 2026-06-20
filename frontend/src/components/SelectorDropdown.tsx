import { RoadOption } from './RoadOption';

/** Props for the motorway selector dropdown list */
interface SelectorDropdownProps {
  /** List of available motorway identifiers to display */
  readonly roads: string[];
  /** Currently selected motorway identifiers */
  readonly selected: string[];
  /** Maximum number of selectable motorways */
  readonly max: number;
  /** Called when a motorway option is toggled */
  readonly onToggle: (road: string) => void;
}

/**
 * Dropdown list of available motorways for the AutobahnSelector.
 * Shows a warning banner when the selection limit is reached.
 */
export function SelectorDropdown({ roads, selected, max, onToggle }: SelectorDropdownProps) {
  return (
    <div
      data-testid="autobahn-dropdown"
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        background: 'white',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        boxShadow: 'var(--shadow-md)',
        minWidth: '220px',
        maxHeight: '260px',
        overflowY: 'auto',
        zIndex: 1000,
      }}
    >
      {selected.length >= max && (
        <div style={{
          padding: '8px 12px',
          background: '#fef9c3',
          color: '#854d0e',
          fontSize: '11px',
          fontWeight: 600,
          borderBottom: '1px solid #fde68a',
        }}>
          Maximum {max} Autobahnen erreicht
        </div>
      )}
      {roads.map((road) => {
        const isSelected = selected.includes(road);
        const isDisabled = !isSelected && selected.length >= max;
        return (
          <RoadOption
            key={road}
            road={road}
            isSelected={isSelected}
            isDisabled={isDisabled}
            onToggle={onToggle}
          />
        );
      })}
    </div>
  );
}