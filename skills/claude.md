# Claude Agent State Skill

Use the `set_state` MCP tool to keep the AI Companion Runtime synchronized with your work phase.

Call:

```ts
set_state({ state: "thinking" })
```

Recommended phase updates:

- Before analyzing the user request: `set_state({ state: "thinking" })`
- Before making or explaining an implementation plan: `set_state({ state: "planning" })`
- Before editing code: `set_state({ state: "coding" })`
- Before investigating a failure: `set_state({ state: "debugging" })`
- Before running validation: `set_state({ state: "testing" })`
- When the task is completed successfully: `set_state({ state: "success" })`
- When the task cannot be completed due to an error: `set_state({ state: "error" })`

Do not use these state calls as user-visible narration. They are presence updates for the MCP Runtime.
