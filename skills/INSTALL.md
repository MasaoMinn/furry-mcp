# Skill Installation Options

The skill documents are shipped with the npm package, but npm cannot automatically enable them inside Claude, Codex, or Cursor. Each agent has its own instruction and skill loading mechanism.

Recommended option:

1. Install or run the MCP package with npm or npx.
2. Copy or reference the matching file from `skills/`.
3. Register it in the agent-specific instruction location.

Options:

- Manual registration: simplest and safest. Users copy `skills/claude.md`, `skills/codex.md`, or `skills/cursor.md` into the agent's configured instruction or skill location.
- Project-level reference: keep the files in `node_modules/furry-companion-mcp/skills/` and reference them from the workspace's agent instructions.
- Separate agent plugin later: publish a dedicated Codex/Claude/Cursor skill package if the target agent provides an official skill marketplace or plugin format.

Avoid using npm `postinstall` to write into user agent config directories. It is surprising behavior and is usually blocked by security policy.
