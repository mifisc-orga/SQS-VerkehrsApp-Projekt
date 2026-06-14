# 05. Bausteinsicht

## 5.1 Überblick

Die Bausteinsicht beschreibt die statische Struktur der SQS Verkehrsapp und die wichtigsten Architekturbausteine des Systems.

Die Anwendung ist nach den Prinzipien der Hexagonalen Architektur aufgebaut und gliedert sich in die folgenden Ebenen:

* Inbound Adapter
* Application Layer
* Domain Layer
* Outbound Ports
* Infrastructure Layer

Die Fachlogik bildet den Mittelpunkt des Systems und ist vollständig von technischen Implementierungsdetails entkoppelt.

---

# 5.2 Ebene 1 – Gesamtsystem

## Systemübersicht

```mermaid
flowchart TB

subgraph Inbound Adapter
Controllers
end

subgraph Application Layer
UseCases
Services
end

subgraph Domain Layer
Domain
end

subgraph Outbound Ports
Ports
end

subgraph Infrastructure Layer
Adapters
Repositories
ExternalSystems
end

Controllers --> UseCases
UseCases --> Services
Services --> Domain
Services --> Ports
Ports --> Adapters

Adapters --> Repositories
Adapters --> ExternalSystems
```

---

## Hauptverantwortlichkeiten

| Ebene                | Verantwortung            |
| -------------------- | ------------------------ |
| Inbound Adapter      | REST-Kommunikation       |
| Application Layer    | Anwendungsfälle          |
| Domain Layer         | Fachlogik                |
| Outbound Ports       | Infrastrukturabstraktion |
| Infrastructure Layer | Datenbank, Cache, API    |

---

# 5.3 Ebene 2 – Inbound Adapter

Die Inbound Adapter bilden die öffentliche Schnittstelle des Systems.

## Komponentenübersicht

```mermaid
classDiagram

class AuthController
class TrafficController
class SavedRoadController
class DashboardController
class GlobalExceptionHandler
```

---

## AuthController

### Verantwortung

* Registrierung neuer Benutzer
* Anmeldung bestehender Benutzer
* JWT-Erzeugung

### Verwendete Komponenten

```text
AuthUseCase
JwtService
```

---

## TrafficController

### Verantwortung

Bereitstellung von Verkehrsinformationen.

### Endpunkte

```text
GET /api/traffic
GET /api/traffic/{roadId}
```

---

## SavedRoadController

### Verantwortung

Verwaltung gespeicherter Autobahnen.

### Endpunkte

```text
POST   /api/saved-roads
GET    /api/saved-roads
DELETE /api/saved-roads/{roadId}
```

---

## DashboardController

### Verantwortung

Abruf personalisierter Dashboard-Daten.

### Endpunkt

```text
GET /api/dashboard
```

---

## GlobalExceptionHandler

### Verantwortung

Zentrale Behandlung fachlicher und technischer Fehler.

---

# 5.4 Ebene 2 – Application Layer

Die Application Layer implementiert die Anwendungsfälle des Systems.

## Struktur

```mermaid
flowchart LR

UseCase --> Service
```

---

## Input Ports

```mermaid
classDiagram

class AuthUseCase
class TrafficQueryUseCase
class SavedRoadUseCase
class DashboardTrafficUseCase
```

### Verantwortung

Definition aller fachlichen Anwendungsfälle.

---

## Services

```mermaid
classDiagram

class AuthService
class TrafficService
class SavedRoadService
class DashboardTrafficService
```

---

### AuthService

Verantwortlich für:

* Benutzerregistrierung
* Benutzeranmeldung
* Passwortvalidierung

---

### TrafficService

Verantwortlich für:

* Abruf von Verkehrsdaten
* Risikoscore-Berechnung
* Aggregation von Verkehrsinformationen

---

### SavedRoadService

Verantwortlich für:

* Speichern von Autobahnen
* Abruf gespeicherter Autobahnen
* Löschen gespeicherter Autobahnen

---

### DashboardTrafficService

Verantwortlich für:

* Zusammenführung gespeicherter Autobahnen
* Abruf zugehöriger Verkehrsdaten
* Dashboard-Aufbereitung

---

# 5.5 Ebene 2 – Domain Layer

Die Domäne enthält die eigentliche Fachlogik.

## Domänenübersicht

```mermaid
classDiagram

class AppUser
class SavedRoad
class RoadEvent
class Coordinate
class TrafficEventsResult
class SavedRoadTrafficResult

class RiskLevel
class RoadEventType

class RiskScoreCalculator

TrafficEventsResult --> RoadEvent
RoadEvent --> Coordinate
RoadEvent --> RoadEventType
RoadEvent --> RiskLevel

RiskScoreCalculator --> RoadEventType
RiskScoreCalculator --> RiskLevel
```

---

## AppUser

Repräsentiert einen Benutzer der Anwendung.

### Attribute

```text
id
username
passwordHash
```

---

## SavedRoad

Repräsentiert eine gespeicherte Autobahn.

### Attribute

```text
id
userId
roadId
```

---

## RoadEvent

