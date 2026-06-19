Techstack:
- React / TypeScript
- Java + Spring Boot
- PostgresSQL Datenbank
- Docker
- ReadTheDocs
- Sonarqube oder Teamscale?

Idee:
Autobahn Safety Monitor mit Autobahn App API für eine automatische Gefahrenstellenerkennung.

Planung:
- Heatmap für Unfälle und Gefahren
- Risiko-Score für Routen
- Persönliches Dashboard

Anleitung zum Starten:
- Gesamtes Projekt mit Docker starten: `docker compose up --build`
- Frontend mit Docker Compose: `http://localhost:3000`
- Backend API mit Docker Compose: `http://localhost:8080`
- Frontend lokal ohne Docker starten:
  - `cd frontend`
  - `npm install`
  - `npm run dev`
  - Vite stellt das Frontend dann unter `http://localhost:5173` bereit
- ReadTheDocs: `https://sqs-verkehrsapp.readthedocs.io/de/latest/`
- Teamscale: `[Teamscale Dashboard](https://th-rosenheim.teamscale.io/)`
- Sonarcloud: `[Sonarcloud Dashboard](https://sonarcloud.io/project/overview?id=mifisc-orga_SQS-VerkehrsApp-Projekt)`

Dokumentation der Teamabsprachen:
➡️ [Teammeeting](Teammeeting/Teammeeting.md)

Projektbeteiligte:
- Louisa Böhm
- Zlata Polovka
- Michael Fischermann
