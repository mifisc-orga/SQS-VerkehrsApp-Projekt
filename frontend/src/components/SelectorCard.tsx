import { AutobahnSelector } from './AutobahnSelector';

interface SelectorCardProps {
  token: string | null;
  selectedRoads: string[];
  savedMessage: string | null;
  onSelect: (roads: string[]) => void;
  onSave: () => void;
}

export function SelectorCard({ token, selectedRoads, savedMessage, onSelect, onSave }: SelectorCardProps) {
  return (
    <div className="card">
      <div className="section-title">Autobahn auswählen</div>
      <AutobahnSelector selected={selectedRoads} onSelect={onSelect} max={5} />
      {token && selectedRoads.length > 0 && (
        <button
          className="btn btn-success"
          data-testid="save-favourite-button"
          onClick={onSave}
          style={{ marginTop: '12px' }}
        >
          <i className="ti ti-star" aria-hidden="true"></i>
          {selectedRoads.length === 1 ? selectedRoads[0] : `${selectedRoads.length} Autobahnen`} speichern
        </button>
      )}
      {savedMessage && (
        <div
          className={savedMessage.includes('bereits') ? 'banner-warning' : 'banner-success'}
          data-testid="favourite-saved-message"
          style={{ marginTop: '10px' }}
        >
          <i className={`ti ${savedMessage.includes('bereits') ? 'ti-info-circle' : 'ti-check'}`} aria-hidden="true"></i> {savedMessage}
        </div>
      )}
    </div>
  );
}