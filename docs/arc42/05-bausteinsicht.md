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

## 5.2 Ebene 1 – Gesamtsystem

### Systemübersicht

![Container Diagram](diagrams/Container.svg)

---

### Hauptverantwortlichkeiten

| Ebene                | Verantwortung            |
| -------------------- | ------------------------ |
| Inbound Adapter      | REST-Kommunikation       |
| Application Layer    | Anwendungsfälle          |
| Domain Layer         | Fachlogik                |
| Outbound Ports       | Infrastrukturabstraktion |
| Infrastructure Layer | Datenbank, Cache, API    |

---
## 5.3 Komponentendiagramm Backend

Zeigt die interne Struktur des Spring-Boot-Backends nach Hexagonaler Architektur.

Enthält:

- Inbound Adapter
- Application Layer
- Domain Layer
- Ports
- Outbound Adapter
- Repositories
- externe API
- Cache

![Backend Component Diagram](diagrams/BackendComponents.svg)

### Ebene 2 – Inbound Adapter

Die Inbound Adapter bilden die öffentliche Schnittstelle des Systems.

#### Komponentenübersicht

```mermaid
classDiagram

class AuthController
class TrafficController
class SavedRoadController
class DashboardController
class GlobalExceptionHandler
```

---

#### AuthController

##### Verantwortung

* Registrierung neuer Benutzer
* Anmeldung bestehender Benutzer
* JWT-Erzeugung

##### Verwendete Komponenten

```text
AuthUseCase
JwtService
```

---

#### TrafficController

##### Verantwortung

Bereitstellung von Verkehrsinformationen.

##### Endpunkte

```text
GET /api/traffic
GET /api/traffic/{roadId}
```

---

#### SavedRoadController

##### Verantwortung

Verwaltung gespeicherter Autobahnen.

##### Endpunkte

```text
POST   /api/saved-roads
GET    /api/saved-roads
DELETE /api/saved-roads/{roadId}
```

---

#### DashboardController

##### Verantwortung

Abruf personalisierter Dashboard-Daten.

##### Endpunkt

```text
GET /api/dashboard
```

---

#### GlobalExceptionHandler

##### Verantwortung

Zentrale Behandlung fachlicher und technischer Fehler.

---

### Ebene 2 – Application Layer

Die Application Layer implementiert die Anwendungsfälle des Systems.

#### Struktur

```mermaid
flowchart LR

UseCase --> Service
```

---

#### Input Ports

```mermaid
classDiagram

class AuthUseCase
class TrafficQueryUseCase
class SavedRoadUseCase
class DashboardTrafficUseCase
```

##### Verantwortung

Definition aller fachlichen Anwendungsfälle.

---

#### Services

```mermaid
classDiagram

class AuthService
class TrafficService
class SavedRoadService
class DashboardTrafficService
```

---

##### AuthService

Verantwortlich für:

* Benutzerregistrierung
* Benutzeranmeldung
* Passwortvalidierung

---

##### TrafficService

Verantwortlich für:

* Abruf von Verkehrsdaten
* Risikoscore-Berechnung
* Aggregation von Verkehrsinformationen

---

##### SavedRoadService

Verantwortlich für:

* Speichern von Autobahnen
* Abruf gespeicherter Autobahnen
* Löschen gespeicherter Autobahnen

---

##### DashboardTrafficService

Verantwortlich für:

* Zusammenführung gespeicherter Autobahnen
* Abruf zugehöriger Verkehrsdaten
* Dashboard-Aufbereitung

---

### Ebene 2 – Domain Layer

Die Domäne enthält die eigentliche Fachlogik.

#### Domänenübersicht

```mermaid
classDiagram

class AppUser {
    UUID id
    String username
    String passwordHash
}

class SavedRoad {
    UUID id
    UUID userId
    String roadId
}

class RoadEvent {
    String id
    String roadId
    String title
    String description
    RoadEventType type
    Coordinate coordinate
    RiskLevel riskLevel
}

class Coordinate {
    double latitude
    double longitude
}

class TrafficEventsResult {
    List<RoadEvent> events
    Integer riskScore
    boolean liveData
    LocalDateTime cachedAt
}

AppUser "1" --> "*" SavedRoad
TrafficEventsResult --> "*" RoadEvent
RoadEvent --> Coordinate
RoadEvent --> RoadEventType
RoadEvent --> RiskLevel
```

---

#### AppUser

Repräsentiert einen Benutzer der Anwendung.

##### Attribute

```text
id
username
passwordHash
```

