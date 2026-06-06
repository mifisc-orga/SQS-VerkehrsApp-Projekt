import {useEffect, useRef, useState} from 'react';
import {fetchAvailableRoads} from '../services/trafficService';

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
      next = selected.filter((r) => r !== road);
    } else if (selected.length < max) {
      next = [...selected, road];
    } else {
      return;
    }
    onSelect(next);
  }

  function remove(road: string) {
    onSelect(selected.filter((r) => r !== road));
  }

  if (error) return <p>{error}</p>;

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
            background: 'var(--color-primary)',
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
              <div
                key={road}
                data-testid={`road-option-${road}`}
                onClick={() => !isDisabled && toggle(road)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 14px',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  background: isSelected ? '#f0fdf9' : 'white',
                  opacity: isDisabled ? 0.4 : 1,
                  borderBottom: '0.5px solid var(--color-border)',
                  fontSize: '13px',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? 'var(--color-primary-dk)' : 'var(--color-text)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!isDisabled) (e.currentTarget as HTMLElement).style.background = isSelected ? '#e0fdf4' : '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = isSelected ? '#f0fdf9' : 'white';
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  border: `2px solid ${isSelected ? 'var(--color-primary)' : '#cbd5e1'}`,
                  background: isSelected ? 'var(--color-primary)' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {isSelected && <i className="ti ti-check" style={{ fontSize: '10px', color: 'white' }} aria-hidden="true"></i>}
                </div>
                {road}
              </div>
            );
          })}
        </div>
      )}

      {selected.length > 0 && (
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
                onClick={(e) => { e.stopPropagation(); remove(road); }}
                aria-label={`${road} entfernen`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-primary)',
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
      )}
    </div>
  );
}
