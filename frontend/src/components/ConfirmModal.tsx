/** Props for the confirmation dialog */
interface ConfirmModalProps {
  /** Message displayed in the confirmation dialog */
  message: string;
  /** Label for the confirm button (default: "Entfernen") */
  confirmLabel?: string;
  /** Called when the user confirms the action */
  onConfirm: () => void;
  /** Called when the user cancels or clicks outside */
  onCancel: () => void;
}

/**
 * Generic confirmation dialog with a cancel button and a configurable confirm button.
 */
export function ConfirmModal({ message, confirmLabel = 'Entfernen', onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      className="modal-overlay"
      data-testid="confirm-modal-overlay"
      onClick={onCancel}
      onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}
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
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
