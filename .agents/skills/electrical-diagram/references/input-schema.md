# Circuit JSON input

The renderer accepts one UTF-8 JSON object.

```json
{
  "schema_version": 1,
  "title": "Cell and lamp",
  "description": "A complete circuit containing one cell and one lamp.",
  "expected_state": "complete",
  "intentional_omissions": [],
  "open_terminals": [],
  "nodes": {
    "bottom_left": [0, 0],
    "top_left": [0, 4],
    "top_right": [6, 4],
    "bottom_right": [6, 0]
  },
  "components": [
    {"id": "cell1", "type": "cell", "from": "bottom_left", "to": "top_left", "label": "Cell"},
    {"id": "lamp1", "type": "lamp", "from": "top_right", "to": "bottom_right", "label": "Lamp"}
  ],
  "wires": [
    {"from": "top_left", "to": "top_right"},
    {"from": "bottom_right", "to": "bottom_left"}
  ]
}
```

## Fields

- `schema_version`: must be `1`.
- `title`: short display title.
- `description`: accessible explanation of what the diagram shows.
- `expected_state`: `complete`, `open`, or `intentionally-incomplete`.
- `intentional_omissions`: component types deliberately absent. Usually empty.
- `open_terminals`: node IDs allowed to have degree one. Required for a missing-component gap; normally empty for a complete or switch-open circuit.
- `nodes`: unique named `[x, y]` coordinates on a 0.5-unit grid.
- `components`: unique IDs, a supported `type`, `from` and `to` nodes, and optional `label`.
- `wires`: `from` and `to` nodes with optional `via`, an array of intermediate `[x, y]` bends. Every segment must be horizontal or vertical.

Coordinates describe connectivity and layout together. Use separate nodes at each component terminal. Keep at least 2 units between unrelated elements and prefer one rectangular outer path before adding parallel branches.

## Intentional omission example

To draw a lamp circuit without its battery, leave a visible gap where the battery would be:

```json
{
  "expected_state": "intentionally-incomplete",
  "intentional_omissions": ["battery"],
  "open_terminals": ["source_gap_bottom", "source_gap_top"]
}
```

The validator then requires an open path and rejects any included battery.
