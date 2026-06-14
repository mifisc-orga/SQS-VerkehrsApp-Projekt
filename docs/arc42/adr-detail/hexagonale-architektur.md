# ADR: Hexagonale Architektur im Backend

## Status

Akzeptiert am 01.05.2026

## Beteiligte

Alle Teammitglieder waren anwesend.

## Kontext

In der Vorlesung wurden verschiedene Architekturstile besprochen. Ein besonderer Fokus lag dabei auf der Hexagonalen Architektur.

Unser Projekt besteht aus einem Backend, das fachliche Logik für die VerkehrsApp bereitstellt, sowie einem separaten Frontend. Das Backend muss Daten verarbeiten, externe Informationen einbinden und Schnittstellen für das Frontend bereitstellen. Damit diese Verantwortlichkeiten nicht unkontrolliert vermischt werden, soll die Struktur des Backends fachliche Logik klar von technischen Details trennen.

Ohne eine bewusst gewählte Architektur besteht das Risiko, dass Controller, Datenbankzugriffe, externe Schnittstellen und Geschäftslogik eng miteinander gekoppelt werden. Das würde Änderungen erschweren, Tests komplizierter machen und spätere Erweiterungen, zum Beispiel neue Datenquellen oder alternative Schnittstellen, unnötig aufwendig gestalten.

## Entscheidung

Das Backend wird nach den Prinzipien der Hexagonalen Architektur aufgebaut.

Die fachliche Logik bildet den Kern der Anwendung. Sie soll möglichst unabhängig von technischen Details wie REST-Controllern, Datenbankzugriffen oder externen APIs bleiben. Technische Bestandteile werden über Adapter angebunden. Die Kommunikation zwischen Anwendungskern und technischen Bestandteilen erfolgt über definierte Schnittstellen, also Ports.

Für das Projekt bedeutet das insbesondere:

- Fachliche Regeln und Anwendungsfälle werden nicht direkt in Controller oder Persistenzklassen ausgelagert.
- Eingehende Adapter, zum Beispiel REST-Controller, rufen Anwendungsfälle des Backends auf.
- Ausgehende Adapter, zum Beispiel Repositories oder externe API-Clients, kapseln technische Zugriffe.
- Der Anwendungskern soll unabhängig von konkreten Framework-Details bleiben, soweit das im Projektumfang sinnvoll umsetzbar ist.
- Neue technische Integrationen sollen möglichst ergänzt werden können, ohne die fachliche Kernlogik stark verändern zu müssen.

## Konsequenzen

- Die Backend-Struktur muss bewusst in fachliche Logik, Schnittstellen und technische Adapter gegliedert werden.
- Entwicklerinnen und Entwickler müssen beim Erstellen neuer Features darauf achten, Abhängigkeiten in die richtige Richtung zu halten.
- Tests können gezielter geschrieben werden, da fachliche Logik unabhängig von technischen Schnittstellen geprüft werden kann.
- Das Frontend ist nicht Teil der Hexagonalen Architektur des Backends, muss aber die vom Backend bereitgestellten Schnittstellen sauber nutzen.

## Begründung

Die Entscheidung wurde getroffen, weil die Hexagonale Architektur die Wartbarkeit, Erweiterbarkeit und Testbarkeit des Backends verbessert und gleichzeitig gut zu den in der Vorlesung behandelten Architektur- und Qualitätszielen passt.
