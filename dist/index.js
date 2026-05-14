#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { bus } from "./runtime/bus.js";
import { startStateIpcBridge } from "./runtime/ipc.js";
import { registerSetStateTool } from "./tools/setState.js";
const server = new McpServer({
    name: "furry-companion-mcp",
    version: "0.1.0"
});
registerSetStateTool(server);
const stateIpcBridge = await startStateIpcBridge();
let shuttingDown = false;
bus.on("state", (event) => {
    console.error(`[furry-companion-mcp] state:${event.state}`);
});
async function shutdown(reason) {
    if (shuttingDown) {
        return;
    }
    shuttingDown = true;
    console.error(`[furry-companion-mcp] shutdown:${reason}`);
    await stateIpcBridge.close();
}
process.on("SIGINT", () => {
    void shutdown("SIGINT").finally(() => process.exit(0));
});
process.on("SIGTERM", () => {
    void shutdown("SIGTERM").finally(() => process.exit(0));
});
console.error(`[furry-companion-mcp] ipc:${stateIpcBridge.path}`);
const transport = new StdioServerTransport();
transport.onclose = () => {
    void shutdown("stdio");
};
await server.connect(transport);
//# sourceMappingURL=index.js.map