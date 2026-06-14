# 12. Glossar

## 12.1 Überblick

Dieses Glossar definiert die wichtigsten fachlichen, technischen und architekturellen Begriffe, die innerhalb der SQS Verkehrsapp verwendet werden.

Ziel ist ein einheitliches Verständnis aller Begriffe für Entwickler, Architekten, Prüfer und weitere Stakeholder.

---

## 12.2 Fachliche Begriffe

| Begriff              | Beschreibung                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Autobahn             | Eine durch die Anwendung verwaltete und überwachte Straße (z. B. A3, A9, A93).                |
| Verkehrsereignis     | Ein Ereignis, das den Verkehrsfluss beeinflusst, beispielsweise eine Sperrung oder Baustelle. |
| Warnung (Warning)    | Verkehrshinweis mit mittlerem Gefährdungspotenzial.                                           |
| Baustelle (Roadwork) | Geplante oder laufende Straßenbaumaßnahme.                                                    |
| Sperrung (Closure)   | Vollständige oder teilweise Sperrung einer Straße.                                            |
| Risikobewertung      | Fachliche Bewertung einer Verkehrssituation anhand definierter Regeln.                        |
| Risikoscore          | Numerischer Wert zwischen 0 und 100 zur Bewertung einer Verkehrslage.                         |
| Dashboard            | Personalisierte Übersicht über gespeicherte Autobahnen und deren Verkehrssituation.           |
| Favorit              | Eine vom Benutzer gespeicherte Autobahn.                                                      |
| Verkehrsdaten        | Informationen über aktuelle Ereignisse auf einer Autobahn.                                    |

---

## 12.3 Domänenmodell

| Begriff                | Beschreibung                                                              |
| ---------------------- | ------------------------------------------------------------------------- |
| AppUser                | Domänenobjekt eines registrierten Benutzers.                              |
| SavedRoad              | Domänenobjekt einer gespeicherten Autobahn.                               |
| RoadEvent              | Domänenobjekt eines Verkehrsereignisses.                                  |
| TrafficEventsResult    | Ergebnis einer Verkehrsabfrage inklusive Risikoscore.                     |
| SavedRoadTrafficResult | Zusammenfassung gespeicherter Autobahnen inklusive Verkehrsinformationen. |
| Coordinate             | Geografische Position eines Verkehrsereignisses.                          |
| RiskLevel              | Fachliche Risikostufe eines Ereignisses.                                  |
| RoadEventType          | Klassifikation eines Verkehrsereignisses.                                 |
| RiskScoreCalculator    | Domänenservice zur Berechnung des Risikoscores.                           |

---

## 12.4 Risikobewertung

### RiskLevel

| Wert   | Bedeutung        |
| ------ | ---------------- |
| LOW    | Geringes Risiko  |
| MEDIUM | Mittleres Risiko |
| HIGH   | Hohes Risiko     |

---

### RoadEventType

| Wert     | Bedeutung       |
| -------- | --------------- |
| WARNING  | Verkehrswarnung |
| ROADWORK | Baustelle       |
| CLOSURE  | Straßensperrung |

---

## 12.5 Architekturbegriffe

| Begriff                | Beschreibung                                                    |
| ---------------------- | --------------------------------------------------------------- |
| Hexagonale Architektur | Architekturansatz zur Trennung von Fachlogik und Infrastruktur. |
| Ports & Adapters       | Architekturprinzip der Hexagonalen Architektur.                 |
| Input Port             | Schnittstelle für fachliche Anwendungsfälle.                    |
| Output Port            | Schnittstelle zu externen Systemen.                             |
| Adapter                | Implementierung eines Ports.                                    |
| Use Case               | Fachlicher Anwendungsfall der Anwendung.                        |
| Service                | Implementierung eines Use Cases.                                |
| Domäne                 | Fachlicher Kern der Anwendung.                                  |
| Inbound Adapter        | Eingehende Schnittstelle, beispielsweise REST-Controller.       |
| Outbound Adapter       | Ausgehende Infrastrukturkomponente.                             |

---

## 12.6 Anwendungskomponenten

### Controller

| Komponente             | Beschreibung                               |
| ---------------------- | ------------------------------------------ |
| AuthController         | Registrierung und Anmeldung von Benutzern. |
| TrafficController      | Abruf von Verkehrsinformationen.           |
| SavedRoadController    | Verwaltung gespeicherter Autobahnen.       |
| DashboardController    | Bereitstellung der Dashboard-Daten.        |
| GlobalExceptionHandler | Zentrale Fehlerbehandlung.                 |

---

### Services

| Komponente              | Beschreibung                              |
| ----------------------- | ----------------------------------------- |
| AuthService             | Authentifizierung und Benutzerverwaltung. |
| TrafficService          | Verarbeitung von Verkehrsdaten.           |
| SavedRoadService        | Verwaltung gespeicherter Autobahnen.      |
| DashboardTrafficService | Aggregation von Dashboard-Daten.          |

---

### Ports