---

#### SavedRoad

Repräsentiert eine gespeicherte Autobahn.

##### Attribute

```text
id
userId
roadId
```

---

#### RoadEvent

Repräsentiert ein einzelnes Verkehrsereignis.

##### Attribute

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

#### TrafficEventsResult

Kapselt das Ergebnis einer Verkehrsabfrage.

##### Enthält

```text
events
liveData
cachedAt
riskScore
```

---

#### RiskScoreCalculator

Zentrale fachliche Komponente zur Bewertung von Verkehrssituationen.

##### Aufgaben

* Risikostufe bestimmen
* Risikoscore berechnen
* Normierung auf Wertebereich 0–100

---

### Ebene 2 – Outbound Ports

Outbound Ports abstrahieren alle externen Abhängigkeiten.

#### Übersicht

```mermaid
classDiagram

class UserPort
class SavedRoadPort
class AutobahnApiPort
class RoadEventCachePort
class AvailableRoadCachePort
```

---

#### UserPort

Verantwortlich für Benutzerpersistenz.

---

#### SavedRoadPort

Verantwortlich für Favoritenpersistenz.

---

#### AutobahnApiPort

Verantwortlich für Verkehrsdatenzugriffe.

---

#### RoadEventCachePort

Verantwortlich für Verkehrsereignis-Caching.

---

#### AvailableRoadCachePort

Verantwortlich für Autobahnlisten-Caching.

---

### Ebene 2 – Infrastructure Layer

Die Infrastructure Layer implementiert alle technischen Schnittstellen.

#### Adapterübersicht

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

#### Persistenzadapter

##### UserAdapter

Implementiert:

```text
UserPort
```

Verantwortlich für:

* Speichern von Benutzern
* Benutzerabfragen

---

##### SavedRoadAdapter

Implementiert:

```text
SavedRoadPort
```

Verantwortlich für:

* Favoritenverwaltung

---

##### RoadEventCacheAdapter

Implementiert:

```text
RoadEventCachePort
```

Verantwortlich für:

* Cache-Verwaltung von Verkehrsdaten

---

##### AvailableRoadsCacheAdapter

Implementiert:

```text
AvailableRoadCachePort
```

Verantwortlich für:

* Cache verfügbarer Autobahnen

---

#### API-Integration

##### ResilientAutobahnApiAdapter

Implementiert:

```text
AutobahnApiPort
```

Verantwortlich für:

* Retry
* Circuit Breaker
* Cache Fallback

---

##### AutobahnApiClient

Verantwortlich für:

* HTTP-Kommunikation
* API-Aufrufe

---

##### AutobahnApiMapper

Verantwortlich für:

* DTO → Domain Mapping

---

##### AutobahnCacheWriter

Verantwortlich für:

* asynchrone Cache-Aktualisierung

---

## 5.2 Ebene 3 – Persistenzmodell

### Entity-Struktur

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

```mermaid
classDiagram

class UserEntity {
    UUID id
    String username
    String passwordHash
}

class SavedRoadEntity {
    UUID id
    UUID userId
    String roadId
}

class CachedRoadEventEntity {
    Long id
    String roadId
    String eventId
    String type
    LocalDateTime cachedAt
}

class AvailableRoadEntity {
    String roadId
}

UserEntity "1" --> "*" SavedRoadEntity
```

---

## 5.3 Bausteinabhängigkeiten

### Vollständige Komponentenübersicht

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

## 5.4 Komponentendiagramm Frontend

Zeigt die interne Struktur des React-TypeScript-Frontends.

Enthält:

- Root-Komponente und Layout-Komponenten
- Feature-Komponenten (Traffic, Selector, Dashboard, Modals)
- Custom Hooks
- Service-Schicht
- Utility-Funktionen

