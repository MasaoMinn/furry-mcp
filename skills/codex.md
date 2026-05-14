# Codex Agent State Skill

Use the `set_state` MCP tool whenever your execution phase changes so the AI Companion Runtime can broadcast presence events.

Call:

```ts
set_state({ state: "thinking" })
```

Recommended phase updates:

- Start of request analysis: `set_state({ state: "thinking" })`
- Plan or task breakdown: `set_state({ state: "planning" })`
- File edits and implementation work: `set_state({ state: "coding" })`
- Failure investigation or bug isolation: `set_state({ state: "debugging" })`
- Build, lint, typecheck, or test execution: `set_state({ state: "testing" })`
- Completed work with verification: `set_state({ state: "success" })`
- Blocked or failed work: `set_state({ state: "error" })`

Keep normal user updates separate from these state calls. The state calls are for VSCode Extension and Webview consumers.
