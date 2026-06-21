# Autobahn Safety Monitor

Der **Autobahn Safety Monitor** ist eine Webanwendung zur automatischen Erkennung und Bewertung von Gefahrenstellen auf Autobahnen. Mithilfe der Autobahn App API werden aktuelle Verkehrsinformationen verarbeitet, um potenzielle Risiken sichtbar zu machen und Nutzerinnen und Nutzern eine bessere Einschätzung der Verkehrssituation zu ermöglichen.

Die Anwendung bietet unter anderem:

- eine **Heatmap** für Unfälle und Gefahrenstellen
- einen **Risiko-Score für Routen**
- ein **persönliches Dashboard** zur Übersicht relevanter Verkehrsinformationen

## Techstack

Das Projekt basiert auf folgendem Techstack:

- React / TypeScript
- Java + Spring Boot
- PostgreSQL Datenbank
- Docker
- ReadTheDocs
- SonarCloud
- Teamscale

## Anwendung starten

Die Anwendung kann vollständig über Docker Compose gestartet werden. Dafür ist nur ein Befehl notwendig:

```bash
docker-compose up --build
```

Nach dem Start ist die Anwendung im Browser erreichbar unter:

[http://localhost:3000](http://localhost:3000)

## Zusatzinformationen für Entwicklung und Dokumentation

Das Backend läuft nach dem Start über Docker Compose unter:

- Backend API: [http://localhost:8080](http://localhost:8080)

Das Frontend kann alternativ auch lokal ohne Docker gestartet werden:

```bash
cd frontend
npm install
npm run dev
```

Danach ist das lokal gestartete Frontend unter folgender Adresse erreichbar:

- Lokales Frontend: [http://localhost:5173](http://localhost:5173)

## Weitere Links

- ReadTheDocs: [Dokumentation](https://sqs-verkehrsapp.readthedocs.io/de/latest/)
- Teamscale: [Teamscale Dashboard](https://th-rosenheim.teamscale.io/)
- SonarCloud: [SonarCloud Dashboard](https://sonarcloud.io/project/overview?id=mifisc-orga_SQS-VerkehrsApp-Projekt)

## Dokumentation der Teamabsprachen

- [Teammeeting](docs/Teammeetings/Teammeeting.md)
- [Aufgabenverteilung](docs/Teammeetings/Aufgabenverteilung.md)

## Projektbeteiligte

- Louisa Böhm
- Zlata Polovka
- Michael Fischermann