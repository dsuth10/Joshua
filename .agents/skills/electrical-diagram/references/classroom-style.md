# Classroom circuit style

Use these conventions for primary-school circuit diagrams.

- Default to IEC/European component styling, black strokes on white, plain sans-serif labels and generous spacing.
- Prefer a simple rectangular path. Wires must be horizontal or vertical; the diagonal arm inside a switch symbol is the only routine diagonal.
- Use `cell` for one cell and `battery` only for two or more cells. Do not use the words interchangeably in labels.
- Use a circle with a cross for a lamp, `M` in a circle for a motor, `A` or `V` in a circle for meters, and conventional open/closed switch contacts.
- Show junction dots only where three or more conductors are electrically joined. A crossing without a junction is forbidden; reroute it instead.
- Keep component labels outside the conducting path. Omit labels when the user asks for an unlabelled recognition question.
- A working circuit needs a source, a load and a closed conducting path. An open switch breaks that path.
- Deliberately faulty diagrams must declare their expected state and loose terminals. Do not add a missing component or close a requested gap.
- Do not imply current direction, electron flow, component ratings or real-world safety unless the user explicitly requests them and provides enough context.

Supported components in version 1 are `cell`, `battery`, `lamp`, `motor`, `resistor`, `led`, `ammeter`, `voltmeter`, `switch-open` and `switch-closed`.
