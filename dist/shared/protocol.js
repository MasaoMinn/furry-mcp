import { z } from "zod";
export const agentStates = [
    "idle",
    "thinking",
    "planning",
    "coding",
    "testing",
    "debugging",
    "success",
    "error"
];
export const AgentStateSchema = z.enum(agentStates);
export const StateEventSchema = z.object({
    type: z.literal("state"),
    state: AgentStateSchema
});
export const SetStateInputSchema = z.object({
    state: AgentStateSchema
});
//# sourceMappingURL=protocol.js.map