# Website Module Contracts

## 1. Integration Rules
- Student-directed investigation belongs in the WS website module, not the teacher presentation.
- Existing site stacks (like *Open Power Quest* or Circuit Lab) must be preserved. Use their framework and state/progress conventions.
- Do not duplicate a shared website module inside a lesson folder.
- Ensure printable or low-bandwidth alternatives exist for essential website activities.
- Website modules must not expose secure assessment questions or model answers.

## 2. Concurrency and Shared Resources
Writes to shared website resources must be serialised. Independent lesson builders should write to a temporary branch or directory, and the orchestrator validates and merges the result into the shared unit resource.
