# 02. Randbedingungen

## 2.1 Technische Randbedingungen

Die SQS Verkehrsapp besteht aus einem Java/Spring-Backend und einem React/TypeScript-Frontend. Die Architektur orientiert sich an bewährten Entwicklungsmustern und berücksichtigt Anforderungen hinsichtlich Wartbarkeit, Testbarkeit und Erweiterbarkeit.

### Programmiersprachen

| Technologie | Version | Verwendung  |
| ----------- | ------- | ----------- |
| Java        | 21      | Backend     |
| TypeScript  | 5       | Frontend    |

Java bildet die Grundlage des Backends. TypeScript wird im Frontend eingesetzt und ermöglicht statische Typsicherheit in der React-Anwendung.

---

### Frameworks und Bibliotheken

#### Backend

| Technologie              | Verwendungszweck                       |
| ------------------------ | -------------------------------------- |
| Spring Boot              | Anwendungsframework                    |
| Spring Web               | REST-Schnittstellen                    |
| Spring Security          | Authentifizierung und Autorisierung    |
| Spring Data JPA          | Datenzugriff                           |
| Spring WebFlux WebClient | Kommunikation mit externer API         |
| Resilience4j             | Retry- und Circuit-Breaker-Mechanismen |
| Lombok                   | Reduzierung von Boilerplate-Code       |
| JWT (jjwt)               | Token-basierte Authentifizierung       |

#### Frontend

| Technologie | Verwendungszweck                          |
| ----------- | ----------------------------------------- |
| React 19    | UI-Framework                              |
| Vite        | Build-Tool und Entwicklungsserver         |
| nginx       | Auslieferung der statischen Frontend-Dateien |

---

### Persistenz

Die Anwendung verwendet eine relationale Datenbank, die über Spring Data JPA angebunden wird.

Persistierte Daten:

* Benutzerkonten
* gespeicherte Autobahnen
* gecachte Verkehrsdaten
* gecachte Autobahnlisten

---

### Kommunikationsprotokolle

| Protokoll  | Zweck                     |
| ---------- | ------------------------- |
| HTTP/HTTPS | Kommunikation mit Clients |
| REST       | Bereitstellung der API    |
| JSON       | Datenaustauschformat      |

---

### Sicherheitsmechanismen

Die Authentifizierung erfolgt mittels JSON Web Tokens (JWT).

Merkmale:

* Stateless Authentication
* Token-basierte Autorisierung
* Passwortspeicherung über BCrypt
* Schutz geschützter REST-Endpunkte

---

### Externe Systeme

Die Anwendung nutzt eine externe Autobahn-API als primäre Quelle für Verkehrsdaten.

Bereitgestellte Informationen:

* Warnmeldungen
* Baustellen
* Sperrungen
* verfügbare Autobahnen

Zur Absicherung gegen Ausfälle werden Cache- und Fallback-Mechanismen verwendet.

---

## 2.2 Organisatorische Randbedingungen

### Hochschulprojekt

Die Anwendung wurde im Rahmen eines Projekts mit Schwerpunkt Softwarequalität entwickelt.

Daraus ergeben sich folgende Anforderungen:

* nachvollziehbare Architektur
* dokumentierte Architekturentscheidungen
* hohe Testabdeckung
* Einhaltung von Qualitätsstandards

---

### Teamarbeit

Die Entwicklung erfolgt in einem Teamkontext.

Wichtige Anforderungen:

* verständlicher Quellcode
* klare Schichtenstruktur
* dokumentierte Verantwortlichkeiten
* einfache Erweiterbarkeit

---

### Versionsverwaltung

Der Quellcode wird mittels Git verwaltet.

Anforderungen:

* nachvollziehbare Änderungen
* Branch-basierte Entwicklung
* reproduzierbare Builds

---

## 2.3 Architekturvorgaben

Für das Projekt wurden folgende Architekturprinzipien festgelegt:

### Hexagonale Architektur

Die Anwendung folgt dem Ports-and-Adapters-Ansatz.

Ziele:

