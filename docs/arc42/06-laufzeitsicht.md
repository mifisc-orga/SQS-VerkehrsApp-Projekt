# 06. Laufzeitsicht

## 6.1 Überblick

Die Laufzeitsicht beschreibt das dynamische Verhalten der SQS Verkehrsapp während der Ausführung.

Im Fokus stehen die wichtigsten fachlichen Abläufe:

* Benutzerregistrierung
* Benutzeranmeldung
* Abruf von Verkehrsdaten
* Dashboard-Abfrage
* Speichern favorisierter Autobahnen
* Ausfallszenarien mit Cache-Fallback

Die dargestellten Szenarien zeigen die Zusammenarbeit der wichtigsten Architekturbausteine.


---

## 6.2 Benutzerregistrierung

### Ziel

Ein neuer Benutzer registriert sich im System.

### Ablauf

```mermaid
sequenceDiagram

actor User

participant AuthController
participant AuthService
participant UserPort
participant UserAdapter
participant UserRepository

User->>AuthController: POST /api/auth/register

AuthController->>AuthService: register(username,password)

AuthService->>UserPort: existsByUsername()

UserPort->>UserAdapter: existsByUsername()

UserAdapter->>UserRepository: existsByUsername()

UserRepository-->>UserAdapter: false

UserAdapter-->>UserPort: false

AuthService->>UserPort: save(user)

UserPort->>UserAdapter: save(user)

UserAdapter->>UserRepository: save(entity)

UserRepository-->>UserAdapter: entity

UserAdapter-->>UserPort: AppUser

UserPort-->>AuthService: AppUser

AuthService-->>AuthController: AppUser

AuthController-->>User: JWT Token
```

---

## 6.3 Benutzeranmeldung

### Ziel

Ein Benutzer authentifiziert sich und erhält ein JWT.

### Ablauf

```mermaid
sequenceDiagram

actor User

participant AuthController
participant AuthService
participant UserPort
participant JwtService

User->>AuthController: POST /api/auth/login

AuthController->>AuthService: login()

AuthService->>UserPort: findByUsername()

UserPort-->>AuthService: AppUser

AuthService-->>AuthController: AppUser

AuthController->>JwtService: generateToken()

JwtService-->>AuthController: JWT

AuthController-->>User: JWT
```

---

## 6.4 Authentifizierte Anfrage

### Ziel

Ein Benutzer ruft eine geschützte Ressource auf.

### Ablauf

```mermaid
sequenceDiagram

actor User

participant JwtAuthenticationFilter
participant JwtService
participant SecurityContext
participant Controller

User->>JwtAuthenticationFilter: Authorization: Bearer Token

JwtAuthenticationFilter->>JwtService: isTokenValid()

alt Token gültig

    JwtAuthenticationFilter->>JwtService: extractUserId()

    JwtService-->>JwtAuthenticationFilter: UUID

    JwtAuthenticationFilter->>SecurityContext: Authentication setzen

end

JwtAuthenticationFilter->>Controller: Request weiterleiten
```

---

## 6.5 Verkehrsdaten für eine Autobahn abrufen

### Ziel

Abruf aller Verkehrsmeldungen für eine bestimmte Autobahn.

### Ablauf

```mermaid
sequenceDiagram

actor User

participant TrafficController
participant TrafficService
participant AutobahnApiPort
participant ResilientAdapter
participant AutobahnApiClient
participant AutobahnAPI
participant Mapper

User->>TrafficController: GET /api/traffic/A3

TrafficController->>TrafficService: getTrafficEvents(A3)

TrafficService->>AutobahnApiPort: getTrafficEvents(A3)

AutobahnApiPort->>ResilientAdapter: Request

ResilientAdapter->>AutobahnApiClient: fetchTrafficEvents()

AutobahnApiClient->>AutobahnAPI: HTTP Request

AutobahnAPI-->>AutobahnApiClient: JSON DTO

AutobahnApiClient->>Mapper: map()

Mapper-->>AutobahnApiClient: RoadEvents

AutobahnApiClient-->>ResilientAdapter: Events

ResilientAdapter-->>TrafficService: TrafficEventsResult

TrafficService-->>TrafficController: Result

TrafficController-->>User: JSON Response
```

---

## 6.6 Risikobewertung von Verkehrsdaten

### Ziel

Berechnung eines normierten Risikoscores.

### Ablauf

