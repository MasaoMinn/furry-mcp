import type { AgentState, SetStateInput, StateEvent } from "../shared/protocol.js";
export declare function getState(): AgentState;
export declare function getStateEvent(): StateEvent;
export declare function setRuntimeState(input: SetStateInput | AgentState): StateEvent;
