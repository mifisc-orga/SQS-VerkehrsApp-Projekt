const COLOR_PRIMARY = 'var(--color-primary)';

/** Props for the selected motorway chips bar */
interface SelectedChipsProps {
  /** Currently selected motorway identifiers */
  readonly selected: string[];
  /** Called when a chip's remove button is clicked */
  readonly onRemove: (road: string) => void;
}

/** Displays a row of removable chips for each selected motorway. */
export function SelectedChips({ selected, onRemove }: SelectedChipsProps) {
  if (selected.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
      {selected.map((road) => (
        <span
          key={road}
          data-testid={`selected-chip-${road}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: '#f0fdf9',
            border: '1.5px solid #5eead4',
            borderRadius: '999px',
            padding: '3px 10px 3px 10px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-primary-dk)',
          }}
        >
          {road}
          <button
            data-testid={`chip-remove-${road}`}
            onClick={(e) => { e.stopPropagation(); onRemove(road); }}
            aria-label={`${road} entfernen`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: COLOR_PRIMARY,
              padding: '0 2px',
              fontSize: '14px',
              lineHeight: 1,
              minWidth: '14px',
              minHeight: '14px',
            }}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}