```mermaid
sequenceDiagram

participant TrafficService
participant RiskScoreCalculator

TrafficService->>RiskScoreCalculator: calculateScore(events)

RiskScoreCalculator->>RiskScoreCalculator: Ereignisse bewerten

RiskScoreCalculator->>RiskScoreCalculator: Punkte aufsummieren

RiskScoreCalculator->>RiskScoreCalculator: Normierung 0-100

RiskScoreCalculator-->>TrafficService: RiskScore
```

---

## 6.7 Dashboard-Abfrage

### Ziel

Anzeige aller gespeicherten Autobahnen eines Benutzers inklusive Verkehrsdaten.

### Ablauf

```mermaid
sequenceDiagram

actor User

participant DashboardController
participant DashboardTrafficService
participant SavedRoadPort
participant AutobahnApiPort

User->>DashboardController: GET /api/dashboard

DashboardController->>DashboardTrafficService: getTrafficForSavedRoads()

DashboardTrafficService->>SavedRoadPort: findByUserId()

SavedRoadPort-->>DashboardTrafficService: SavedRoads

loop Für jede gespeicherte Autobahn

    DashboardTrafficService->>AutobahnApiPort: getTrafficEvents()

    AutobahnApiPort-->>DashboardTrafficService: TrafficEventsResult

end

DashboardTrafficService-->>DashboardController: SavedRoadTrafficResult

DashboardController-->>User: Dashboard Daten
```

---

## 6.8 Autobahn speichern

### Ziel

Ein Benutzer speichert eine Autobahn als Favorit.

### Ablauf

```mermaid
sequenceDiagram

actor User

participant SavedRoadController
participant SavedRoadService
participant SavedRoadPort

User->>SavedRoadController: POST /api/saved-roads

SavedRoadController->>SavedRoadService: saveRoad()

SavedRoadService->>SavedRoadPort: existsByUserIdAndRoadId()

SavedRoadPort-->>SavedRoadService: false

SavedRoadService->>SavedRoadPort: save()

SavedRoadPort-->>SavedRoadService: SavedRoad

SavedRoadService-->>SavedRoadController: SavedRoad

SavedRoadController-->>User: 201 Created
```

---

## 6.9 Cache-Aktualisierung

### Ziel

Speicherung neu geladener Verkehrsdaten.

### Ablauf

```mermaid
sequenceDiagram

participant ResilientAdapter
participant AutobahnCacheWriter
participant RoadEventCachePort

ResilientAdapter->>AutobahnCacheWriter: saveTrafficEvents()

AutobahnCacheWriter->>RoadEventCachePort: save()

RoadEventCachePort-->>AutobahnCacheWriter: gespeichert
```

Die Speicherung erfolgt asynchron und beeinflusst die Antwortzeit der Benutzeranfrage nicht.

---

## 6.10 Ausfallszenario – API nicht erreichbar

### Ziel

Bereitstellung von Verkehrsdaten trotz Ausfall der externen API.

### Ablauf

```mermaid
sequenceDiagram

participant TrafficService
participant ResilientAdapter
participant AutobahnAPI
participant Cache

TrafficService->>ResilientAdapter: getTrafficEvents()

ResilientAdapter->>AutobahnAPI: Request

AutobahnAPI--x ResilientAdapter: Fehler

ResilientAdapter->>Cache: findByRoadId()

alt Cache vorhanden

    Cache-->>ResilientAdapter: Cached Data

    ResilientAdapter-->>TrafficService: Cached Result

else Kein Cache vorhanden

    ResilientAdapter-->>TrafficService: TrafficDataUnavailableException

end
```

---

## 6.11 Ausfallszenario – Verfügbare Autobahnen

### Ziel

Bereitstellung der Autobahnliste bei API-Ausfall.

### Ablauf

```mermaid
sequenceDiagram

participant ResilientAdapter
participant AutobahnAPI
participant AvailableRoadCache

ResilientAdapter->>AutobahnAPI: getAvailableRoadIds()

AutobahnAPI--x ResilientAdapter: Fehler

ResilientAdapter->>AvailableRoadCache: findAll()

AvailableRoadCache-->>ResilientAdapter: Cached Roads

ResilientAdapter-->>Client: Cached Roads
```

---

## 6.12 Fehlerbehandlung

### Ziel

Einheitliche Fehlerkommunikation.

### Ablauf

```mermaid
sequenceDiagram

participant Service
participant Exception
participant GlobalExceptionHandler
participant Client

Service-->>Exception: Fehler

Exception-->>GlobalExceptionHandler: Exception

GlobalExceptionHandler-->>Client: ApiErrorResponse
```

