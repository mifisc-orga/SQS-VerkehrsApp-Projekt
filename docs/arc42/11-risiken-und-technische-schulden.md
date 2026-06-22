# 11. Risiken und technische Schulden

## 11.1 Überblick

Dieses Kapitel beschreibt bekannte Risiken, Einschränkungen und technische Schulden der SQS Verkehrsapp.

Nicht alle identifizierten Risiken wurden im aktuellen Projektumfang vollständig adressiert. Die Dokumentation dieser Punkte ermöglicht eine bewusste Bewertung zukünftiger Weiterentwicklungen und dient als Grundlage für technische Verbesserungen.

Die Risiken werden in folgende Kategorien eingeteilt:

* Architektur
* Sicherheit
* Verfügbarkeit
* Performance
* Wartbarkeit
* Betrieb

---

## 11.2 Architekturrisiken

### R-01 Abhängigkeit von externer Autobahn API

#### Beschreibung

Die Anwendung ist für aktuelle Verkehrsdaten auf eine externe Autobahn API angewiesen.

#### Auswirkungen

Mögliche Folgen:

* fehlende Live-Daten
* veraltete Informationen
* reduzierte Funktionalität

#### Aktuelle Gegenmaßnahmen

* Retry
* Circuit Breaker
* Cache Fallback

#### Restrisiko

Bei Ausfall von API und Cache können keine Verkehrsdaten bereitgestellt werden.

#### Priorität

Hoch

---

### R-02 Änderungen der API-Schnittstelle

#### Beschreibung

Änderungen an den Datenstrukturen der externen API können das Mapping beeinflussen.

#### Auswirkungen

* Fehlerhafte Datenverarbeitung
* Laufzeitfehler
* falsche Risikobewertungen

#### Gegenmaßnahmen

* DTO-Mapping
* Entkopplung durch Mapper

#### Priorität

Mittel

---

## 11.3 Sicherheitsrisiken

### R-03 Hardcoded JWT Secret

#### Beschreibung

Der JWT-Schlüssel ist aktuell direkt im Anwendungscode definiert.

#### Auswirkungen

* Sicherheitsrisiko bei Quellcodezugriff
* eingeschränkte Rotation von Secrets

#### Empfohlene Lösung

Verwendung von:

```text
Environment Variables
Secret Management
Vault-Lösungen
```

#### Priorität

Hoch

---

### R-04 Fehlende Token-Revocation

#### Beschreibung

JWT-Tokens können derzeit nicht aktiv widerrufen werden.

#### Auswirkungen

Ein kompromittiertes Token bleibt bis zum Ablauf gültig.

#### Mögliche Lösungen

* Token Blacklist
* Refresh Token Konzept
* OAuth2-basierte Lösung

#### Priorität

Mittel

---

### R-05 Fehlende rollenbasierte Autorisierung

#### Beschreibung

Aktuell wird ausschließlich zwischen authentifizierten und nicht authentifizierten Benutzern unterschieden.

#### Auswirkungen

Spätere Rollenmodelle sind nicht vorbereitet.

#### Mögliche Erweiterungen

```text
ROLE_USER
ROLE_ADMIN
ROLE_OPERATOR
```

#### Priorität

Niedrig

---

## 11.4 Verfügbarkeitsrisiken

### R-06 Cache-Aktualität

#### Beschreibung

Cache-Daten können gegenüber Live-Daten veraltet sein.

#### Auswirkungen

* veraltete Verkehrsinformationen
* ungenaue Risikobewertung

#### Gegenmaßnahmen

* regelmäßige Aktualisierung
* Zeitstempel im Cache

#### Priorität

Mittel

---

### R-07 Datenbank als Single Point of Failure

#### Beschreibung

Sowohl Fachdaten als auch Cache-Daten liegen in derselben Datenbank.

#### Auswirkungen

Ein Datenbankausfall beeinträchtigt:

* Benutzerverwaltung
* Favoriten
* Cache-Funktionalität

#### Mögliche Lösungen

* Replikation
* Datenbankcluster
* Backup-Systeme

#### Priorität

Mittel

---

## 11.5 Performance-Risiken

### R-08 Dashboard-Abfragen

#### Beschreibung

