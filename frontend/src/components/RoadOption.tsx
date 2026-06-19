const COLOR_PRIMARY = 'var(--color-primary)';

interface RoadOptionProps {
  road: string;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (road: string) => void;
}

export function RoadOption({ road, isSelected, isDisabled, onToggle }: RoadOptionProps) {
  return (
    <div
      key={road}
      data-testid={`road-option-${road}`}
      onClick={() => !isDisabled && onToggle(road)}
      role="option"
      aria-selected={isSelected}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isDisabled) onToggle(road);
        }
      }}
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
        border: `2px solid ${isSelected ? COLOR_PRIMARY : '#cbd5e1'}`,
        background: isSelected ? COLOR_PRIMARY : 'white',
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
}