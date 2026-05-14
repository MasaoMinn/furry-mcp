import type { AgentState, StateEvent } from "../shared/protocol.js";
export declare function getState(): AgentState;
export declare function setRuntimeState(state: AgentState): StateEvent;
