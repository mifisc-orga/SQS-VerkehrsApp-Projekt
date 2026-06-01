# API Dokumentation

## Auth API

### POST /api/auth/login
Authentifiziert einen Benutzer.

### POST /api/auth/register
Registriert einen Benutzer.

## Traffic API

### GET /api/traffic
Liefert Verkehrsdaten für alle Autobahnen.

### GET /api/traffic/{roadId}
Liefert Verkehrsdaten für eine spezifische Autobahn.

## Saved Roads API

### GET /api/saved-roads
Liefert gespeicherte Straßen des angemeldeten Benutzers.

### POST /api/saved-roads
Speichert eine Straße für den angemeldeten Benutzers.

### DELETE /api/saved-roads/{roadId}
Entfernt eine gespeicherte Straße für den angemeldeten Benutzers.

## Dashboard API

### GET /api/dashboard/saved-road-traffic
Liefert Verkehrsdaten für alle gespeicherten Straßen des angemeldeten Benutzers.


# Angelegter Testuser:

username: testuser
password: password

hinterlegteAutobahnen: A3, A92