import {useEffect, useRef, useState} from 'react';
import {fetchAvailableRoads} from '../services/trafficService';
import { RoadOption } from './RoadOption';
import { SelectedChips } from './SelectedChips';

/**
 * Eigenschaften für den AutobahnSelector.
 */
interface AutobahnSelectorProps {

  /**
   * Aktuell ausgewählte Autobahnen.
   */
  selected: string[];

  /**
   * Callback zum Aktualisieren der Auswahl.
   */
  onSelect: (roadIds: string[]) => void;

  /**
   * Maximale Anzahl auswählbarer Autobahnen.
   * Standardwert: 5.
   */
  max?: number;
}

const COLOR_PRIMARY = 'var(--color-primary)';

/**
 * Dropdown-Komponente zur Auswahl mehrerer Autobahnen.
 */
export function AutobahnSelector({
                                   selected,
                                   onSelect,
                                   max = 5,
                                 }: AutobahnSelectorProps) {
  const [roads, setRoads] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAvailableRoads()
      .then(setRoads)
      .catch(() => setError('Autobahnen konnten nicht geladen werden.'));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
                onToggle={toggle}
              />
            );
          })}
        </div>
      )}

      <SelectedChips selected={selected} onRemove={remove} />
    </div>
  );
}
