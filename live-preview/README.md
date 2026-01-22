# Information Flow Live Preview

Ein leichtgewichtiger Webserver, der `.if` (Information Flow) Dateien überwacht und eine automatisch aktualisierende HTML-Vorschau bereitstellt.

## Features

- **Live Reload**: Browser aktualisiert sich automatisch bei Dateiänderungen
- **Drei Ansichten**: Timeline, Slices & Scenarios, Consolidated
- **Dark Theme**: Modernes, augenfreundliches Design
- **Scenario-Anzeige**: Zeigt Given-When-Then Szenarien für Commands und States

## Schnellstart

```bash
cd live-preview
npm install
npm run build
npm start ../examples/todo-app.if --open
```

Der Browser öffnet sich automatisch unter `http://localhost:3000`.

## CLI-Optionen

| Option | Beschreibung | Standard |
|--------|--------------|----------|
| `-p, --port <port>` | Server-Port | 3000 |
| `-o, --open` | Browser automatisch öffnen | false |
| `-h, --help` | Hilfe anzeigen | - |

**Beispiele:**

```bash
# Mit automatischem Browser-Start
npm start ../examples/todo-app.if --open

# Auf Port 8080
npm start model.if --port 8080

# Entwicklungsmodus (ohne Build)
npm run dev -- ../examples/todo-app.if -o
```

---

## Benutzeranleitung

### Ansichten (Views)

Das Tool bietet drei verschiedene Ansichten, die über die Tabs im Header gewechselt werden können:

#### 1. Timeline (Standard)

Die Timeline zeigt den chronologischen Ablauf des Information Flows:

```
┌─────────────────────────────────────────────────┐
│  Events         │ Commands/States │  Actors    │
│  (links)        │ (Mitte)         │  (rechts)  │
└─────────────────────────────────────────────────┘
```

- **Events** (●): Domain Events erscheinen links der Linie
- **Commands** (◆) & **States** (■): Befinden sich auf der mittleren Linie
- **Actors** (○): User-Interaktionen erscheinen rechts

**Show Details**: Mit der Checkbox "Show Details" können JSON-Datenmodelle ein-/ausgeblendet werden. Diese Einstellung wird im Browser gespeichert.

#### 2. Slices & Scenarios

Zeigt jeden Timeline-Eintrag als detaillierte Karte mit:

- JSON-Beispieldaten
- Beziehungen zu anderen Elementen
- **Szenarien** (falls definiert):
  - Commands: Given-When-Then Format
  - States/Read Models: Given-Then Format

**Beispiel eines Command-Szenarios:**
```
📋 Neues Todo erfolgreich erstellen
   Given: TodoList { "todos": [] }
   When:  CreateTodo { "title": "Einkaufen" }
   Then:  → TodoCreated { "id": "todo-1", "title": "Einkaufen" }
```

**Beispiel eines State-Szenarios:**
```
📋 Abgeschlossenes Todo wird markiert
   Given: TodoCreated { ... }
          TodoCompleted { ... }
   Then:  { "todos": [{ "completed": true }] }
```

#### 3. Consolidated

Eine kompakte Tabellenansicht mit allen Elementen:

| Tick | Type | Name | Related |
|------|------|------|---------|
| 1 | state | TodoList | TodoCreated, ... |
| 2 | actor | User | reads: TodoList → CreateTodo |

### Live Reload

Das Tool überwacht die angegebene `.if`-Datei. Bei jeder Änderung wird der Browser automatisch aktualisiert – ideal für die iterative Entwicklung von Information Flow Modellen.

---

## Technische Details

### Architektur

```
live-preview/
├── src/
│   ├── index.ts      # CLI-Einstiegspunkt
│   ├── server.ts     # HTTP-Server mit SSE
│   ├── watcher.ts    # Dateiüberwachung
│   ├── types.ts      # TypeScript-Interfaces
│   └── views/
│       ├── render.ts # HTML-Rendering
│       └── styles.ts # CSS-Styles
└── package.json
```

### Funktionsweise

1. **File Watcher**: Überwacht die `.if`-Datei mit `fs.watch`
2. **HTTP Server**: Stellt das gerenderte HTML bereit
3. **Server-Sent Events (SSE)**: Sendet Reload-Benachrichtigungen an den Browser
4. **Hot Reload**: Browser aktualisiert sich automatisch bei Änderungen

### Entwicklung

```bash
# Entwicklungsmodus mit tsx (kein Build nötig)
npm run dev -- ../examples/todo-app.if -o

# Produktions-Build
npm run build
```
