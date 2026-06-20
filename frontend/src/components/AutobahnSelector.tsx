import {useEffect, useRef, useState} from 'react';
import {fetchAvailableRoads} from '../services/trafficService';
import { SelectorDropdown } from './SelectorDropdown';
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
        <SelectorDropdown roads={roads} selected={selected} max={max} onToggle={toggle} />
      )}

      <SelectedChips selected={selected} onRemove={remove} />
    </div>
  );
}