Für jede gespeicherte Autobahn wird eine Verkehrsabfrage durchgeführt.

#### Auswirkungen

Die Antwortzeit steigt mit der Anzahl gespeicherter Autobahnen.

#### Mögliche Verbesserungen

* Batch Requests
* Parallelisierung
* Aggregierte API-Aufrufe

#### Priorität

Mittel

---

### R-09 Datenbankbasierter Cache

#### Beschreibung

Der Cache wird aktuell über relationale Tabellen umgesetzt.

#### Auswirkungen

Bei hoher Last kann dies zusätzliche Datenbankzugriffe verursachen.

#### Alternative Lösungen

```text
Redis
Hazelcast
In-Memory Cache
```

#### Priorität

Niedrig

---

## 11.6 Wartbarkeitsrisiken

### R-10 Erweiterung der Risikobewertung

#### Beschreibung

Neue Ereignistypen erfordern Anpassungen an mehreren Stellen.

Betroffene Komponenten:

```text
RoadEventType
RiskScoreCalculator
Mapper
```

#### Auswirkungen

Erhöhter Wartungsaufwand.

#### Priorität

Niedrig

---

### R-11 Wachsende Adapterlandschaft

#### Beschreibung

Die Hexagonale Architektur führt zu einer höheren Anzahl von Klassen und Interfaces.

#### Auswirkungen

Neue Entwickler benötigen mehr Einarbeitungszeit.

#### Bewertung

Bewusster Architekturkompromiss zugunsten von Wartbarkeit und Testbarkeit.

#### Priorität

Niedrig

---

## 11.7 Technische Schulden

### TS-01 Verwendung generischer Runtime Exceptions

#### Beschreibung

Teilweise werden noch generische Exceptions verwendet.

#### Verbesserung

Einführung spezialisierter Fachausnahmen.

Beispiele:

```text
DuplicateSavedRoadException
RoadNotFoundException
AuthenticationException
```

#### Nutzen

* klarere Fehlerbehandlung
* bessere API-Responses

---

### TS-02 Fehlende API-Versionierung

#### Beschreibung

Die REST-Schnittstelle besitzt derzeit keine Versionierung.

#### Risiko

Spätere Änderungen können bestehende Clients beeinträchtigen.

#### Verbesserung

Einführung von:

```text
/api/v1
/api/v2
```

---

### TS-03 Begrenzte Monitoring-Möglichkeiten

#### Beschreibung

Monitoring erfolgt derzeit primär über Standard-Actuator-Endpunkte.

#### Verbesserung

Einbindung von:

```text
Prometheus
Grafana
OpenTelemetry
```

---

### TS-04 Fehlende zentrale Konfigurationsverwaltung

#### Beschreibung

Konfigurationen werden lokal verwaltet.

#### Verbesserung

Einführung von:

```text
Spring Cloud Config
HashiCorp Vault
Kubernetes Secrets
```

---

### TS-06 Kein persistierter Frontend-Zustand

#### Beschreibung

Der Zustand des Frontends (ausgewählte Autobahnen, Auth-Token) wird ausschließlich im Arbeitsspeicher gehalten und geht beim Schließen des Browsers verloren.

#### Auswirkungen

* Benutzer müssen sich nach jedem Seitenstart erneut anmelden
* Autobahnauswahl wird nicht gespeichert

#### Mögliche Verbesserung

Persistierung des JWT-Tokens und der Autobahnauswahl über `localStorage` oder `sessionStorage`.

#### Priorität

Niedrig

---

### TS-07 Fehlende Ladezustandsanzeige im Frontend

#### Beschreibung

Beim Laden von Verkehrsdaten oder Dashboard-Daten wird kein Ladezustand (Spinner, Skeleton) angezeigt.

#### Auswirkungen

* kurzzeitig leere Ansicht beim Start
* schlechtere Benutzererfahrung bei langsamer Verbindung

#### Mögliche Verbesserung

Einführung von Ladezustandsvariablen in den Custom Hooks und entsprechenden UI-Komponenten.

#### Priorität

Niedrig

---

### TS-05 Fehlende Audit-Protokollierung

#### Beschreibung

Benutzeraktionen werden derzeit nicht revisionssicher protokolliert.

