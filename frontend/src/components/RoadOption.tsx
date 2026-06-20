import React from 'react';

const COLOR_PRIMARY = 'var(--color-primary)';

/** Props for a single selectable motorway option */
interface RoadOptionProps {
  /** Motorway identifier, e.g. "A3" */
  readonly road: string;
  /** Whether this option is currently selected */
  readonly isSelected: boolean;
  /** Whether this option is disabled (selection limit reached) */
  readonly isDisabled: boolean;
  /** Called when the option is toggled */
  readonly onToggle: (road: string) => void;
}

const BASE_OPTION_STYLE: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px',
  borderBottom: '0.5px solid var(--color-border)', fontSize: '13px', transition: 'background 0.15s',
};

const CHECKBOX_BASE_STYLE: React.CSSProperties = {
  width: '16px', height: '16px', borderRadius: '4px', display: 'flex',
  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};

function onHoverEnter(e: React.MouseEvent<HTMLLIElement>, isDisabled: boolean, isSelected: boolean): void {
  if (!isDisabled) { (e.currentTarget as HTMLElement).style.background = isSelected ? '#e0fdf4' : '#f8fafc'; }
}

function onHoverLeave(e: React.MouseEvent<HTMLLIElement>, isSelected: boolean): void {
  (e.currentTarget as HTMLElement).style.background = isSelected ? '#f0fdf9' : 'white';
}

/** A single selectable motorway row with checkbox, keyboard support, and hover styling. */
export function RoadOption({ road, isSelected, isDisabled, onToggle }: RoadOptionProps) {
  const optionStyle: React.CSSProperties = {
    ...BASE_OPTION_STYLE,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    background: isSelected ? '#f0fdf9' : 'white',
    opacity: isDisabled ? 0.4 : 1,
    fontWeight: isSelected ? 600 : 400,
    color: isSelected ? 'var(--color-primary-dk)' : 'var(--color-text)',
  };
  const checkboxStyle: React.CSSProperties = {
    ...CHECKBOX_BASE_STYLE,
    border: `2px solid ${isSelected ? COLOR_PRIMARY : '#cbd5e1'}`,
    background: isSelected ? COLOR_PRIMARY : 'white',
  };
  return (
    <li
      data-testid={`road-option-${road}`}
      onClick={() => !isDisabled && onToggle(road)}
      role="option"
      aria-selected={isSelected}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isDisabled) { onToggle(road); }
        }
      }}
      style={optionStyle}
      onMouseEnter={(e) => onHoverEnter(e, isDisabled, isSelected)}
      onMouseLeave={(e) => onHoverLeave(e, isSelected)}
    >
      <div style={checkboxStyle}>
        {isSelected && <i className="ti ti-check" style={{ fontSize: '10px', color: 'white' }} aria-hidden="true"></i>}
      </div>
      {road}
    </li>
  );
}
