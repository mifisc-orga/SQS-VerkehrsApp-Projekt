/**
 * Formats an ISO timestamp as local time (HH:MM).
 * Returns an empty string if the input is null.
 */
export function formatCachedAt(iso: string | null): string {
  if (!iso) return ''; 
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}
