# 07. Verteilungssicht

## 7.1 Überblick

Die Verteilungssicht beschreibt die physische Verteilung der Softwarekomponenten auf Laufzeitumgebungen sowie die technischen Kommunikationsbeziehungen zwischen den beteiligten Systemen.

Die SQS Verkehrsapp besteht aus einem React/TypeScript-Frontend und einem Spring-Boot-Backend. Das Backend wird als eigenständiger Service betrieben und kommuniziert mit einer relationalen Datenbank sowie einer externen Autobahn-API. Das Frontend wird als statische Anwendung über nginx ausgeliefert und läuft im Browser des Benutzers.

---

## 7.2 Infrastrukturübersicht

### Deployment-Diagramm

![Deployment Diagram](diagrams/Deployment.svg)

---

### Hauptknoten

| Knoten       | Beschreibung                     |
| ------------ | -------------------------------- |
| Client       | Benutzeroberfläche bzw. Frontend |
| Backend      | Spring-Boot-Anwendung            |
| Datenbank    | Persistenz und Cache             |
| Autobahn API | Externe Verkehrsdatenquelle      |

---

## 7.3 Client-Knoten

### React Frontend

Das Frontend ist eine React/TypeScript-Anwendung, die im Browser des Benutzers ausgeführt wird. Im Produktivbetrieb wird sie als statisches Build-Artefakt über nginx ausgeliefert.

### Aufgaben

* Anzeige verfügbarer Autobahnen und Verkehrsereignisse
* Benutzeranmeldung und Registrierung
* Verwaltung gespeicherter Autobahnen
* Dashboard-Darstellung
* Anzeige des Cache-Status bei API-Ausfall

### Technologien

```text
React 19, TypeScript, Vite (Build), nginx (Auslieferung)
```

### Kommunikationsprotokoll

```text
HTTPS
REST
JSON
```

---

## 7.4 Backend-Knoten

### SQS Verkehrsapp

Die zentrale Anwendung wird als Spring-Boot-Service betrieben.

### Enthaltene Komponenten

```text
Controller
Services
Domain Model
Security
Persistence Adapter
API Adapter
Caching
```

---

### Interne Struktur

```
flowchart TB

Controllers

Services

Domain

Ports

Adapters

Controllers --> Services

Services --> Domain

Services --> Ports

Ports --> Adapters
```

---

### Aufgaben

### Fachlogik

* Risikobewertung
* Verkehrsdatenverarbeitung
* Dashboard-Berechnung

### Sicherheit

* JWT-Erzeugung
* JWT-Validierung
* Autorisierung

### Infrastruktur

* Datenbankzugriffe
* API-Aufrufe
* Cache-Management

---

## 7.5 Datenbankknoten

### Überblick

Die Datenbank dient sowohl der Persistenz fachlicher Daten als auch der Speicherung von Cache-Informationen.

### Persistierte Bereiche

```text
Benutzer
Favoriten
Verkehrsdaten-Cache
Autobahn-Cache
```

---

### Datenmodell

```mermaid
erDiagram

APP_USERS {
    UUID id PK
    STRING username
    STRING password_hash
}

SAVED_ROADS {
    UUID id PK
    UUID user_id
    STRING road_id
}

CACHED_ROAD_EVENT {
    LONG id PK
    STRING road_id
    STRING event_id
    STRING title
    STRING type
    DATETIME cached_at
}

AVAILABLE_ROADS {
    STRING road_id PK
}

APP_USERS ||--o{ SAVED_ROADS : owns
```

---

### Tabelle APP_USERS

Speichert Benutzerinformationen.

### Attribute

```text
id
username
password_hash
```

---

### Tabelle SAVED_ROADS

Speichert Favoriten eines Benutzers.

### Attribute

```text
id
user_id
road_id
```

### Einschränkung

```text
UNIQUE(user_id, road_id)
```

Eine Autobahn kann nur einmal pro Benutzer gespeichert werden.

---

