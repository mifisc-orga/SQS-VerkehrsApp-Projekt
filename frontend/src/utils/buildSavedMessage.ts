/**
 * Builds a user-facing message based on the results of saving favourite roads.
 * Returns a German string describing how many roads were saved or already existed.
 */
export function buildSavedMessage(results: PromiseSettledResult<unknown>[]): string {
  const saved = results.filter(r => r.status === 'fulfilled').length;
  const already = results.length - saved;
  if (saved > 0) {
    return already > 0
      ? `${saved} gespeichert, ${already} bereits vorhanden.`
      : 'Favouriten gespeichert!';
  }
  return 'Alle Autobahnen sind bereits in deinen Favouriten.';
}
