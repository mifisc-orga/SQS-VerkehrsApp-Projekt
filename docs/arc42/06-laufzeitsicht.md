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

# 6.2 Benutzerregistrierung

## Ziel

Ein neuer Benutzer registriert sich im System.

## Ablauf

```mermaid id="fslrmi"
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

# 6.3 Benutzeranmeldung

## Ziel

Ein Benutzer authentifiziert sich und erhält ein JWT.

## Ablauf

```mermaid id="rl3lmo"
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

# 6.4 Authentifizierte Anfrage

## Ziel

Ein Benutzer ruft eine geschützte Ressource auf.

## Ablauf

```mermaid id="1ih62d"
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

# 6.5 Verkehrsdaten für eine Autobahn abrufen

## Ziel

Abruf aller Verkehrsmeldungen für eine bestimmte Autobahn.

## Ablauf

```mermaid id="qzyo3v"
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

# 6.6 Risikobewertung von Verkehrsdaten

## Ziel

Berechnung eines normierten Risikoscores.

## Ablauf

```mermaid id="9zck0r"
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

# 6.7 Dashboard-Abfrage

## Ziel

Anzeige aller gespeicherten Autobahnen eines Benutzers inklusive Verkehrsdaten.

## Ablauf

```mermaid id="62m2va"
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

# 6.8 Autobahn speichern

## Ziel

Ein Benutzer speichert eine Autobahn als Favorit.

## Ablauf

```mermaid id="ez80gi"
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

# 6.9 Cache-Aktualisierung

## Ziel

Speicherung neu geladener Verkehrsdaten.

## Ablauf

```mermaid id="zwr0iv"
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

# 6.10 Ausfallszenario – API nicht erreichbar

## Ziel

Bereitstellung von Verkehrsdaten trotz Ausfall der externen API.

## Ablauf

```mermaid id="v68u56"
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

# 6.11 Ausfallszenario – Verfügbare Autobahnen

## Ziel

Bereitstellung der Autobahnliste bei API-Ausfall.

## Ablauf

```mermaid id="kysljn"
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

# 6.12 Fehlerbehandlung

## Ziel

Einheitliche Fehlerkommunikation.

## Ablauf

```mermaid id="g8dlzt"
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

# 6.13 Laufzeitverhalten im Überblick

```mermaid id="gtub9m"
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

# 6.14 Zusammenfassung

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