---

## 6.13 Frontend – Seitenstart und Datenladen

### Ziel

Der Benutzer öffnet die Anwendung. Das Frontend lädt alle Autobahnen und Verkehrsdaten automatisch beim Start.

### Ablauf

```mermaid
sequenceDiagram

actor User
participant Browser
participant useAutobahnSelector
participant useTraffic
participant trafficService
participant Backend

User->>Browser: Seite öffnen

Browser->>useAutobahnSelector: mount → fetchAvailableRoads()
Browser->>useTraffic: mount → fetchTrafficEvents()

useAutobahnSelector->>trafficService: fetchAvailableRoads()
trafficService->>Backend: GET /api/traffic

useTraffic->>trafficService: fetchTrafficEvents()
trafficService->>Backend: GET /api/traffic

Backend-->>trafficService: TrafficEventsResult (live/cached)
trafficService-->>useAutobahnSelector: string[] (Autobahnliste)
trafficService-->>useTraffic: events, live, cachedAt

useAutobahnSelector-->>Browser: verfügbare Autobahnen anzeigen
useTraffic-->>Browser: erste 3 Autobahnen vorauswählen, Ereignisse anzeigen
```

---

## 6.14 Frontend – Benutzeranmeldung

### Ziel

Ein Benutzer meldet sich über das Auth-Modal an.

### Ablauf

```mermaid
sequenceDiagram

actor User
participant AuthModal
participant useApp
participant useAuth
participant trafficService
participant Backend

User->>AuthModal: Login-Button klicken
AuthModal-->>User: Modal öffnen (showLogin = true)

User->>AuthModal: Benutzername und Passwort eingeben
User->>AuthModal: Anmelden klicken

AuthModal->>useApp: handleLoginSubmit()
useApp->>useApp: validateAuthForm() → kein Fehler

useApp->>useAuth: handleLogin(username, password)
useAuth->>trafficService: login(username, password)
trafficService->>Backend: POST /api/auth/login

alt Anmeldung erfolgreich
    Backend-->>trafficService: JWT Token
    trafficService-->>useAuth: { token }
    useAuth-->>useApp: true
    useApp-->>AuthModal: Modal schließen
else Anmeldung fehlgeschlagen
    Backend-->>trafficService: 401
    trafficService-->>useAuth: Fehler
    useAuth-->>useApp: false
    useApp-->>AuthModal: Modal offen lassen, Fehlermeldung anzeigen
end
```

---

## 6.15 Frontend – Cache-Anzeige bei API-Ausfall

### Ziel

Das Backend liefert gecachte Daten. Das Frontend zeigt einen Cache-Indikator an.

### Ablauf

```mermaid
sequenceDiagram

participant useTraffic
participant trafficService
participant Backend
participant PageHero
participant RiskBadge

useTraffic->>trafficService: fetchTrafficEvents()
trafficService->>Backend: GET /api/traffic

Note over Backend: Autobahn-API nicht erreichbar → Cache-Fallback

Backend-->>trafficService: { events, live: false, cachedAt: "2026-06-22T19:38:00" }
trafficService-->>useTraffic: { events, live: false, cachedAt }

useTraffic-->>PageHero: isLive=false, cachedAt übergeben
PageHero-->>User: "Gecacht · 19:38" anzeigen

useTraffic-->>RiskBadge: riskLevel (kann null sein bei gecachten Daten)
RiskBadge-->>User: Risikostufe anzeigen (Fallback: "low")
```

---

## 6.16 Laufzeitverhalten im Überblick

```mermaid
flowchart LR

Client --> Controller

Controller --> Service

Service --> Domain

Service --> Ports

Ports --> Adapter

Adapter --> Database

Adapter --> ExternalAPI

Adapter --> Cache
```

---

## 6.17 Zusammenfassung

Die Laufzeitsicht zeigt die wichtigsten Interaktionen innerhalb der Anwendung.

Besonders relevante Eigenschaften sind:

* Klare Trennung von Verantwortlichkeiten
* JWT-basierte Authentifizierung
* Verwendung von Ports und Adaptern
* Asynchrones Caching
* Retry- und Circuit-Breaker-Mechanismen
* Cache-Fallback bei API-Ausfällen
* Zentrale Fehlerbehandlung

Diese Abläufe bilden die Grundlage für die in Kapitel 7 beschriebene Verteilungssicht.

