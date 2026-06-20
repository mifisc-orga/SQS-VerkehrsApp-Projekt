/** Props for the confirmation dialog */
interface ConfirmModalProps {
  /** Message displayed in the confirmation dialog */
  readonly message: string;
  /** Label for the confirm button (default: "Entfernen") */
  readonly confirmLabel?: string;
  /** Called when the user confirms the action */
  readonly onConfirm: () => void;
  /** Called when the user cancels or clicks outside */
  readonly onCancel: () => void;
}

/**
 * Generic confirmation dialog with a cancel button and a configurable confirm button.
 */
export function ConfirmModal({ message, confirmLabel = 'Entfernen', onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      className="modal-overlay"
      data-testid="confirm-modal-overlay"
      role="button"
      tabIndex={0}
      aria-label="Abbrechen"
      onClick={onCancel}
      onKeyDown={(e) => { if (e.key === 'Escape') { onCancel(); } }}
    >
      <div
        className="modal"
        data-testid="confirm-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
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
