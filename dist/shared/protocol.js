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
const StateDetailSchema = z.string().max(1000);
export const StateEventSchema = z.object({
    type: z.literal("state"),
    state: AgentStateSchema,
    message: StateDetailSchema.optional(),
    file: StateDetailSchema.optional()
});
export const SetStateInputSchema = z.object({
    state: AgentStateSchema,
    message: StateDetailSchema.optional(),
    file: StateDetailSchema.optional()
});
//# sourceMappingURL=protocol.js.map