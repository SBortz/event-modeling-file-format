# Information Flow Live Preview

A lightweight web server that monitors `.if` (Information Flow) files and serves an auto-reloading HTML preview.

## Features

- **Live Reload**: Automatically refreshes the browser when the source file changes
- **Multiple Views**: Slice, Timeline, and Table views
- **Zero Dependencies**: Uses only Node.js built-in modules (except `open` for browser)
- **Dark Theme**: Beautiful, eye-friendly dark UI
- **Scenario Display**: Shows Given-When-Then scenarios for commands and states

## Installation

```bash
cd live-preview
npm install
npm run build
```

## Usage

```bash
# Development (no build required)
npm run dev -- ../examples/todo-app.if

# Production
npm start ../examples/todo-app.if

# With options
node dist/index.js model.if --port 8080 --open
```

### CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --port <port>` | Port to run server on | 3000 |
| `-o, --open` | Open browser automatically | false |
| `-h, --help` | Show help message | - |

## How It Works

1. **File Watcher**: Monitors the specified `.if` file for changes using `fs.watch`
2. **HTTP Server**: Serves the rendered HTML on the specified port
3. **Server-Sent Events (SSE)**: Pushes reload notifications to connected browsers
4. **Hot Reload**: Browser automatically refreshes when file changes are detected

## Architecture

```
live-preview/
├── src/
│   ├── index.ts      # CLI entry point
│   ├── server.ts     # HTTP server with SSE
│   ├── watcher.ts    # File system watcher
│   ├── types.ts      # TypeScript interfaces
│   └── views/
│       ├── render.ts # HTML rendering logic
│       └── styles.ts # CSS styles
└── package.json
```

## Development

```bash
# Run in development mode (with tsx)
npm run dev -- ../examples/todo-app.if -o

# Build for production
npm run build
```
