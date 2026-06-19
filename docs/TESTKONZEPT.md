# Testkonzept

Dieses Dokument beschreibt das gemeinsame Testkonzept der SQS-VerkehrsApp. Es fasst zusammen, welche Testarten im Projekt eingesetzt werden, wie sie lokal und in der CI ausgeführt werden und welche Qualitätsziele damit abgesichert werden.

## Zielsetzung

Die Tests sollen sicherstellen, dass die VerkehrsApp fachlich korrekt, technisch stabil und wartbar bleibt. Abgesichert werden insbesondere:

- korrekte Berechnung und Darstellung von Verkehrslagen und Risikobewertungen
- sichere Authentifizierung und Zugriffskontrolle
- robuste Verarbeitung externer Verkehrsdaten der Autobahn-API
- zuverlässige Speicherung und Anzeige persönlicher Autobahn-Favoriten
- Einhaltung der gewählten hexagonalen Architektur
- stabile Benutzeroberfläche für die wichtigsten Workflows

## Teststrategie

Das Projekt verwendet eine mehrstufige Teststrategie:

| Ebene | Ziel | Beispiele im Projekt |
| --- | --- | --- |
| Unit-Tests | Einzelne Klassen und Funktionen isoliert prüfen | Risiko-Score, Services, Mapper, Exception-Klassen |
| Controller-/Adapter-Tests | Web- und Infrastrukturadapter prüfen | Auth-, Traffic-, Saved-Road- und Dashboard-Controller |
| Integrationstests | Zusammenspiel mehrerer Komponenten prüfen | Authentifizierung mit gespeicherten Straßen, Public-Traffic-Endpunkte, Persistenz |
| Architekturtests | Architekturregeln automatisch prüfen | ArchUnit-Regeln für Domain, Application, Adapter und Ports |
| Frontend-End-to-End-Tests | Nutzerworkflows im Browser prüfen | Login, Dashboard, Favoriten, Karte, Autobahnauswahl |
| Qualitäts- und Coverage-Analyse | Testabdeckung und Codequalität sichtbar machen | JaCoCo, LCOV, Teamscale, SonarCloud |

## Backend-Tests

Das Backend liegt unter `backend/sqs-verkehrsapp` und wird mit Maven getestet. Die Testdateien liegen unter `src/test/java`, die Testkonfiguration unter `src/test/resources/application-test.properties`.

### Unit-Tests

Unit-Tests enden auf `*Test.java` und werden über das Maven-Surefire-Plugin ausgeführt. Sie prüfen einzelne fachliche oder technische Bausteine ohne vollständigen Anwendungsstart, zum Beispiel:

- `RiskScoreCalculatorTest` für die fachliche Risikobewertung
- Service-Tests für Authentifizierung, gespeicherte Straßen, Dashboard- und Traffic-Logik
- Mapper- und Adapter-Tests für die Autobahn-API
- Tests für Exception-Klassen und Fehlerfälle

### Integrationstests

Integrationstests enden auf `*IntegrationTest.java` und werden über das Maven-Failsafe-Plugin in der `verify`-Phase ausgeführt. Sie prüfen das Zusammenspiel mehrerer Komponenten, zum Beispiel REST-Endpunkte, Security-Konfiguration, Persistenz und externe Adapter.

### Testdaten und Testumgebung

Für Backend-Tests wird das Profil `test` über die Testkonfiguration vorbereitet. Wichtige Eigenschaften:

- H2-In-Memory-Datenbank für schnelle, reproduzierbare Tests
- `ddl-auto=create-drop`, damit Tests mit einem frischen Schema laufen
- eigener JWT-Testschlüssel
- lokale Autobahn-API-Basis-URL für kontrollierte Adaptertests
- reduzierte Retry- und Circuit-Breaker-Zeiten, damit Fehlerfälle schnell getestet werden

Zusätzlich werden Testcontainers-Abhängigkeiten verwendet, wenn realistischere Integrationstests gegen Container benötigt werden.

### Architekturtests

Mit ArchUnit wird geprüft, dass die hexagonale Architektur eingehalten wird. Die Regeln sichern unter anderem:

- Controller liegen im Web-Adapter-Paket
- Services liegen in der Application-Schicht
- Ports sind Interfaces
- Domain-Code hängt nicht von Spring, Application oder Adapter-Schichten ab
- Incoming- und Outgoing-Adapter bleiben voneinander getrennt
- Persistenz-Entities und Repositories bleiben im Persistenzadapter

Diese Tests laufen zusammen mit den normalen Backend-Tests.

## Frontend-Tests

Das Frontend liegt unter `frontend` und wird mit TypeScript, React, Vite und Playwright getestet. Die Tests liegen im Ordner `frontend/tests`.

### End-to-End-Tests mit Playwright

Die Playwright-Tests prüfen die wichtigsten Benutzerabläufe im Browser. Dazu gehören:

- Grundzustand und App-Start
- Autobahnauswahl
- Kartenansicht
- Risiko-Score-Anzeige
- Login und Dashboard
- Speichern und Löschen von Favoriten
- zentrale UI-Funktionen

Die Tests verwenden gemockte API-Antworten über Playwright-Routing. Dadurch sind sie unabhängig von externen Diensten und prüfen gezielt das Verhalten der Oberfläche.

### Linting und Build

Neben den Browser-Tests werden statische Prüfungen und der Produktionsbuild ausgeführt:

Der Build führt zuerst die TypeScript-Prüfung aus und baut anschließend die Vite-Anwendung.

### Frontend-Coverage

Für Coverage wird die Playwright-Testinstanz in `frontend/tests/coverage.ts` erweitert. Nach jedem Test wird vorhandene Browser-Coverage aus `window.__coverage__` gelesen und nach `.nyc_output` geschrieben. Der erzeugte Report liegt unter `frontend/coverage/lcov.info`.

## Continuous Integration

Die automatisierten Prüfungen laufen über GitHub Actions.

### Backend CI

Workflow: `.github/workflows/backend-ci.yml`

Damit werden Kompilierung, Unit-Tests, Integrationstests und Architekturtests geprüft.

### Frontend CI

Workflow: `.github/workflows/frontend-ci.yml`

Ausgeführt wird:

Damit werden Abhängigkeiten reproduzierbar installiert, statische Analyse durchgeführt und der Frontend-Build geprüft.

### Teamscale

Workflow: `.github/workflows/teamscale-ci.yml`

Teamscale wird für Testwise Coverage und Coverage-Upload verwendet:

- Backend: Maven-Profil `teamscale-tia`
- Backend-Coverage: JaCoCo-Report über Profil `jacoco`
- Frontend-Coverage: Playwright-Ausführung mit anschließendem LCOV-Report
- Upload der Backend- und Frontend-Coverage nach Teamscale

### SonarCloud

Workflow: `.github/workflows/sonarcloud.yml`

SonarCloud analysiert Backend- und Frontend-Quellcode. Vor der Analyse werden Backend-Tests über `./mvnw -B verify` sowie Frontend-Linting und Build ausgeführt.

## Coverage

Für das Backend wird JaCoCo verwendet:

Der Report wird unter `backend/sqs-verkehrsapp/target/site/jacoco/jacoco.xml` erzeugt.

Für das Frontend wird LCOV über Playwright und NYC erzeugt:

Der Report wird unter `frontend/coverage/lcov.info` erzeugt.

## Testdaten

Im Backend existiert ein Testnutzer für lokale und demonstrative Szenarien:

- Benutzername: `testuser`
- Passwort: `test123`
- hinterlegte Autobahnen: `A3`, `A92`