import { AutobahnSelector } from './AutobahnSelector';

/** Props for the motorway selector card */
interface SelectorCardProps {
  /** JWT token, or null if not authenticated */
  readonly token: string | null;
  /** Currently selected motorway identifiers */
  readonly selectedRoads: string[];
  /** Feedback message after saving a favourite, or null */
  readonly savedMessage: string | null;
  /** Called when the motorway selection changes */
  readonly onSelect: (roads: string[]) => void;
  /** Called when the user clicks the save button */
  readonly onSave: () => void;
}

/** Card containing the AutobahnSelector and a save-favourite button. */
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