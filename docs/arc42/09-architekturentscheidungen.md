# 09. Architekturentscheidungen

## 9.1 Überblick

Dieses Kapitel dokumentiert die wesentlichen Architekturentscheidungen (Architecture Decision Records, ADRs), die während der Entwicklung der SQS Verkehrsapp getroffen wurden.

Jede Entscheidung beschreibt:

* den Kontext
* die getroffene Entscheidung
* die Begründung
* die Konsequenzen

Die Entscheidungen orientieren sich an den Qualitätszielen des Systems:

* Wartbarkeit
* Testbarkeit
* Sicherheit
* Verfügbarkeit
* Erweiterbarkeit

---

### ADR-001 – Verwendung von frontend-init ausschließlich als Vorlage

#### Status

Akzeptiert

#### Referenz

Diese Entscheidung basiert auf dem projektspezifischen ADR:

[ADR: frontend-init nur noch als Feature-Vorlage verwenden](adr-detail/branch-frontend-init-als-feature-vorlage.md) (akzeptiert am 28.04.2026)

---

#### Kontext

Zu Projektbeginn wurde ein Frontend-Prototyp auf Basis eines KI-generierten Branches erstellt. Die erzeugte Struktur entsprach jedoch nicht vollständig den vereinbarten Architekturprinzipien und Qualitätszielen.

Eine direkte Weiterentwicklung hätte das Risiko erhöht, ungeeignete Architekturentscheidungen dauerhaft in das Projekt zu übernehmen.

---

#### Entscheidung

Der Branch frontend-init wird ausschließlich als Inspirations- und Vorlagenquelle verwendet.

Architekturentscheidungen oder Implementierungen aus diesem Branch werden nicht automatisch übernommen.

---

#### Begründung

Die Entscheidung stellt sicher, dass die tatsächliche Frontend-Implementierung den vereinbarten Architekturprinzipien folgt und nicht durch zufällige oder unzureichend spezifizierte KI-generierte Strukturen beeinflusst wird.

---

#### Konsequenzen

Positiv:

- Konsistente Architektur
- Bessere Wartbarkeit
- Kontrollierte Weiterentwicklung

Negativ:

- Bereits vorhandene Implementierungen können nicht direkt übernommen werden
- Zusätzlicher Implementierungsaufwand

### ADR-002 – Verwendung einer Hexagonalen Architektur

#### Status

Akzeptiert

#### Referenz

Diese Entscheidung basiert auf dem projektspezifischen ADR:

[ADR: Hexagonale Architektur im Backend](adr-detail/hexagonale-architektur.md)

Der vorliegende ADR konkretisiert die in diesem Dokument beschriebene Architekturentscheidung und dokumentiert die Beweggründe des Entwicklungsteams für die Einführung der Hexagonalen Architektur als grundlegendes Strukturierungsprinzip des Backends.

---

#### Kontext

Die Anwendung integriert mehrere externe Systeme:

* Datenbank
* Autobahn API
* Cache
* Sicherheitsmechanismen

Gleichzeitig soll die Fachlogik unabhängig von diesen Technologien bleiben.

---

#### Entscheidung

Die Anwendung wird nach den Prinzipien der Hexagonalen Architektur (Ports & Adapters) aufgebaut.

---

#### Begründung

Vorteile:

* klare Trennung von Fachlogik und Infrastruktur
* hohe Testbarkeit
* Austauschbarkeit externer Systeme
* geringere Kopplung

Die Entscheidung wurde bereits zu Projektbeginn getroffen und in einem separaten ADR dokumentiert. Die dort beschriebenen Ziele – insbesondere die Trennung von Fachlogik und technischen Details sowie die Verbesserung von Wartbarkeit, Erweiterbarkeit und Testbarkeit – bilden die Grundlage der gesamten Systemarchitektur.

---

#### Konsequenzen

Positiv:

* einfache Erweiterbarkeit
* hohe Wartbarkeit

Negativ:

* zusätzliche Schnittstellen
* mehr Klassen und Komponenten

---

### ADR-003 – JWT-basierte Authentifizierung

#### Status

Akzeptiert

---

#### Kontext

Die Anwendung stellt REST-Schnittstellen bereit und soll ohne serverseitige Sessions betrieben werden.

---

#### Entscheidung

Authentifizierung erfolgt über JSON Web Tokens (JWT).

---

#### Begründung

Vorteile:

* Stateless Authentication
* gute Skalierbarkeit
* REST-konform
* keine Sessionverwaltung erforderlich

---

#### Konsequenzen

Positiv:

* horizontale Skalierung möglich
* geringer Verwaltungsaufwand

Negativ:

* Token können nicht einfach widerrufen werden
* Ablaufzeiten müssen berücksichtigt werden

---

### ADR-004 – Konsequente Verwendung von Ports

#### Status

Akzeptiert

---

#### Kontext

Die Fachlogik soll unabhängig von Infrastrukturkomponenten bleiben.

---

#### Entscheidung

Alle externen Abhängigkeiten werden über Ports abstrahiert.

#### Input Ports

```text id="3iq83m"
AuthUseCase
TrafficQueryUseCase
SavedRoadUseCase
DashboardTrafficUseCase
```

#### Output Ports

```text id="i4hzyv"
UserPort
SavedRoadPort
AutobahnApiPort
RoadEventCachePort
AvailableRoadCachePort
```

---

#### Begründung

* Entkopplung
* Testbarkeit
* Austauschbarkeit

---

#### Konsequenzen

Positiv:

* einfache Mockbarkeit
* hohe Flexibilität

Negativ:

* zusätzliche Abstraktionsschicht

---

### ADR-005 – Verwendung von Resilience4j

#### Status

Akzeptiert

---

