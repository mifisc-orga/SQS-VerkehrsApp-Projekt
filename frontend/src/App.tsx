import { useState, useEffect } from 'react';
import { AutobahnSelector } from './components/AutobahnSelector';
import { IncidentMap, type TrafficEvent } from './components/IncidentMap';
import { RiskBadge } from './components/RiskBadge';
import { Dashboard } from './components/Dashboard';
import { fetchTrafficEvents, login, saveFavourite } from './services/trafficService';

function App() {
  const [events, setEvents] = useState<TrafficEvent[]>([]);
  const [selectedRoad, setSelectedRoad] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    fetchTrafficEvents().then(setEvents).catch(console.error);
  }, []);

  function handleRoadSelect(roadId: string) {
    setSelectedRoad(roadId);
    fetchTrafficEvents(roadId).then(setEvents).catch(console.error);
  }

  async function handleLogin() {
    try {
      const result = await login(usernameInput, passwordInput);
      setToken(result.token);
      setUsername(result.username);
      setShowLogin(false);
    } catch {
      alert('Login fehlgeschlagen');
    }
  }

  async function handleSaveFavourite() {
    if (!token || !selectedRoad) return;
    try {
      await saveFavourite(token, selectedRoad);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch {
      alert('Fehler beim Speichern');
    }
  }

  return (
    <main>
      <h1>Autobahn Safety Monitor</h1>

      {token ? (
        <div data-testid="user-info">Angemeldet als: {username}</div>
      ) : (
        <button data-testid="login-button" onClick={() => setShowLogin(true)}>
          Login
        </button>
      )}

      {showLogin && (
        <div>
          <input
            data-testid="username-input"
            type="text"
            placeholder="Benutzername"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <input
            data-testid="password-input"
            type="password"
            placeholder="Passwort"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button data-testid="submit-login" onClick={handleLogin}>
            Einloggen
          </button>
        </div>
      )}

      <AutobahnSelector onSelect={handleRoadSelect} />

      {token && selectedRoad && (
        <button data-testid="save-favourite-button" onClick={handleSaveFavourite}>
          {selectedRoad} als Favourit speichern
        </button>
      )}

      {savedMessage && (
        <div data-testid="favourite-saved-message">Favourit gespeichert!</div>
      )}

      {token && <Dashboard token={token} />}

      <IncidentMap events={events} />

      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.roadId}</strong> — {event.title}
            <RiskBadge riskLevel={event.riskLevel} />
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;