# Cursor Agent State Skill

Use the `set_state` MCP tool to publish agent presence changes into the AI Companion Runtime.

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

- Reading or reasoning about the task: `set_state({ state: "thinking", message: "Reading the request and workspace context." })`
- Planning changes across files: `set_state({ state: "planning", message: "Planning the implementation steps." })`
- Applying code changes: `set_state({ state: "coding", message: "Editing the primary implementation file.", file: "src/example.ts" })`
- Debugging errors or failing behavior: `set_state({ state: "debugging", message: "Investigating a failed build or runtime issue." })`
- Running tests, type checks, or manual verification: `set_state({ state: "testing", message: "Running validation commands." })`
- Finishing successfully: `set_state({ state: "success", message: "Implementation and verification are complete." })`
- Reporting an unrecoverable failure: `set_state({ state: "error", message: "Blocked by an unrecoverable error." })`

These calls drive the runtime path: AI Agent -> MCP Tool -> Event Bus -> VSCode Extension/Webview.