```mermaid
C4Component
title Komponentendiagramm - Frontend

Container_Boundary(frontend, "React + TypeScript Frontend") {

    Component(app, "App", "Root-Komponente", "Koordiniert Header, Modals und Hauptinhalt")

    Component(appHeader, "AppHeader", "Layout", "Navigation und Login/Logout-Button")
    Component(appMain, "AppMain", "Layout", "Hauptinhalt: Selektor und Verkehrsansicht")
    Component(appModals, "AppModals", "Layout", "Auth-Modal und Logout-Bestätigung")
    Component(pageHero, "PageHero", "Layout", "Hero-Bereich mit Titel und Status")

    Component(autobahnSelector, "AutobahnSelector", "Selektor", "Auswahl von Autobahnen per Chip")
    Component(selectorCard, "SelectorCard", "Selektor", "Einzelner auswählbarer Autobahn-Chip")

    Component(trafficView, "TrafficView", "Traffic", "Anzeige von Verkehrsereignissen")
    Component(incidentMap, "IncidentMap", "Traffic", "Kartenansicht der Ereignisse")
    Component(riskBadge, "RiskBadge", "Traffic", "Farbige Risikostufen-Anzeige")

    Component(dashboard, "Dashboard", "Dashboard", "Übersicht gespeicherter Autobahnen")
    Component(dashboardRoadCard, "DashboardRoadCard", "Dashboard", "Einzelne Autobahn-Karte")

    Component(authModal, "AuthModal", "Modals", "Login- und Registrierungsformular")
    Component(confirmModal, "ConfirmModal", "Modals", "Logout-Bestätigungsdialog")

    Component(useApp, "useApp", "Hook", "Zentraler App-State-Koordinator")
    Component(useAuth, "useAuth", "Hook", "Authentifizierungszustand und -aktionen")
    Component(useTraffic, "useTraffic", "Hook", "Verkehrsdaten und Straßenauswahl")
    Component(useAutobahnSelector, "useAutobahnSelector", "Hook", "Verfügbare Autobahnen laden")
    Component(useDashboard, "useDashboard", "Hook", "Dashboard-Daten laden")

    Component(trafficService, "trafficService", "Service", "Alle REST-API-Aufrufe zum Backend")

    Component(validateAuthForm, "validateAuthForm", "Util", "Formularvalidierung")
    Component(formatCachedAt, "formatCachedAt", "Util", "Formatierung des Cache-Zeitstempels")
    Component(buildSavedMessage, "buildSavedMessage", "Util", "Statusmeldung nach Favoriten-Speicherung")
}
```

### Abhängigkeiten Frontend

```mermaid
flowchart LR

App --> useApp
App --> AppHeader
App --> AppMain
App --> AppModals

useApp --> useAuth
useApp --> useTraffic
useApp --> validateAuthForm
useApp --> buildSavedMessage
useApp --> trafficService

AppMain --> AutobahnSelector
AppMain --> TrafficView
AppMain --> Dashboard
AppMain --> PageHero

AutobahnSelector --> useAutobahnSelector
AutobahnSelector --> SelectorCard
TrafficView --> RiskBadge
TrafficView --> IncidentMap
Dashboard --> DashboardRoadCard

useAutobahnSelector --> trafficService
useTraffic --> trafficService
useDashboard --> trafficService
useAuth --> trafficService

AppModals --> AuthModal
AppModals --> ConfirmModal
AuthModal --> validateAuthForm
```

### Ebene 2 – Hooks

| Hook                   | Verantwortung                                                         |
| ---------------------- | --------------------------------------------------------------------- |
| `useApp`               | Zentraler Koordinator: verbindet Auth, Traffic und Modal-Zustand      |
| `useAuth`              | JWT-Token verwalten, Login, Registrierung, Logout                     |
| `useTraffic`           | Verkehrsdaten laden, Straßenauswahl, Live/Cache-Status                |
| `useAutobahnSelector`  | Verfügbare Autobahnen vom Backend laden                               |
| `useDashboard`         | Dashboard-Daten für gespeicherte Autobahnen laden                     |

### Ebene 2 – Service

`trafficService` kapselt alle HTTP-Kommunikation mit dem Backend:

```text
GET  /api/traffic               → fetchAvailableRoads, fetchTrafficEvents
GET  /api/traffic/{roadId}      → fetchTrafficEvents(roadId)
POST /api/auth/login            → login
POST /api/auth/register         → register
POST /api/auth/logout           → logout
GET  /api/saved-roads           → fetchSavedRoads
POST /api/saved-roads           → saveFavourite
DELETE /api/saved-roads/{id}    → deleteFavourite
GET  /api/dashboard/saved-road-traffic → fetchDashboardTraffic
```

---

## 5.5 Zusammenfassung

Die Bausteinsicht zeigt die konsequente Umsetzung der Hexagonalen Architektur.

Wesentliche Eigenschaften:

* Klare Trennung von Fachlogik und Infrastruktur
* Verwendung von Ports und Adaptern
* Hohe Testbarkeit
* Austauschbare Infrastrukturkomponenten
* Geringe Kopplung
* Hohe Wartbarkeit

Die dargestellten Bausteine bilden die Grundlage für die in Kapitel 6 beschriebenen Laufzeitszenarien.

