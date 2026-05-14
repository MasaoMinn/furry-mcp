import { bus } from "./bus.js";
import type { AgentState, StateEvent } from "../shared/protocol.js";

let currentState: AgentState = "idle";

export function getState(): AgentState {
  return currentState;
}

export function setRuntimeState(state: AgentState): StateEvent {
  currentState = state;

  const event: StateEvent = {
    type: "state",
    state
  };

  bus.emit("state", event);
  return event;
}
