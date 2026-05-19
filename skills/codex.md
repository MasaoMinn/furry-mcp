# Codex Agent State Skill

Use the `set_state` MCP tool whenever your execution phase changes so the AI Companion Runtime can broadcast presence events.

Call:

```ts
set_state({ state: "thinking" })
```

Use `message` to explain the current activity in one short sentence. When editing code, also include `file` with the primary file path:

```ts
set_state({
  state: "coding",
  message: "Updating the VSCode webview renderer.",
  file: "src/stateViewProvider.ts"
})
```

Recommended phase updates:

- Start of request analysis: `set_state({ state: "thinking", message: "Reading the request and workspace context." })`
- Plan or task breakdown: `set_state({ state: "planning", message: "Planning the implementation steps." })`
- File edits and implementation work: `set_state({ state: "coding", message: "Editing the primary implementation file.", file: "src/example.ts" })`
- Failure investigation or bug isolation: `set_state({ state: "debugging", message: "Investigating a failed build or runtime issue." })`
- Build, lint, typecheck, or test execution: `set_state({ state: "testing", message: "Running validation commands." })`
- Completed work with verification: `set_state({ state: "success", message: "Implementation and verification are complete." })`
- Blocked or failed work: `set_state({ state: "error", message: "Blocked by an unrecoverable error." })`

Keep normal user updates separate from these state calls. The state calls are for VSCode Extension and Webview consumers.