#### Kontext

Die Anwendung hängt von einer externen Autobahn API ab.

API-Ausfälle dürfen nicht zum Totalausfall führen.

---

#### Entscheidung

Verwendung von Resilience4j mit:

* Retry
* Circuit Breaker

---

#### Begründung

* höhere Verfügbarkeit
* bessere Fehlerbehandlung
* Schutz externer Systeme

---

#### Konsequenzen

Positiv:

* robustes Verhalten bei Ausfällen

Negativ:

* zusätzliche Komplexität
* Konfiguration erforderlich

---

### ADR-006 – Domänengetriebene Risikobewertung

#### Status

Akzeptiert

---

#### Kontext

Verkehrsdaten sollen fachlich bewertet werden.

---

#### Entscheidung

Die Berechnung erfolgt zentral über:

```text id="x2mfwp"
RiskScoreCalculator
```

---

#### Begründung

* zentrale Fachlogik
* konsistente Bewertung
* einfache Erweiterbarkeit

---

#### Konsequenzen

Positiv:

* klare Verantwortlichkeiten

Negativ:

* Anpassungen müssen zentral gepflegt werden

---

### ADR-007 – Stateless Authentication

#### Status

Akzeptiert

---

#### Kontext

Benutzersitzungen sollen nicht serverseitig gespeichert werden.

---

#### Entscheidung

Verwendung einer vollständig zustandslosen Authentifizierung.

---

#### Begründung

* bessere Skalierbarkeit
* weniger Infrastrukturaufwand

---

#### Konsequenzen

Positiv:

* einfache horizontale Skalierung

Negativ:

* Logout erfolgt clientseitig

---

### ADR-008 – DTO-Mapping über dedizierte Mapper

#### Status

Akzeptiert

---

#### Kontext

Die Autobahn API besitzt eigene Datenmodelle.

Diese sollen nicht direkt in die Domäne übernommen werden.

---

#### Entscheidung

Verwendung eines separaten Mappers:

```text id="msax14"
AutobahnApiMapper
```

---

#### Begründung

* Schutz vor API-Änderungen
* Entkopplung
* bessere Testbarkeit

---

#### Konsequenzen

Positiv:

* stabile Domänenschicht

Negativ:

* zusätzlicher Mapping-Aufwand

---

### ADR-009 – Asynchrones Cache-Schreiben

#### Status

Akzeptiert

---

#### Kontext

Cache-Operationen dürfen Benutzeranfragen nicht blockieren.

---

#### Entscheidung

Cache-Aktualisierungen werden asynchron durchgeführt.

---

#### Begründung

* kürzere Antwortzeiten
* bessere Benutzererfahrung

---

#### Konsequenzen

Positiv:

* bessere Performance

Negativ:

* Cache kann kurzzeitig inkonsistent sein

---

### ADR-010 – Persistenz über Spring Data JPA

#### Status

Akzeptiert

---

#### Kontext

Persistenzoperationen sollen standardisiert umgesetzt werden.

---

#### Entscheidung

Verwendung von Spring Data JPA.

---

#### Begründung

* weniger Boilerplate-Code
* etablierter Standard
* einfache Wartung

---

#### Konsequenzen

Positiv:

* schnelle Entwicklung
* hohe Produktivität

Negativ:

* Abhängigkeit vom JPA-Modell

---

### ADR-011 – Datenbankgestützter Cache

#### Status

Akzeptiert

---

#### Kontext

Verkehrsdaten sollen auch bei API-Ausfällen verfügbar bleiben.

---

#### Entscheidung

Speicherung von:

* Verkehrsdaten
* Autobahnlisten

in der Datenbank.

---

#### Begründung

* hohe Verfügbarkeit
* Fallback-Möglichkeit

---

#### Konsequenzen

Positiv:

* robuste Anwendung

Negativ:

* zusätzlicher Speicherbedarf
* mögliche Datenveraltung

---

## 9.2 Übersicht der Entscheidungen

| ADR     | Titel                             |
|---------|-----------------------------------|
| ADR-001 | frontend-init nur als Vorlage     |
| ADR-002 | Hexagonale Architektur            |
| ADR-003 | JWT-basierte Authentifizierung    |
| ADR-004 | Verwendung von Ports              |
| ADR-005 | Resilience4j                      |
| ADR-006 | Domänengetriebene Risikobewertung |
| ADR-007 | Stateless Authentication          |
| ADR-008 | DTO-Mapping                       |
| ADR-009 | Asynchrones Cache-Schreiben       |
| ADR-010 | Spring Data JPA                   |
| ADR-011 | Datenbankgestützter Cache         |

---

## 9.3 Einfluss auf Qualitätsziele

### Wartbarkeit

Unterstützt durch:

* Hexagonale Architektur
* Ports & Adapter
* DTO-Mapping

---

### Testbarkeit

Unterstützt durch:

* Input Ports
* Output Ports
* Dependency Injection

---

### Sicherheit

Unterstützt durch:

* JWT
* Spring Security
* BCrypt

---

### Verfügbarkeit

Unterstützt durch:

* Retry
* Circuit Breaker
* Cache Fallback

---

### Erweiterbarkeit

Unterstützt durch:

* entkoppelte Komponenten
* austauschbare Adapter
* klare Schnittstellen

---

## 9.4 Zusammenfassung

Die dokumentierten Architekturentscheidungen bilden die Grundlage der Systemarchitektur.

Sie unterstützen insbesondere die priorisierten Qualitätsziele:

* Wartbarkeit
* Testbarkeit
* Sicherheit
* Verfügbarkeit
* Erweiterbarkeit

und gewährleisten eine langfristig stabile und nachvollziehbare Architektur der SQS Verkehrsapp.

