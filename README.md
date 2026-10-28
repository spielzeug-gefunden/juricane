# Juricane

Desktop-Jukebox (Electron) zum Durchstöbern einer lokalen Musikbibliothek, Abspielen über eine Warteschlange und Verwalten eigener Playlists – typischerweise als Touch-/Kiosk-Oberfläche.

Dieses Repository ist der Fork [spielzeug-gefunden/juricane](https://github.com/spielzeug-gefunden/juricane). Basis ist [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).

---

## Stack

| Bereich | Technologie |
|--------|-------------|
| Runtime | Electron 25 |
| UI | React 18, MUI 5, React Router (MemoryRouter) |
| State | Redux Toolkit (+ Listener-Middleware / Saga-ähnliche Logik) |
| Daten laden | React Query |
| Audio | Howler |
| Build | Webpack 5, TypeScript 5, Yarn 1 |
| Packaging | electron-builder |
| i18n | i18next (aktuell nur `de`) |

---

## Architektur

```text
┌──────────────────────────── Main Process ────────────────────────────┐
│  src/main/main.ts                                                    │
│  • lädt config.json                                                  │
│  • baut/lädt trackdb.json aus dem Track-Verzeichnis                  │
│  • parst M3U-Playlists, eigene Playlists                             │
│  • IPC-Handler → Renderer                                            │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ preload (contextBridge)
┌───────────────────────────────▼──────────────────────────────────────┐
│  Renderer (React)                                                    │
│  • Library via React Query                                           │
│  • Queue / Playback via Redux + Howler                               │
│  • Admin-Modus (Passwort, Timeouts)                                  │
└──────────────────────────────────────────────────────────────────────┘
```

Wichtige Prozesse:

1. **Config** – `config.json` neben der App bzw. per Dialog / CLI-Switch `--config=…`
2. **Track-DB** – Beim ersten Laden wird unter `trackDirectory` eine `trackdb.json` erzeugt (ID3-Tags via `node-id3`, Cover nach `.trackimages/`). Existiert die Datei, wird sie wiederverwendet.
3. **Playlists** – rekursiv alle `*.m3u` unter `playlistDirectory`; Gruppenname = Parent-Ordnername.
4. **Eigene Playlists** – Dateien unter `ownPlaylistDirectory` (anlegen/ändern/löschen inkl. Zeitplanung).

---

## Voraussetzungen

- **Node.js** 18 oder 20 LTS
- **Yarn** classic (v1): `npm install -g yarn`
- **Git**
- Windows: bei Fehlern zu native Modules ggf. **Visual Studio Build Tools** (C++-Workload) – nicht VS Code

PowerShell blockiert oft `npm.ps1`:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
# oder: npm.cmd -v
```

---

## Setup

```powershell
git clone https://github.com/spielzeug-gefunden/juricane.git
cd juricane
yarn
```

### `config.json`

Im Repo liegt eine Beispiel-`config.json` mit absoluten Pfaden – **an lokale Verzeichnisse anpassen** (Windows-Pfade ok).

| Feld | Bedeutung |
|------|-----------|
| `trackDirectory` | Wurzel der Audiodateien; hier entstehen `trackdb.json` und `.trackimages/` |
| `playlistDirectory` | Ordnerbaum mit `.m3u`-Playlists |
| `ownPlaylistDirectory` | Speichern eigener Playlists |
| `adminPassword` | Freischaltung Admin-UI |
| `defaultPlaylistName` | Start-Playlist (Name ohne `.m3u`) |
| `showPlayButton` / `showNextTrackButton` | Steuerungselemente in der UI |
| `artistSeparators` / `genreSeparators` | Split-Regeln beim Tag-Import |
| `adminModeTimeoutSeconds` | Auto-Logout Admin |
| `backToWaitlistTimeoutSeconds` | Idle → zurück zur Queue-Ansicht |
| `playOwnPlaylistNowDelaySeconds` | Verzögerung „eigene Playlist jetzt“ |

Start mit expliziter Config:

```powershell
# Electron CLI-Switch (Main Process)
# Beispiel nach yarn start – Config-Dateiname relativ zum CWD:
# die App liest standardmäßig "config.json" im Arbeitsverzeichnis
```

Fehlt die Datei, öffnet die App einen Datei-Dialog („Bitte öffne die config.json Datei“).

### Empfohlene Test-Musikstruktur

```text
Musik/
  trackdb.json          ← wird generiert
  .trackimages/         ← wird generiert
  Artist/Album/*.mp3
  Playlisten/
    GenreA/
      Abend.m3u
    GenreB/
      Party.m3u
  eigene_playlisten/
```

M3U-Einträge sollten auf Dateien unter `trackDirectory` zeigen (relativ zur Playlist oder absolut; Pfade werden normalisiert).

---

## Skripte

| Befehl | Zweck |
|--------|--------|
| `yarn start` | Dev-Server (Renderer) + Electron Main |
| `yarn build` | Produktions-Build Main + Renderer |
| `yarn package` | Build + electron-builder (Installer laut `package.json` → Windows NSIS) |
| `yarn lint` | ESLint |
| `yarn test` | Jest |
| `npx tsc --noEmit` | Typecheck (ohne Emit) |

Nur Windows-Zip lokal (wie CI):

```powershell
yarn build
npx electron-builder build --win zip --x64 --publish never
```

Artefakte: `release/build/`.

---

## Projektstruktur

```text
src/
  main/                 Electron Main
    main.ts             Fenster, IPC, App-Lifecycle
    preload.ts          contextBridge → window.electron
    db-builder/         trackdb.json erzeugen/laden
    playlist-loader/    M3U, Tags, eigene Playlists
  renderer/             React UI
    App.tsx             Routes, Provider
    app/                Store, React Query, i18n
    slices/             Redux (music-player, admin)
    sagas/              Listener-/Playback-Nebenwirkungen
    components/         UI (Queue, Playlists, Tracks, Admin, …)
    audio/              Howler-Wrapper
  config.ts             Config-Typ
  consts.ts             u. a. .trackimages
  i18n.ts / assets/locales/
.erb/                   Boilerplate Webpack/Scripts
release/app/            electron-builder App-Paket (Version hier)
.github/workflows/
  release.yml           Tag v* → Windows-Zip GitHub Release
  test.yml              Lint/Test/Package (macOS/Ubuntu)
config.json             Laufzeit-Konfiguration (lokal anpassen)
```

### IPC (Auswahl)

Über `window.electron.ipcRenderer.*` (siehe `src/main/preload.ts`):

- `loadConfig` / `loadMusicLibrary`
- `loadOwnPlaylists` / `updateOwnPlaylist` / `deleteOwnPlaylist`
- `loadOwnPlaylistConfig` / `saveOwnPlaylistConfig`

---

## Datenmodell (kurz)

- **`Track`** – id, title, url, duration, artist[], genre[], album, year, hasImage  
- **`TrackDb`** – tracks + Indizes artists / genres / albums  
- **`MusicLibrary`** – TrackDb + `playlists` (aus M3U)  
- **`OwnPlaylist`** – name + trackIds  

UI-Routen (MemoryRouter): u. a. `/playing`, `/playlists`, `/playlists/own/:id`, Kategorie-Seiten für Artists/Genres/Alben/Tracks.

---

## Releases (CI)

Push eines Tags `v*` auf `main` startet GitHub Actions (`windows-latest`), baut ein **Zip** und hängt es an ein GitHub Release.

```powershell
git tag v0.1.0
git push origin v0.1.0
```

Manuell: Actions → **Release** → **Run workflow**.

Version der App: `release/app/package.json` (`version`).

---

## Qualität / Konventionen

- TypeScript strict-ish (Projekt-`tsconfig`); Prefers single quotes (Prettier in `package.json`)
- ESLint: `eslint-config-erb` / Airbnb-Basis
- UI-Texte über i18next (`de`); neue Strings in `assets/locales`
- Keine Secrets in `config.json` committen, die produktiv sind – Beispielpasswort nur für Dev
- `trackdb.json` und `.trackimages/` gehören zur Musikwurzel, nicht zwingend ins Git

---

## Troubleshooting

| Symptom | Maßnahme |
|---------|----------|
| `npm.ps1` ExecutionPolicy | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` oder `npm.cmd` |
| Library leer / Fehler beim Laden | Pfade in `config.json` prüfen; `trackdb.json` löschen und App neu starten (Rebuild) |
| M3U-Tracks fehlen | Pfade in der M3U vs. `trackDirectory` / Normalisierung |
| native Build-Fehler unter Windows | VS Build Tools (VCTools), dann `yarn` erneut |
| Port belegt beim Start | anderes Terminal schließen; Script prüft Port vor dem Dev-Server |

---

## Weiterführend

- Setup-/Agent-Doku außerhalb des Repos: `../00-setup.md` (Ordner `juricane-setup`)
- Upstream-Historie / Boilerplate: electron-react-boilerplate Docs
