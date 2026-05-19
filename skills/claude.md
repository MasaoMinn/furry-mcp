# Claude Agent State Skill

Use the `set_state` MCP tool to keep the AI Companion Runtime synchronized with your work phase.

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

- Before analyzing the user request: `set_state({ state: "thinking", message: "Reading the request and workspace context." })`
- Before making or explaining an implementation plan: `set_state({ state: "planning", message: "Planning the implementation steps." })`
- Before editing code: `set_state({ state: "coding", message: "Editing the primary implementation file.", file: "src/example.ts" })`
- Before investigating a failure: `set_state({ state: "debugging", message: "Investigating a failed build or runtime issue." })`
- Before running validation: `set_state({ state: "testing", message: "Running validation commands." })`
- When the task is completed successfully: `set_state({ state: "success", message: "Implementation and verification are complete." })`
- When the task cannot be completed due to an error: `set_state({ state: "error", message: "Blocked by an unrecoverable error." })`

Do not use these state calls as user-visible narration. They are presence updates for the MCP Runtime.
