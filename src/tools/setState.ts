import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SetStateInputSchema } from "../shared/protocol.js";
import { setRuntimeState } from "../runtime/state.js";

export function registerSetStateTool(server: McpServer): void {
  server.tool(
    "set_state",
    "Publish the AI companion runtime state to the local event bus.",
    SetStateInputSchema.shape,
    async ({ state }) => {
      const event = setRuntimeState(state);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(event)
          }
        ]
      };
    }
  );
}
