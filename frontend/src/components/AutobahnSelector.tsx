import { useAutobahnSelector } from '../hooks/useAutobahnSelector';
import { SelectorDropdown } from './SelectorDropdown';
import { SelectedChips } from './SelectedChips';

const COLOR_PRIMARY = 'var(--color-primary)';

/** Props for the motorway multi-select dropdown */
interface AutobahnSelectorProps {
  /** Currently selected motorway identifiers */
  selected: string[];
  /** Called when the selection changes */
  onSelect: (roadIds: string[]) => void;
  /** Maximum number of selectable motorways. Default: 5 */
  max?: number;
}

/** Dropdown component for selecting multiple motorways. */
export function AutobahnSelector({
  selected,
  onSelect,
  max = 5,
}: AutobahnSelectorProps) {
  const { roads, isOpen, setIsOpen, error, wrapperRef, toggle, remove } = useAutobahnSelector(selected, onSelect, max);

  if (error)
    return <p>{error}</p>;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        data-testid="autobahn-selector"
        className="btn btn-ghost"
        onClick={() => setIsOpen((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <i className="ti ti-road" aria-hidden="true"></i>
        Autobahn wählen
        {selected.length > 0 && (
          <span style={{
            background: COLOR_PRIMARY,
            color: 'white',
            borderRadius: '999px',
            padding: '1px 7px',
            fontSize: '11px',
            fontWeight: 700,
          }}>
            {selected.length}/{max}
          </span>
        )}
        <i className={`ti ti-chevron-${isOpen ? 'up' : 'down'}`} aria-hidden="true"></i>
      </button>

      {isOpen && (
        <SelectorDropdown roads={roads} selected={selected} max={max} onToggle={toggle} />
      )}

      <SelectedChips selected={selected} onRemove={remove} />
    </div>
  );
}