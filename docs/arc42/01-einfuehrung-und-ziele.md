# 01. Einführung und Ziele

## 1.1 Aufgabenstellung

Die SQS Verkehrsapp ist eine webbasierte Anwendung zur Bereitstellung und Verwaltung von Verkehrsinformationen für deutsche Autobahnen. Die Anwendung integriert Verkehrsdaten einer externen Autobahn-API und stellt diese Benutzern über eine REST-basierte Schnittstelle zur Verfügung.

Neben dem Abruf aktueller Verkehrsmeldungen ermöglicht die Anwendung registrierten Benutzern das Speichern favorisierter Autobahnen sowie die Anzeige verkehrsrelevanter Informationen in einem personalisierten Dashboard.

Die Anwendung wurde im Rahmen eines Software-Qualitätsprojekts entwickelt und legt besonderen Wert auf Wartbarkeit, Testbarkeit, Ausfallsicherheit und eine saubere Architekturstruktur nach den Prinzipien der Hexagonalen Architektur (Ports & Adapters).

---

## 1.2 Fachliche Ziele

Die Anwendung verfolgt die folgenden fachlichen Ziele:

### Bereitstellung aktueller Verkehrsinformationen

Benutzer sollen aktuelle Verkehrsinformationen für einzelne Autobahnen oder das gesamte verfügbare Straßennetz abrufen können.

### Verwaltung favorisierter Autobahnen

Registrierte Benutzer sollen Autobahnen speichern, abrufen und verwalten können.

### Personalisierte Dashboard-Ansicht

Für gespeicherte Autobahnen sollen aggregierte Verkehrsinformationen in einer zentralen Dashboard-Ansicht bereitgestellt werden.

### Risikobewertung von Verkehrssituationen

Verkehrsereignisse sollen anhand eines definierten Bewertungsmodells analysiert und durch einen Risikoscore bewertet werden.

### Hohe Verfügbarkeit von Verkehrsdaten

Auch bei Ausfällen externer Systeme sollen Verkehrsdaten über lokale Cache-Mechanismen weiterhin verfügbar bleiben.

---

## 1.3 Qualitätsziele

Die folgenden Qualitätsziele wurden priorisiert und bilden die Grundlage für die Architekturentscheidungen des Systems.

### QZ-1 Wartbarkeit

Die Architektur soll eine einfache Erweiterung und Anpassung ermöglichen. Änderungen an Infrastrukturkomponenten dürfen keine Auswirkungen auf die Fachlogik haben.

**Priorität:** Hoch

---

### QZ-2 Testbarkeit

Die Anwendung soll durch eine klare Trennung von Verantwortlichkeiten sowie den Einsatz von Ports und Adaptern effizient testbar sein.

**Priorität:** Hoch

---

### QZ-3 Ausfallsicherheit

Fehler externer Systeme dürfen nicht unmittelbar zum Ausfall der Anwendung führen. Verkehrsdaten sollen über Fallback-Mechanismen weiterhin bereitgestellt werden können.

**Priorität:** Hoch

---

### QZ-4 Sicherheit

Benutzerbezogene Funktionen müssen durch eine sichere Authentifizierung und Autorisierung geschützt werden.

**Priorität:** Hoch

---

### QZ-5 Erweiterbarkeit

Neue Datenquellen, Cache-Mechanismen oder Persistenzlösungen sollen mit minimalem Aufwand integriert werden können.

**Priorität:** Mittel

---

### QZ-6 Performance

Anfragen sollen mit möglichst geringer Latenz beantwortet werden. Wiederkehrende Daten werden deshalb lokal zwischengespeichert.

**Priorität:** Mittel

---

## 1.4 Stakeholder

| Stakeholder           | Interesse                                         |
| --------------------- | ------------------------------------------------- |
| Endbenutzer           | Aktuelle und zuverlässige Verkehrsinformationen   |
| Entwicklerteam        | Wartbare und testbare Architektur                 |
| Projektbetreuer       | Nachvollziehbare Architektur und Softwarequalität |
| Systemadministratoren | Stabiler und ausfallsicherer Betrieb              |
| Betreiber             | Hohe Verfügbarkeit und geringe Betriebsaufwände   |

---

## 1.5 Systemübersicht

Die SQS Verkehrsapp besteht aus den folgenden Hauptbestandteilen:

* REST-basierte API
* Authentifizierung mittels JSON Web Token (JWT)
* Fachlogik zur Verarbeitung von Verkehrsdaten
* Persistenzschicht für Benutzer- und Cache-Daten
* Integration einer externen Autobahn-API
* Lokale Cache-Mechanismen zur Ausfallsicherung

Die Anwendung folgt einer Hexagonalen Architektur, wodurch Fachlogik, Infrastruktur und externe Systeme klar voneinander getrennt werden.

---

## 1.6 Architekturrelevante Anforderungen

Die Architektur muss folgende Anforderungen erfüllen:

1. Entkopplung von Fachlogik und Infrastruktur
2. Austauschbarkeit externer Systeme
3. Unterstützung automatisierter Tests
4. Sichere Authentifizierung und Autorisierung
5. Robuste Fehlerbehandlung
6. Unterstützung von Retry-, Circuit-Breaker- und Cache-Fallback-Mechanismen
7. Einfache Erweiterbarkeit zukünftiger Funktionen

Diese Anforderungen bilden die Grundlage für die in Kapitel 4 beschriebene Lösungsstrategie.
