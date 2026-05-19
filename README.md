# Furry Companion MCP

AI Companion MCP Runtime for agent presence events over stdio MCP plus local IPC for UI consumers.

Runtime path:

```text
AI Agent -> MCP Tool -> Event Bus -> local IPC -> VSCode Extension -> Webview
```

No websocket MCP transport is used.

## Tool

```ts
set_state({ state: "thinking" })
```

`message` and `file` are optional. Use `message` to describe what the agent is doing, and use `file` when the agent is actively editing a code file:

```ts
set_state({
  state: "coding",
  message: "Updating the webview state renderer.",
  file: "src/stateViewProvider.ts"
})
```

Supported states:

- `idle`
- `thinking`
- `planning`
- `coding`
- `testing`
- `debugging`
- `success`
- `error`

The tool emits:

```ts
bus.emit("state", {
  type: "state",
  state,
  message,
  file
})
```

## Install From npm

Use the package directly from npm in an MCP client:

```json
{
  "mcpServers": {
    "furry-companion": {
      "command": "npx",
      "args": ["-y", "furry-companion-mcp"]
    }
  }
}
```

Or install it globally:

```bash
npm install -g furry-companion-mcp
furry-companion-mcp
```

## VSCode Extension Bridge

The MCP server starts a local JSON Lines IPC bridge for non-MCP UI consumers. Multiple MCP processes can run at the same time: the first process owns the bridge, and later processes relay their state events into the existing bridge.

Default IPC path:

- Windows: `\\.\pipe\furry-companion-mcp`
- macOS/Linux: `/tmp/furry-companion-mcp.sock`

Override it when needed:

```bash
FURRY_COMPANION_IPC_PATH=/tmp/my-companion.sock furry-companion-mcp
```

Each IPC line is a state event:

```json
{"type":"state","state":"coding","message":"Updating the webview state renderer.","file":"src/stateViewProvider.ts"}
```

The VSCode extension should connect to this IPC path with Node `net`, parse newline-delimited JSON, then call `webview.postMessage({ command: "state-update", ... })`.

## Agent Skills

Skill documents are included in the npm package under `skills/`:

- `skills/claude.md`
- `skills/codex.md`
- `skills/cursor.md`

They are downloaded with the MCP package, but MCP clients do not automatically activate arbitrary skill files from npm packages. Copy or reference the matching file in the agent's own instruction/skill system. See `skills/INSTALL.md` for the available installation options.

## Development

```bash
npm install
npm run build
npm run start
```

## MCP CLI

After building, the package exposes:

```json
{
  "bin": {
    "furry-companion-mcp": "./dist/index.js"
  }
}
```

Use it as a stdio MCP server. No websocket transport is used.
