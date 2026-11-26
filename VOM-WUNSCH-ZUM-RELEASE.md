# Vom Wunsch zum Release

Diese Anleitung beschreibt, wie du Juricane weiterentwickelst, ohne selbst zu programmieren: Du beschreibst eine Änderung, ein KI-Agent setzt sie um, du gibst sie frei und erzeugst eine neue Version zum Herunterladen.

Du brauchst dafür keine Vorkenntnisse in Git oder GitHub. Alles geschieht im Browser auf [github.com/spielzeug-gefunden/juricane](https://github.com/spielzeug-gefunden/juricane). Die Anleitung erklärt das, was für diesen Ablauf nötig ist.

---

## Der Ablauf auf einen Blick

```text
 1. Wunsch beschreiben      →  Issue anlegen
 2. Agent beauftragen       →  Kommentar „@claude bitte umsetzen“
 3. Ergebnis prüfen         →  Pull Request öffnen, Checks abwarten,
                               optional die App schon jetzt ausprobieren
    (bei Bedarf nachschärfen →  Kommentar „@claude …“ im Pull Request)
 4. Freigeben               →  Pull Request mergen
 5. Version erzeugen        →  Release mit neuem Tag veröffentlichen
 6. Testen                  →  Zip herunterladen, entpacken, starten
```

Ein Durchlauf dauert typischerweise 15 bis 30 Minuten, davon wartest du die meiste Zeit auf den Agenten und die automatischen Prüfungen.

---

## Die wenigen Begriffe, die du brauchst

| Begriff | Was es hier bedeutet |
|---|---|
| **Issue** | Ein Auftrag: „Die App soll künftig …“. Reiter **Issues**. |
| **Pull Request (PR)** | Der Änderungsvorschlag des Agenten zu einem Issue. Reiter **Pull requests**. Solange er nicht gemergt ist, ändert sich an der App nichts. |
| **main** | Der Entwicklungsstand, aus dem Versionen gebaut werden. Jeder gemergte PR landet hier. |
| **Merge** | Einen PR freigeben, also seine Änderung in `main` übernehmen. |
| **Checks** | Automatische Prüfungen, die bei jedem PR laufen (Tests, Build, Code-Review). |
| **Tag / Release** | Eine Versionsnummer wie `v0.5.0`, die einen Stand von `main` festhält. Zu jedem Release baut GitHub automatisch das Zip zum Herunterladen. |

---

## Voraussetzungen (einmalig)

- **Ein GitHub-Konto.** Kostenlos unter [github.com/signup](https://github.com/signup).
- **Schreibrecht im Repository.** Nur Personen mit Schreibrecht können den Agenten starten, PRs mergen und Releases erstellen. Der Inhaber des Repositorys lädt dich ein unter **Settings → Collaborators → Add people**; du bekommst eine E-Mail, in der du die Einladung annimmst.

Installieren musst du nichts. Zum Testen der App reicht ein Windows-PC.

> **Wichtig:** Das Repository ist öffentlich. Alles, was du in Issues und Kommentare schreibst, kann jeder lesen. Schreib dort keine echten Passwörter, keine internen Pfade und keine personenbezogenen Daten hinein, und lade nie eine echte `config.json` hoch.

---

## Schritt 1: Den Wunsch als Issue beschreiben

1. Reiter **Issues** → **New issue**.
2. Vorlage wählen:
   - **Änderung / neue Funktion** – die App soll etwas Neues können oder etwas anders machen
   - **Fehler** – etwas funktioniert nicht wie gewünscht
3. Kurzen, treffenden **Titel** vergeben, z. B. „Cover per Klick vergrößern“.
4. Die Abschnitte der Vorlage ausfüllen (die grauen Hinweistexte kannst du stehen lassen oder löschen) und auf **Create** bzw. **Submit new issue** klicken.

Schreib noch **kein** `@claude` in den Issue-Text. Sonst legt der Agent sofort los, bevor du das Issue in Ruhe fertig hast.

### So wird ein Issue gut

Der Agent setzt genau das um, was im Issue steht. Je klarer das Issue, desto besser das Ergebnis.

- **Eine Sache pro Issue.** Drei Wünsche sind drei Issues. Kleine Aufträge gelingen deutlich zuverlässiger als große.
- **Aus Sicht des Benutzers schreiben.** Was sieht oder tut man in der App danach anders? Wie es technisch gelöst wird, musst du nicht wissen.
- **Prüfbare Akzeptanzkriterien.** Jeder Punkt sollte sich mit „ja, erfüllt“ oder „nein“ beantworten lassen. Diese Liste nimmst du später auch zum Testen.
- **„Nicht ändern“ nutzen.** Was ausdrücklich so bleiben soll, wie es ist, gehört hierher. Das verhindert ungewollte Nebenwirkungen.
- **Bei Fehlern:** die App-Version (steht im Namen des Zips, z. B. `v0.4.1`) und die Schritte zum Nachstellen angeben. Ein Screenshot hilft.

**Beispiel:**

```markdown
## Ziel
Neue MP3-Dateien sollen in der App erscheinen, ohne dass jemand von Hand
die trackdb.json löschen muss.

## Akzeptanzkriterien
- [ ] Auf der Admin-Seite gibt es einen Knopf „Bibliothek neu einlesen“.
- [ ] Vor dem Start fragt ein Dialog nach Bestätigung.
- [ ] Danach erscheinen neue Titel, ohne dass die App neu gestartet werden muss.
- [ ] Nach Abschluss wird die Anzahl der gefundenen Titel angezeigt.

## Nicht ändern
- Verhalten beim normalen Start der App
```

---

## Schritt 2: Den Agenten beauftragen

Schreib im Issue einen Kommentar:

```text
@claude bitte umsetzen
```

und klick auf **Comment**.

Was dann passiert:

1. Nach wenigen Sekunden antwortet **claude** mit einem Kommentar, dass er arbeitet. Der Kommentar wird laufend aktualisiert.
2. Nach etwa 3 bis 10 Minuten steht dort **„Claude finished …“** mit einer Zusammenfassung und einem Link **„Create PR ➔“**.
3. Auf **Create PR ➔** klicken. Es öffnet sich eine Seite mit vorausgefülltem Titel und Text. Unten auf **Create pull request** klicken.

Erst damit existiert der Pull Request. Der Agent erstellt ihn nicht selbst.

**Wenn der Agent eine Rückfrage stellt** statt umzusetzen: Antworte im Issue und beginne die Antwort wieder mit `@claude`, z. B. `@claude Der Knopf soll unten rechts sitzen. Bitte umsetzen.`

---

## Schritt 3: Das Ergebnis prüfen

Öffne den Pull Request (Reiter **Pull requests**).

### Checks abwarten

Unten im PR stehen die automatischen Prüfungen. Nach 2 bis 5 Minuten sollten alle einen grünen Haken haben:

| Check | Prüft |
|---|---|
| **Test** | Code-Regeln, Typen, Build und automatische Tests |
| **PR Build** | ob sich die Windows-App bauen lässt; liefert die App zum Ausprobieren |
| **claude-review** | ein zweiter KI-Agent liest die Änderung gegen und hinterlässt einen Kommentar |
| **CodeQL** | Sicherheitsprüfung |

Die Checks sperren den Merge-Knopf **nicht**. Du musst selbst darauf achten: **Bei einem roten Kreuz nicht mergen**, sondern den Agenten um Korrektur bitten (siehe unten).

### Optional: die App vor dem Merge ausprobieren

Dieser Test ist freiwillig. Du kannst ihn überspringen, direkt mergen und erst die fertige Version in Schritt 6 testen. Ist dort etwas nicht in Ordnung, gibt es eben eine weitere Version mit einer Korrektur.

Lohnend ist der Test vor dem Merge vor allem,

- wenn die Änderung größer ist oder du dir beim Ergebnis unsicher bist,
- wenn du Korrekturen noch im selben PR erledigen willst, statt dafür ein neues Issue anzulegen,
- wenn du mehrere PRs sammelst, bevor du eine Version erzeugst: So weißt du bei einem Fehler, welcher PR ihn verursacht hat.

Das Zip zum PR baut GitHub automatisch mit; du musst nichts anstoßen. Es unterscheidet sich in drei Punkten vom Release-Zip: Zum Herunterladen musst du bei GitHub angemeldet sein, es wird nach 7 Tagen gelöscht, und die App zeigt nicht die künftige Versionsnummer an, sondern eine alte Platzhalter-Version.

So geht's:

1. Im PR auf den Reiter **Checks** → links **PR Build** → **Summary**.
2. Unten unter **Artifacts** auf `juricane-windows-pr-<Nummer>` klicken. Es lädt ein Zip herunter.
3. Entpacken, eine passende `config.json` in denselben Ordner legen, `Juricane.exe` starten (Details in Schritt 6).
4. Die Akzeptanzkriterien aus dem Issue durchgehen.

### Nachschärfen

Passt etwas noch nicht, schreib einen Kommentar **im Pull Request** (nicht im Issue):

```text
@claude Der Bestätigungsdialog fehlt noch. Bitte ergänzen.
```

Der Agent arbeitet dann am selben PR weiter. Die Checks laufen danach erneut.

Nicht noch einmal `@claude bitte umsetzen` im Issue schreiben, wenn es schon einen PR gibt: Dann fängt der Agent von vorn an, und es entstehen zwei konkurrierende PRs, die sich gegenseitig blockieren.

---

## Schritt 4: Freigeben (Merge)

Wenn alle Checks grün sind und, falls du vorab getestet hast, das Ergebnis passt:

1. Unten im PR auf **Merge pull request** → **Confirm merge**.
2. Optional anschließend **Delete branch** klicken. Das räumt nur auf, die Änderung bleibt erhalten.

Das zugehörige Issue wird dabei automatisch geschlossen.

**Tipps:**

- **Ein Issue nach dem anderen.** Laufen mehrere Aufträge gleichzeitig, können sich die PRs in die Quere kommen („This branch has conflicts“). Am einfachsten: einen PR mergen, dann das nächste Issue starten.
- **Versehentlich gemergt?** Im gemergten PR gibt es den Knopf **Revert**. Er erzeugt einen neuen PR, der die Änderung rückgängig macht; den mergst du wie gewohnt.

Du kannst mehrere PRs nacheinander mergen und erst danach eine Version erzeugen. Eine Version enthält immer alles, was bis dahin in `main` gemergt ist.

---

## Schritt 5: Eine neue Version erzeugen

1. Auf der Startseite des Repositorys rechts auf **Releases** → **Draft a new release**.
2. **Choose a tag**: die neue Versionsnummer eintippen, z. B. `v0.5.0`, und **Create new tag: v0.5.0 on publish** wählen.
3. **Target**: `main` (ist vorausgewählt).
4. **Release title**: dieselbe Versionsnummer, z. B. `v0.5.0`.
5. Auf **Generate release notes** klicken. GitHub listet dann die seit der letzten Version gemergten PRs auf.
6. **Publish release** klicken.

Danach baut GitHub die App. Das dauert etwa 5 bis 10 Minuten; den Fortschritt siehst du im Reiter **Actions** unter **Release**. Wenn er fertig ist, erscheint im Release unter **Assets** die Datei `Juricane-v0.5.0-win.zip`.

### Versionsnummern

Format: `v` + drei Zahlen, z. B. `v0.5.0`. Die neue Nummer muss immer höher sein als die letzte (steht oben in der Release-Liste als **Latest**).

| Art der Änderung | Welche Zahl erhöhen | Beispiel |
|---|---|---|
| nur Fehlerbehebungen | die letzte | `v0.4.1` → `v0.4.2` |
| neue Funktionen | die mittlere, letzte auf 0 | `v0.4.2` → `v0.5.0` |
| große, grundlegende Änderungen | die erste | `v0.5.0` → `v1.0.0` |

Eine einmal vergebene Versionsnummer nie wiederverwenden oder löschen. Ist eine Version fehlerhaft, gibt es einfach eine neue mit höherer Nummer.

---

## Schritt 6: Herunterladen und testen

1. Im Release unter **Assets** auf `Juricane-v….zip` klicken.
2. **Vor dem Entpacken:** Rechtsklick auf das Zip → **Eigenschaften** → unten **Zulassen** anhaken → **OK**. Sonst blockiert Windows später einzelne Dateien.
3. In einen **neuen, leeren Ordner** entpacken, z. B. `C:\Juricane\v0.5.0`. Nicht über eine ältere Version entpacken.
4. Die `config.json` der bisherigen Installation in diesen Ordner kopieren, direkt neben `Juricane.exe`. Fehlt sie, fragt die App beim Start, ob du eine vorhandene Datei importieren oder eine neue anlegen willst.
5. `Juricane.exe` starten. Erscheint **„Der Computer wurde durch Windows geschützt“**: auf **Weitere Informationen** → **Trotzdem ausführen**. Die Meldung kommt, weil die App nicht digital signiert ist.
6. Die Akzeptanzkriterien der enthaltenen Issues durchgehen. Welche Issues enthalten sind, steht in den Release Notes.

Die Musikbibliothek (`trackdb.json`) liegt im Musikordner, nicht im Programmordner. Sie bleibt beim Wechsel der Version erhalten.

**Etwas funktioniert nicht?** Leg ein neues Issue mit der Vorlage **Fehler** an, gib die Versionsnummer an, und der Kreislauf beginnt von vorn. Die ältere Version kannst du in ihrem eigenen Ordner weiter benutzen.

---

## Wenn etwas hakt

| Problem | Was tun |
|---|---|
| Der Agent reagiert nicht auf `@claude` | Prüfen, ob dein Konto Schreibrecht hat. Der Kommentar muss `@claude` enthalten. Im Reiter **Actions** nachsehen, ob ein Lauf **Claude Code** gestartet ist und ob er rot ist. |
| Der Agent bricht ab oder meldet ein Limit | Der Agent läuft über ein Claude-Abo mit Nutzungsgrenzen. Später erneut versuchen. |
| Der Agent sagt, er könne Workflow-Dateien nicht ändern | Das ist gewollt: Änderungen am Build- und Release-Ablauf (`.github/workflows/`) darf der Agent nicht vornehmen. Das muss jemand mit Entwicklerkenntnissen übernehmen. |
| Ein Check ist rot | Im PR kommentieren: `@claude Der Check „Test“ schlägt fehl. Bitte beheben.` |
| „This branch has conflicts“ im PR | Im PR kommentieren: `@claude Bitte die Konflikte mit main lösen.` Klappt das nicht, Hilfe holen. |
| Das Ergebnis ist völlig daneben | PR schließen (**Close pull request**), das Issue präzisieren und neu mit `@claude bitte umsetzen` beauftragen. |
| Das Release hat kein Zip | Reiter **Actions** → **Release**: Ist der Lauf noch gelb, warten. Ist er rot, Hilfe holen. |
| Windows startet die App nicht | Zip-Datei vor dem Entpacken freigeben (Schritt 6, Punkt 2) und in einen neuen Ordner entpacken. |

---

## Was du nicht tun musst (und nicht tun solltest)

- **Keine Dateien direkt auf GitHub bearbeiten.** Änderungen laufen immer über Issue und Pull Request.
- **Keine Releases löschen** und keine Versionsnummern wiederverwenden.
- **Keine Zugangsdaten** in Issues, Kommentaren oder Screenshots.

---

## Kosten

- Die automatischen Prüfungen und Builds auf GitHub sind für dieses öffentliche Repository kostenlos.
- Der Agent nutzt das Claude-Abo, das im Repository hinterlegt ist, und verbraucht dessen Kontingent.

---

Technische Details zu Aufbau, Konfiguration und Entwicklung stehen in der [README.md](./README.md); die Regeln für den Agenten in [AGENTS.md](./AGENTS.md).
