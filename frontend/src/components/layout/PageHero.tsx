/** Title and description banner shown at the top of the main content area. */
export function PageHero() {
  return (
    <div className="page-hero">
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg,#0f766e,#1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.3rem' }}>
        Echtzeit-Verkehrsübersicht
      </h2>
      <p>Aktuelle Ereignisse, Risikobewertung und gespeicherte Autobahnen auf einen Blick.</p>
    </div>
  );
}