#### Betroffene Aktionen

* Login
* Registrierung
* Speichern von Autobahnen
* Löschen von Autobahnen

#### Verbesserung

Audit Logging mit Zeitstempel und Benutzerreferenz.

---

## 11.8 Maßnahmen zur Reduzierung technischer Risiken

Zur frühzeitigen Erkennung von Qualitätsproblemen wurden automatisierte Prüfmechanismen etabliert.

### Automatisierte Tests

Die Anwendung wird durch mehrere Testebenen abgesichert:

#### Backend: Unit-Tests

Prüfung einzelner Komponenten und Fachlogik.

Beispiele:

- Services
- Adapter
- Controller
- RiskScoreCalculator
- Exception-Klassen

#### Backend: Integrationstests

Prüfung des Zusammenspiels mehrerer Komponenten.

Abgedeckte Bereiche:

- REST-Schnittstellen
- Security-Konfiguration
- Repository-Zugriffe
- Externe API-Integration
- Spring Application Context

#### Backend: Architekturtests

Architekturtests prüfen die Einhaltung der definierten Hexagonalen Architektur.

Insbesondere werden kontrolliert:

- Schichtentrennung
- Paketabhängigkeiten
- Architekturregeln

#### Frontend: Unit-Tests (Vitest)

Prüfung von Hooks, Komponenten und Utility-Funktionen isoliert.

Beispiele:

- useApp, useAuth, useTraffic
- validateAuthForm, formatCachedAt
- RiskBadge, AutobahnSelector

#### Frontend: End-to-End-Tests (Playwright)

Prüfung zentraler Nutzerworkflows im Browser mit gemockten API-Antworten.

Abgedeckte Bereiche:

- Login und Registrierung
- Autobahnauswahl
- Dashboard
- Favoriten speichern und löschen
- Kartenansicht

### Kontinuierliche Qualitätsüberwachung

Zur langfristigen Sicherung der Codequalität wird Teamscale eingesetzt.

Überwacht werden:

- Testabdeckung
- Code Smells
- Duplikate
- Komplexität
- Architekturverletzungen
- Technische Schulden

Dadurch können Qualitätsprobleme frühzeitig erkannt und behoben werden.

## 11.9 Risiko-Matrix

| Risiko                      | Wahrscheinlichkeit | Auswirkung | Bewertung |
| --------------------------- | ------------------ | ---------- | --------- |
| Externe API nicht verfügbar | Hoch               | Hoch       | Kritisch  |
| Hardcoded JWT Secret        | Mittel             | Hoch       | Hoch      |
| Fehlende Token Revocation   | Mittel             | Mittel     | Mittel    |
| Veraltete Cache-Daten       | Mittel             | Mittel     | Mittel    |
| Dashboard-Performance       | Mittel             | Mittel     | Mittel    |
| API-Änderungen              | Niedrig            | Hoch       | Mittel    |
| Datenbankausfall            | Niedrig            | Hoch       | Mittel    |

---

## 11.10 Priorisierte Verbesserungen

### Kurzfristig

1. JWT Secret externalisieren
2. Spezifische Fachausnahmen einführen
3. API-Versionierung vorbereiten

---

### Mittelfristig

1. Monitoring erweitern
2. Audit Logging einführen
3. Dashboard optimieren

---

### Langfristig

1. Rollenmodell erweitern
2. Token Revocation implementieren
3. Verteilte Cache-Lösung evaluieren

---

## 11.11 Zusammenfassung

Die identifizierten Risiken betreffen hauptsächlich:

* die Abhängigkeit von externen Systemen,
* die Sicherheit der Authentifizierung,
* die Skalierbarkeit zukünftiger Erweiterungen,
* sowie betriebliche Aspekte der Anwendung.

Die meisten Risiken werden bereits durch die gewählte Architektur teilweise abgefedert. Insbesondere die Verwendung von Ports & Adapters, JWT, Resilience4j und datenbankgestütztem Caching reduziert die Auswirkungen potenzieller Störungen erheblich.

Die dokumentierten technischen Schulden stellen keine unmittelbaren Probleme dar, sollten jedoch bei zukünftigen Weiterentwicklungen berücksichtigt werden.
