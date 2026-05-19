import { z } from "zod";
export declare const agentStates: readonly ["idle", "thinking", "planning", "coding", "testing", "debugging", "success", "error"];
export type AgentState = (typeof agentStates)[number];
export declare const AgentStateSchema: z.ZodEnum<{
    idle: "idle";
    thinking: "thinking";
    planning: "planning";
    coding: "coding";
    testing: "testing";
    debugging: "debugging";
    success: "success";
    error: "error";
}>;
export declare const StateEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"state">;
    state: z.ZodEnum<{
        idle: "idle";
        thinking: "thinking";
        planning: "planning";
        coding: "coding";
        testing: "testing";
        debugging: "debugging";
        success: "success";
        error: "error";
    }>;
    message: z.ZodOptional<z.ZodString>;
    file: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type StateEvent = z.infer<typeof StateEventSchema>;
export declare const SetStateInputSchema: z.ZodObject<{
    state: z.ZodEnum<{
        idle: "idle";
        thinking: "thinking";
        planning: "planning";
        coding: "coding";
        testing: "testing";
        debugging: "debugging";
        success: "success";
        error: "error";
    }>;
    message: z.ZodOptional<z.ZodString>;
    file: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SetStateInput = z.infer<typeof SetStateInputSchema>;
