# ADR: `frontend-init` nur noch als Feature-Vorlage verwenden

## Status

Akzeptiert am 28.04.2026

## Beteiligte

Alle Teammitglieder waren anwesend.

## Kontext

Der Branch `frontend-init` wurde initial als Grundlage für das Frontend erstellt. Der darin enthaltene Code wurde mithilfe eines KI-Prompts generiert, der nicht spezifisch genug war. Dadurch wurden die Architekturvorgaben und die geplante Struktur des Projekts nicht ausreichend berücksichtigt. Eine direkte Weiterentwicklung auf Basis dieses Branches wuerde das Risiko erhöhen, dass nicht passende Architekturentscheidungen übernommen werden. Das kann zu hoeherem Anpassungsaufwand, inkonsistenter Struktur und schwerer wartbarem Code fuehren.

## Entscheidung

Der Branch `frontend-init` wird nicht als verbindliche technische Grundlage für die weitere Entwicklung verwendet.

## Konsequenzen

- Der bestehende Code aus `frontend-init` darf als Orientierung für einzelne Ideen, Strukturen oder UI-Ansaetze genutzt werden.
- Architekturentscheidungen aus `frontend-init` werden nicht automatisch übernommen.
- Neue Frontend-Implementierungen müssen die vereinbarte Projektarchitektur aktiv berücksichtigen.
- Feature-Arbeit erfolgt in separaten Branches mit Pull Requests.
- Durch Reviews wird sichergestellt, dass neue Änderungen zur Architektur und zum Projektziel passen.

## Begründung

Die Entscheidung reduziert das Risiko, ungeeignete oder zufällige KI-generierte Architekturstrukturen dauerhaft in das Projekt zu übernehmen. Gleichzeitig bleibt der bereits entstandene Branch als praktische Vorlage nutzbar, ohne die weitere Architekturentwicklung einzuschränken.