Repräsentiert ein einzelnes Verkehrsereignis.

### Attribute

```text
id
roadId
title
subtitle
description
type
coordinate
riskLevel
```

---

## TrafficEventsResult

Kapselt das Ergebnis einer Verkehrsabfrage.

### Enthält

```text
events
liveData
cachedAt
riskScore
```

---

## RiskScoreCalculator

Zentrale fachliche Komponente zur Bewertung von Verkehrssituationen.

### Aufgaben

* Risikostufe bestimmen
* Risikoscore berechnen
* Normierung auf Wertebereich 0–100

---

# 5.6 Ebene 2 – Outbound Ports

Outbound Ports abstrahieren alle externen Abhängigkeiten.

## Übersicht

```mermaid
classDiagram

class UserPort
class SavedRoadPort
class AutobahnApiPort
class RoadEventCachePort
class AvailableRoadCachePort
```

---

## UserPort

Verantwortlich für Benutzerpersistenz.

---

## SavedRoadPort

Verantwortlich für Favoritenpersistenz.

---

## AutobahnApiPort

Verantwortlich für Verkehrsdatenzugriffe.

---

## RoadEventCachePort

Verantwortlich für Verkehrsereignis-Caching.

---

## AvailableRoadCachePort

Verantwortlich für Autobahnlisten-Caching.

---

# 5.7 Ebene 2 – Infrastructure Layer

Die Infrastructure Layer implementiert alle technischen Schnittstellen.

## Adapterübersicht

```mermaid
classDiagram

class UserAdapter
class SavedRoadAdapter
class RoadEventCacheAdapter
class AvailableRoadsCacheAdapter

class ResilientAutobahnApiAdapter
class AutobahnApiClient
class AutobahnApiMapper
class AutobahnCacheWriter
```

---

## Persistenzadapter

### UserAdapter

Implementiert:

```text
UserPort
```

Verantwortlich für:

* Speichern von Benutzern
* Benutzerabfragen

---

### SavedRoadAdapter

Implementiert:

```text
SavedRoadPort
```

Verantwortlich für:

* Favoritenverwaltung

---

### RoadEventCacheAdapter

Implementiert:

```text
RoadEventCachePort
```

Verantwortlich für:

* Cache-Verwaltung von Verkehrsdaten

---

### AvailableRoadsCacheAdapter

Implementiert:

```text
AvailableRoadCachePort
```

Verantwortlich für:

* Cache verfügbarer Autobahnen

---

## API-Integration

### ResilientAutobahnApiAdapter

Implementiert:

```text
AutobahnApiPort
```

Verantwortlich für:

* Retry
* Circuit Breaker
* Cache Fallback

---

### AutobahnApiClient

Verantwortlich für:

* HTTP-Kommunikation
* API-Aufrufe

---

### AutobahnApiMapper

Verantwortlich für:

* DTO → Domain Mapping

---

### AutobahnCacheWriter

Verantwortlich für:

* asynchrone Cache-Aktualisierung

---

# 5.8 Ebene 3 – Persistenzmodell

## Entity-Struktur

```mermaid
erDiagram

APP_USERS {
    UUID id
    STRING username
    STRING password_hash
}

SAVED_ROADS {
    UUID id
    UUID user_id
    STRING road_id
}

CACHED_ROAD_EVENT {
    LONG id
    STRING road_id
    STRING event_id
    DATETIME cached_at
}

AVAILABLE_ROADS {
    STRING road_id
}

APP_USERS ||--o{ SAVED_ROADS : owns
```

---

# 5.9 Bausteinabhängigkeiten

## Vollständige Komponentenübersicht

```mermaid
flowchart LR

Controllers --> UseCases
UseCases --> Services

Services --> Domain

Services --> UserPort
Services --> SavedRoadPort
Services --> AutobahnApiPort
Services --> RoadEventCachePort
Services --> AvailableRoadCachePort

UserPort --> UserAdapter
SavedRoadPort --> SavedRoadAdapter
RoadEventCachePort --> RoadEventCacheAdapter
AvailableRoadCachePort --> AvailableRoadsCacheAdapter
AutobahnApiPort --> ResilientAutobahnApiAdapter

ResilientAutobahnApiAdapter --> AutobahnApiClient
AutobahnApiClient --> AutobahnApiMapper

UserAdapter --> UserRepository
SavedRoadAdapter --> SavedRoadRepository
RoadEventCacheAdapter --> CachedRoadEventRepository
AvailableRoadsCacheAdapter --> AvailableRoadRepository
```

---

# 5.10 Zusammenfassung

Die Bausteinsicht zeigt die konsequente Umsetzung der Hexagonalen Architektur.

Wesentliche Eigenschaften:

* Klare Trennung von Fachlogik und Infrastruktur
* Verwendung von Ports und Adaptern
* Hohe Testbarkeit
* Austauschbare Infrastrukturkomponenten
* Geringe Kopplung
* Hohe Wartbarkeit

Die dargestellten Bausteine bilden die Grundlage für die in Kapitel 6 beschriebenen Laufzeitszenarien.