* Trennung von Fachlogik und Infrastruktur
* hohe Testbarkeit
* Austauschbarkeit externer Systeme

---

### Dependency Inversion Principle

Der Anwendungskern hängt ausschließlich von Schnittstellen (Ports) ab.

Dadurch entsteht keine direkte Abhängigkeit zu:

* Datenbanken
* Frameworks
* externen APIs
* Cachesystemen

---

### Single Responsibility Principle

Jede Komponente besitzt eine klar definierte Verantwortung.

Beispiele Backend:

* Controller übernehmen ausschließlich HTTP-bezogene Aufgaben.
* Services enthalten Fachlogik.
* Adapter kapseln Infrastrukturzugriffe.
* Mapper transformieren externe Datenmodelle.

Beispiele Frontend:

* React-Komponenten sind zustandslos und übernehmen ausschließlich die Darstellung.
* Custom Hooks kapseln Datenzugriff und Zustandsverwaltung.
* Der Service (`trafficService`) kapselt die gesamte HTTP-Kommunikation.
* Utility-Funktionen übernehmen isolierte Hilfsaufgaben wie Validierung und Formatierung.

---

## 2.4 Qualitätsvorgaben

Die Architektur muss folgende Qualitätsziele unterstützen:

| Qualitätsziel     | Priorität |
| ----------------- | --------- |
| Wartbarkeit       | Hoch      |
| Testbarkeit       | Hoch      |
| Sicherheit        | Hoch      |
| Ausfallsicherheit | Hoch      |
| Erweiterbarkeit   | Mittel    |
| Performance       | Mittel    |

---

## 2.5 Technische Einschränkungen

### Externe API-Abhängigkeit

Die Qualität der Verkehrsdaten hängt von der Verfügbarkeit und Korrektheit der externen Autobahn-API ab.

---

### Netzwerkabhängigkeit

Für Live-Verkehrsdaten wird eine funktionierende Netzwerkverbindung benötigt.

---

### JWT-basierte Authentifizierung

Tokens können nach Ausstellung nicht unmittelbar widerrufen werden.

Die aktuelle Implementierung sieht daher einen clientseitigen Logout vor.

---

### Cache-Konsistenz

Zwischengespeicherte Daten können gegenüber den aktuellen Live-Daten zeitlich verzögert sein.

Dieser Kompromiss wird zugunsten einer höheren Verfügbarkeit akzeptiert.

---

## 2.6 Entwicklungs- und Qualitätswerkzeuge

Zur Sicherstellung der Softwarequalität werden folgende Werkzeuge eingesetzt:

#### Backend

| Werkzeug                  | Zweck                 |
|---------------------------| --------------------- |
| JUnit 5                   | Unit-Tests            |
| Mockito                   | Mocking               |
| Spring Test               | Integrationstests     |
| ArchUnit                  | Architekturtests      |
| JaCoCo, Testwise Coverage | Test-Coverage         |
| Maven                     | Build-Management      |

#### Frontend

| Werkzeug   | Zweck                 |
| ---------- | --------------------- |
| Vitest     | Unit-Tests            |
| Playwright | End-to-End-Tests      |
| ESLint     | Statische Codeanalyse |
| LCOV       | Test-Coverage         |

#### Allgemein

| Werkzeug   | Zweck                              |
| ---------- | ---------------------------------- |
| SonarCloud | Statische Codeanalyse (Backend + Frontend) |
| Teamscale  | Qualitätsüberwachung (Backend + Frontend)  |
| Git        | Versionsverwaltung                 |

---

## 2.7 Zusammenfassung

Die SQS Verkehrsapp basiert auf einer modernen Java/Spring-Backend- und React/TypeScript-Frontend-Architektur mit besonderem Fokus auf:

* Wartbarkeit
* Testbarkeit
* Ausfallsicherheit
* Sicherheit
* Erweiterbarkeit

Die definierten Randbedingungen bilden die Grundlage für die in den folgenden Kapiteln beschriebenen Architekturentscheidungen und Lösungsstrategien.

