# Backend – Autobahn Safety Monitor

Dieses Backend stellt die REST-API für den **Autobahn Safety Monitor** bereit.

Es übernimmt unter anderem:

- die Benutzerverwaltung
- die Authentifizierung
- das Abrufen von Verkehrsdaten
- die Verwaltung gespeicherter Autobahnen
- die Bereitstellung von Dashboard-Daten

## API-Übersicht

Die Backend-API ist in mehrere Bereiche unterteilt:

- **Auth API** – Registrierung und Anmeldung von Benutzern
- **Traffic API** – Abruf von Verkehrsdaten
- **Saved Roads API** – Verwaltung gespeicherter Autobahnen
- **Dashboard API** – Verkehrsdaten für das persönliche Dashboard

---

## Auth API

Die Auth API stellt Endpunkte zur Registrierung und Anmeldung bereit.

### `POST /api/auth/login`

Authentifiziert einen Benutzer anhand der übergebenen Zugangsdaten.

Dieser Endpunkt wird verwendet, um einen bestehenden Benutzer anzumelden.

---

### `POST /api/auth/register`

Registriert einen neuen Benutzer.

Über diesen Endpunkt kann ein neuer Benutzeraccount erstellt werden.

---

## Traffic API

Die Traffic API liefert Verkehrsinformationen zu Autobahnen.

### `GET /api/traffic`

Liefert Verkehrsdaten für alle verfügbaren Autobahnen.

Dieser Endpunkt gibt eine Übersicht über aktuelle Verkehrsdaten zurück, zum Beispiel Gefahrenstellen, Unfälle oder weitere relevante Verkehrsinformationen.

---

### `GET /api/traffic/{roadId}`

Liefert Verkehrsdaten für eine bestimmte Autobahn.

Beispiel:

```http
GET /api/traffic/A3
```

Über die `roadId` kann gezielt eine Autobahn abgefragt werden, zum Beispiel `A3` oder `A92`.

---

## Saved Roads API

Die Saved Roads API verwaltet die vom angemeldeten Benutzer gespeicherten Autobahnen.

### `GET /api/saved-roads`

Liefert alle gespeicherten Autobahnen des angemeldeten Benutzers.

Dieser Endpunkt gibt die Autobahnen zurück, die der Benutzer in seinem persönlichen Bereich gespeichert hat.

---

### `POST /api/saved-roads`

Speichert eine Autobahn für den angemeldeten Benutzer.

Mit diesem Endpunkt kann ein Benutzer eine Autobahn zu seiner persönlichen Liste hinzufügen.

---

### `DELETE /api/saved-roads/{roadId}`

Entfernt eine gespeicherte Autobahn für den angemeldeten Benutzer.

Beispiel:

```http
DELETE /api/saved-roads/A3
```

Die angegebene Autobahn wird aus der persönlichen Liste des angemeldeten Benutzers entfernt.

---

## Dashboard API

Die Dashboard API liefert Daten für das persönliche Dashboard des Benutzers.

### `GET /api/dashboard/saved-road-traffic`

Liefert Verkehrsdaten für alle gespeicherten Autobahnen des angemeldeten Benutzers.

Dieser Endpunkt kombiniert die gespeicherten Autobahnen des Benutzers mit den aktuellen Verkehrsdaten. Dadurch kann das Dashboard relevante Informationen zu den favorisierten Autobahnen anzeigen.

---

## Testbenutzer

Für Testzwecke ist folgender Benutzer angelegt:

```text
username: testuser
password: test123
```

---

## Beispielhafte Nutzung

Nach erfolgreicher Anmeldung kann der Testbenutzer seine gespeicherten Autobahnen abrufen:

```http
GET /api/saved-roads
```

Außerdem können die Verkehrsdaten für die gespeicherten Autobahnen im Dashboard geladen werden:

```http
GET /api/dashboard/saved-road-traffic
```

---

## Hinweise

Einige Endpunkte sind benutzerbezogen und setzen einen angemeldeten Benutzer voraus. Dazu gehören insbesondere die Endpunkte der **Saved Roads API** und der **Dashboard API**.