| Port                   | Verantwortung                        |
| ---------------------- | ------------------------------------ |
| UserPort               | Benutzerverwaltung.                  |
| SavedRoadPort          | Verwaltung favorisierter Autobahnen. |
| AutobahnApiPort        | Zugriff auf Verkehrsdaten.           |
| RoadEventCachePort     | Verwaltung des Verkehrsdaten-Caches. |
| AvailableRoadCachePort | Verwaltung des Autobahn-Caches.      |

---

## 12.7 Persistenzbegriffe

| Begriff               | Beschreibung                                        |
| --------------------- | --------------------------------------------------- |
| Repository            | Datenzugriffsschicht auf Basis von Spring Data JPA. |
| Entity                | Persistentes Datenobjekt einer Datenbanktabelle.    |
| UserEntity            | Persistentes Benutzerobjekt.                        |
| SavedRoadEntity       | Persistente gespeicherte Autobahn.                  |
| CachedRoadEventEntity | Persistentes Cache-Objekt für Verkehrsdaten.        |
| AvailableRoadEntity   | Persistente verfügbare Autobahn.                    |
| JPA                   | Java Persistence API.                               |
| Datenbank-Cache       | Speicherung von API-Daten innerhalb der Datenbank.  |

---

## 12.8 Sicherheitsbegriffe

| Begriff                 | Beschreibung                                                 |
| ----------------------- | ------------------------------------------------------------ |
| JWT                     | JSON Web Token zur Authentifizierung.                        |
| Authentication          | Identitätsprüfung eines Benutzers.                           |
| Authorization           | Prüfung von Zugriffsrechten.                                 |
| BCrypt                  | Verfahren zur Passwort-Hashing.                              |
| Security Context        | Von Spring Security verwalteter Authentifizierungsstatus.    |
| JwtAuthenticationFilter | Filter zur JWT-Validierung.                                  |
| JwtService              | Erzeugung und Validierung von JWTs.                          |
| Bearer Token            | Authentifizierungstoken innerhalb des Authorization-Headers. |

---

## 12.9 Resilience- und Caching-Begriffe

| Begriff             | Beschreibung                                              |
| ------------------- | --------------------------------------------------------- |
| Retry               | Automatische Wiederholung fehlgeschlagener Aufrufe.       |
| Circuit Breaker     | Schutzmechanismus gegen wiederholte Fehlaufrufe.          |
| Fallback            | Alternative Datenquelle bei Fehlern.                      |
| Cache               | Zwischenspeicherung häufig benötigter Daten.              |
| Cache Fallback      | Nutzung gespeicherter Daten bei Ausfall externer Systeme. |
| Resilience4j        | Bibliothek für Fehlertoleranzmechanismen.                 |
| Asynchrones Caching | Nicht-blockierende Speicherung von Cache-Daten.           |

---

## 12.10 API- und Kommunikationsbegriffe

| Begriff   | Beschreibung                                   |
| --------- | ---------------------------------------------- |
| REST      | Architekturstil für Webschnittstellen.         |
| Endpoint  | URL einer API-Funktion.                        |
| JSON      | Datenformat für die Kommunikation.             |
| DTO       | Data Transfer Object.                          |
| Mapper    | Transformation zwischen DTO und Domänenmodell. |
| WebClient | HTTP-Client von Spring WebFlux.                |
| HTTP      | Hypertext Transfer Protocol.                   |
| HTTPS     | Verschlüsselte Variante von HTTP.              |

---

## 12.11 Qualitätsbegriffe

| Begriff           | Beschreibung                                                |
| ----------------- | ----------------------------------------------------------- |
| Wartbarkeit       | Aufwand für Änderungen und Erweiterungen.                   |
| Testbarkeit       | Aufwand zur Verifikation von Funktionalität.                |
| Sicherheit        | Schutz vor unbefugtem Zugriff.                              |
| Verfügbarkeit     | Fähigkeit eines Systems, verfügbar zu bleiben.              |
| Erweiterbarkeit   | Möglichkeit zur Integration neuer Funktionen.               |
| Performance       | Geschwindigkeit und Ressourceneffizienz eines Systems.      |
| Technische Schuld | Bekannte Verbesserungspotenziale innerhalb der Architektur. |

---

## 12.12 Abkürzungen

| Abkürzung | Bedeutung                          |
| --------- | ---------------------------------- |
| ADR       | Architecture Decision Record       |
| API       | Application Programming Interface  |
| DTO       | Data Transfer Object               |
| HTTP      | Hypertext Transfer Protocol        |
| HTTPS     | Hypertext Transfer Protocol Secure |
| JPA       | Java Persistence API               |
| JWT       | JSON Web Token                     |
| REST      | Representational State Transfer    |
| UUID      | Universally Unique Identifier      |

---

## 12.13 Zusammenfassung

Das Glossar definiert die wichtigsten Begriffe der SQS Verkehrsapp und bildet den gemeinsamen Sprachraum für Fachlichkeit, Architektur und technische Umsetzung.

Gemeinsam mit den vorherigen Kapiteln vervollständigt es die arc42-Dokumentation und unterstützt die langfristige Wartbarkeit sowie das Verständnis der Systemarchitektur.

