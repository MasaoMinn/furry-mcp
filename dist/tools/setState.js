import { SetStateInputSchema } from "../shared/protocol.js";
import { setRuntimeState } from "../runtime/state.js";
export function registerSetStateTool(server) {
    server.tool("set_state", "Publish the AI companion runtime state to the local event bus.", SetStateInputSchema.shape, async ({ state }) => {
        const event = setRuntimeState(state);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(event)
                }
            ]
        };
    });
}
//# sourceMappingURL=setState.js.map