### Tabelle CACHED_ROAD_EVENT

Speichert Verkehrsmeldungen für den Fallback-Betrieb.

### Attribute

```text
road_id
event_id
type
latitude
longitude
cached_at
```

---

### Tabelle AVAILABLE_ROADS

Speichert verfügbare Autobahnen.

### Attribute

```text
road_id
```

---

## 7.6 Externer Systemknoten

### Autobahn API

Die Autobahn API stellt die primäre Quelle für Verkehrsinformationen dar.

### Gelieferte Daten

* Warnungen
* Baustellen
* Sperrungen
* verfügbare Autobahnen

---

### Kommunikationsweg

```mermaid
sequenceDiagram

participant Backend

participant AutobahnAPI

Backend->>AutobahnAPI: HTTP Request

AutobahnAPI-->>Backend: JSON Response
```

---

### Datenformat

```text
JSON
```

---

### HTTP-Client

Für die Kommunikation wird verwendet:

```text
Spring WebClient
```

---

## 7.7 Cache-Infrastruktur

### Ziel

Der Cache dient der Erhöhung der Verfügbarkeit.

### Gespeicherte Daten

```text
Verkehrsmeldungen
Autobahnlisten
```

---

### Cache-Ablauf

```mermaid
flowchart LR

API["Autobahn API"]

Backend["Backend"]

Cache["Datenbank-Cache"]

API --> Backend

Backend --> Cache

Cache --> Backend
```

---

### Vorteile

* Ausfallsicherheit
* Schnellere Antworten
* Entlastung externer Systeme

---

## 7.8 Sicherheitsinfrastruktur

### Authentifizierung

JWT-basierte Authentifizierung.

### Ablauf

```mermaid
flowchart LR

User --> Login

Login --> JWT

JWT --> Request

Request --> JwtFilter

JwtFilter --> SecurityContext
```

---

### Sicherheitskomponenten

```text
SecurityConfig
JwtAuthenticationFilter
JwtService
```

---

## 7.9 Verteilungsrelevante Qualitätsanforderungen

### Verfügbarkeit

Die Anwendung muss auch bei Ausfällen der Autobahn API eingeschränkt funktionsfähig bleiben.

### Umsetzung

* Cache-Fallback
* Retry
* Circuit Breaker

---

### Skalierbarkeit

Die Anwendung verwendet:

```text
Stateless Authentication
```

Dadurch kann die Backend-Anwendung horizontal skaliert werden.

---

### Sicherheit

Die Kommunikation erfolgt ausschließlich über:

```text
HTTPS
JWT
```

---

## 7.10 Betriebsumgebung

### Entwicklungsumgebung

Mögliche lokale Ausführung:

```text
Backend:  Spring Boot, H2
Frontend: Vite Dev Server (localhost:5173)
```

---

### Testumgebung

Mögliche Testkonfiguration:

```text
Backend:  Spring Test, JUnit, Mockito, H2
Frontend: Vitest (Unit-Tests), Playwright (E2E), gemockte API-Antworten
```

---

### Produktivumgebung

Mögliche Produktivkonfiguration:

```text
Backend:  Spring Boot, PostgreSQL, HTTPS Reverse Proxy
Frontend: Vite Build → nginx (Docker Container)
```

---

## 7.11 Zusammenfassung

Die Verteilungssicht zeigt die physische Struktur der Anwendung.

Wesentliche Eigenschaften:

* React/TypeScript-Frontend, ausgeliefert über nginx
* Eigenständige Spring-Boot-Backend-Anwendung
* REST-basierte Kommunikation zwischen Frontend und Backend
* Relationale Datenbank (PostgreSQL)
* Externe Autobahn-API
* Datenbankgestützter Cache
* JWT-basierte Sicherheit
* Unterstützung für Ausfallsicherheit und Skalierung

Die dargestellte Infrastruktur bildet die Grundlage für die in Kapitel 8 beschriebenen querschnittlichen Konzepte.

