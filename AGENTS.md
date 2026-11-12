# Hinweise für Coding-Agenten

Juricane ist eine Desktop-Jukebox (Electron) für eine lokale Musikbibliothek, gedacht als Touch-/Kiosk-Oberfläche. Stack, Architektur, Datenmodell und Konfiguration stehen in der [README.md](./README.md) – lies sie zuerst.

## Arbeitsweise

- Arbeite immer auf einem eigenen Branch und öffne einen Pull Request gegen `main`. Kein direkter Push auf `main`.
- Ein PR setzt genau ein Issue um. Verweise im PR-Text mit `Closes #<Nummer>` darauf.
- Halte dich an die Akzeptanzkriterien und an den Abschnitt „Nicht ändern“ des Issues. Ist das Issue unklar oder widersprüchlich, frage im Issue nach, statt zu raten.
- Halte Änderungen klein: kein Refactoring, keine Abhängigkeits-Updates und keine Umformatierung, die das Issue nicht verlangt.
- Erstelle keine Tags und keine Releases. Das macht ein Mensch (Tag `v*` löst den Release-Workflow aus).

## Befehle

Paketmanager ist **Yarn classic (v1)**, Node 18 oder 20. Nicht `npm install` verwenden und keine `package-lock.json` im Projektwurzelordner anlegen.

| Befehl | Zweck |
|--------|-------|
| `yarn` | Abhängigkeiten installieren (führt auch `postinstall` aus) |
| `yarn lint` | ESLint |
| `npx tsc --noEmit` | Typecheck |
| `yarn build` | Produktions-Build von Main und Renderer |
| `yarn test` | Jest – benötigt einen vorhandenen Build, also vorher `yarn build` |
| `yarn start` | App im Dev-Modus (braucht eine grafische Oberfläche) |

Vor jedem PR müssen `yarn lint`, `npx tsc --noEmit`, `yarn build` und `yarn test` fehlerfrei laufen. Die CI (`.github/workflows/test.yml`) prüft dasselbe auf macOS und Ubuntu.

Die App lässt sich in einer Cloud-Umgebung ohne Display nicht sinnvoll starten. Schreibe im PR ausdrücklich, was du nur über Tests und Build geprüft hast und was ein Mensch in der laufenden App ansehen sollte.

## Code-Konventionen

- TypeScript, 2 Leerzeichen, LF-Zeilenenden, einfache Anführungszeichen (Prettier-Konfiguration in `package.json`, ESLint `erb`).
- Main-Prozess unter `src/main/`, UI unter `src/renderer/`. Der Renderer greift nur über die in `src/main/preload.ts` freigegebene IPC-Schnittstelle auf Dateisystem und Node zu. Neue IPC-Kanäle brauchen den Handler in `src/main/main.ts` und den Eintrag in `preload.ts`.
- Zustand: Redux Toolkit in `src/renderer/slices/`, Nebenwirkungen in `src/renderer/sagas/`, Bibliotheksdaten über React Query.
- UI-Komponenten mit MUI 5; bestehende Komponenten in `src/renderer/components/` als Vorbild nehmen. Die Oberfläche wird per Touch bedient: große Klickflächen, keine Hover-only-Funktionen.
- Alle sichtbaren Texte laufen über i18next. Neue Texte in `assets/locales/de` eintragen, nicht fest im Code.
- Für neue Logik ohne UI (Parser, Loader, Hilfsfunktionen) einen Jest-Test neben die Datei legen (`*.test.ts`), wie `src/main/playlist-loader/music-tag-loader.test.ts`.

## Nicht anfassen (außer das Issue verlangt es ausdrücklich)

- `.github/workflows/` – CI und Release
- `.erb/` – Webpack- und Build-Skripte der Boilerplate
- `config.json` – Beispielkonfiguration mit lokalen Pfaden; keine echten Pfade oder Passwörter committen
- `release/app/package.json` – enthält die App-Version; Versionssprünge macht ein Mensch
- `yarn.lock` – nur ändern, wenn das Issue eine neue oder geänderte Abhängigkeit verlangt

## Pull Request

Beschreibe im PR kurz:

1. was sich für den Nutzer ändert,
2. welche Dateien bzw. Bereiche betroffen sind,
3. wie du es geprüft hast (Befehle und Ergebnis),
4. was ein Mensch noch manuell in der App testen sollte.
