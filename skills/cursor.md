# Cursor Agent State Skill

Use the `set_state` MCP tool to publish agent presence changes into the AI Companion Runtime.

Call:

```ts
set_state({ state: "thinking" })
```

Recommended phase updates:

- Reading or reasoning about the task: `set_state({ state: "thinking" })`
- Planning changes across files: `set_state({ state: "planning" })`
- Applying code changes: `set_state({ state: "coding" })`
- Debugging errors or failing behavior: `set_state({ state: "debugging" })`
- Running tests, type checks, or manual verification: `set_state({ state: "testing" })`
- Finishing successfully: `set_state({ state: "success" })`
- Reporting an unrecoverable failure: `set_state({ state: "error" })`

These calls drive the runtime path: AI Agent -> MCP Tool -> Event Bus -> VSCode Extension/Webview.
