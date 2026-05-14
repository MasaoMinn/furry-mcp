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
] as const;

export type AgentState = (typeof agentStates)[number];

export const AgentStateSchema = z.enum(agentStates);

export const StateEventSchema = z.object({
  type: z.literal("state"),
  state: AgentStateSchema
});

export type StateEvent = z.infer<typeof StateEventSchema>;

export const SetStateInputSchema = z.object({
  state: AgentStateSchema
});

export type SetStateInput = z.infer<typeof SetStateInputSchema>;
