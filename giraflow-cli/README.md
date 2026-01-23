# Giraflow CLI

CLI tool for visualizing and analyzing Information Flow models (`.informationflow.json`).

## Installation

```bash
npm install -g giraflow-cli
```

## Usage

```bash
giraflow-cli <file> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-v, --view <mode>` | `timeline`, `slice`, or `table` |
| `-e, --example` | Show example data |
| `-s, --schema <path>` | Validate against JSON schema |
| `-o, --output <file>` | Export to file |

### Examples

```bash
# Interactive mode
giraflow-cli model.informationflow.json

# Slice view with scenarios
giraflow-cli model.informationflow.json -v slice

# Timeline with example data
giraflow-cli model.informationflow.json -v timeline -e

# Table view for documentation
giraflow-cli model.informationflow.json -v table
```

## Views

- **timeline** - Chronological flow with symbols (●Event ◆State ▶Command ○Actor)
- **slice** - Detailed panels with JSON examples and Given-When-Then scenarios
- **table** - Tables per element type with data flow tree

## Links

- [GitHub](https://github.com/SBortz/giraflow)
- [JSON Schema](https://github.com/SBortz/giraflow/blob/main/information-flow.schema.json)
- [Examples](https://github.com/SBortz/giraflow/tree/main/examples)
