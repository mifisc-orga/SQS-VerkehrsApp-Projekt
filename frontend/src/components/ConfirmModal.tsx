/** Props für den Bestätigungsdialog */
interface ConfirmModalProps {
  /** Nachricht, die im Bestätigungsdialog angezeigt wird */
  message: string;
  /** Wird aufgerufen, wenn der Nutzer die Aktion bestätigt */
  onConfirm: () => void;
  /** Wird aufgerufen, wenn der Nutzer abbricht oder außerhalb klickt */
  onCancel: () => void;
}

export function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      className="modal-overlay"
      data-testid="confirm-modal-overlay"
      onClick={onCancel}
      onKeyDown={(e) => { if (e.key === 'Escape') { onCancel(); } }}
      role="presentation"
    >
      <div
        className="modal"
        data-testid="confirm-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <p style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn" data-testid="confirm-cancel" onClick={onCancel}>
            Abbrechen
          </button>
          <button className="btn btn-danger" data-testid="confirm-ok" onClick={onConfirm}>
            Entfernen
          </button>
        </div>
      </div>
    </div>
  );
}
