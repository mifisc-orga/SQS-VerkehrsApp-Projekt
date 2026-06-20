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

const BaseOptionStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px',
  border: 'none', borderBottom: '0.5px solid var(--color-border)',
  fontSize: '13px', transition: 'background 0.15s',
  width: '100%', textAlign: 'left',
};

const CheckboxBaseStyle: React.CSSProperties = {
  width: '16px', height: '16px', borderRadius: '4px', display: 'flex',
  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};

function buildOptionStyle(isDisabled: boolean, isSelected: boolean): React.CSSProperties {
  const style: React.CSSProperties = { ...BaseOptionStyle, opacity: 1, cursor: 'pointer', fontWeight: 400, color: 'var(--color-text)', background: 'white' };
  if (isDisabled) {
    style.cursor = 'not-allowed';
    style.opacity = 0.4;
  }
  if (isSelected) {
    style.background = '#f0fdf9';
    style.fontWeight = 600;
    style.color = 'var(--color-primary-dk)';
  }
  return style;
}

function buildCheckboxStyle(isSelected: boolean): React.CSSProperties {
  const style: React.CSSProperties = { ...CheckboxBaseStyle, border: '2px solid #cbd5e1', background: 'white' };
  if (isSelected) {
    style.border = `2px solid ${COLOR_PRIMARY}`;
    style.background = COLOR_PRIMARY;
  }
  return style;
}

function getTabIndex(isDisabled: boolean): number {
  if (isDisabled) {
    return -1;
  }
  return 0;
}

function handleClick(isDisabled: boolean, road: string, onToggle: (r: string) => void): void {
  if (!isDisabled) {
    onToggle(road);
  }
}

function handleKeyDown(
  e: React.KeyboardEvent<HTMLButtonElement>,
  isDisabled: boolean,
  road: string,
  onToggle: (r: string) => void,
): void {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (!isDisabled) {
      onToggle(road);
    }
  }
}

function onHoverEnter(e: React.MouseEvent<HTMLButtonElement>, isDisabled: boolean, isSelected: boolean): void {
  if (isDisabled) {
    return;
  }
  if (isSelected) {
    (e.currentTarget as HTMLElement).style.background = '#e0fdf4';
  } else {
    (e.currentTarget as HTMLElement).style.background = '#f8fafc';
  }
}

function onHoverLeaveSelected(e: React.MouseEvent<HTMLButtonElement>): void {
  (e.currentTarget as HTMLElement).style.background = '#f0fdf9';
}

function onHoverLeaveDeselected(e: React.MouseEvent<HTMLButtonElement>): void {
  (e.currentTarget as HTMLElement).style.background = 'white';
}

/** A single selectable motorway row with checkbox, keyboard support, and hover styling. */
export function RoadOption({ road, isSelected, isDisabled, onToggle }: RoadOptionProps) {
  const optionStyle = buildOptionStyle(isDisabled, isSelected);
  const checkboxStyle = buildCheckboxStyle(isSelected);
  return (
    <li>
      <button
        data-testid={`road-option-${road}`}
        data-selected={String(isSelected)}
        disabled={isDisabled}
        tabIndex={getTabIndex(isDisabled)}
        style={optionStyle}
        onClick={() => handleClick(isDisabled, road, onToggle)}
        onKeyDown={(e) => handleKeyDown(e, isDisabled, road, onToggle)}
        onMouseEnter={(e) => onHoverEnter(e, isDisabled, isSelected)}
        onMouseLeave={isSelected ? onHoverLeaveSelected : onHoverLeaveDeselected}
      >
        <div style={checkboxStyle}>
          {isSelected && <i className="ti ti-check" style={{ fontSize: '10px', color: 'white' }} aria-hidden="true"></i>}
        </div>
        {road}
      </button>
    </li>
  );
}
