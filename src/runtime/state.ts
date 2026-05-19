import { bus } from "./bus.js";
import type { AgentState, SetStateInput, StateEvent } from "../shared/protocol.js";

let currentEvent: StateEvent = {
  type: "state",
  state: "idle"
};

export function getState(): AgentState {
  return currentEvent.state;
}

export function getStateEvent(): StateEvent {
  return currentEvent;
}

export function setRuntimeState(input: SetStateInput | AgentState): StateEvent {
  const nextInput = typeof input === "string" ? { state: input } : input;

  const event: StateEvent = {
    type: "state",
    state: nextInput.state,
    ...optionalDetail("message", nextInput.message),
    ...optionalDetail("file", nextInput.file)
  };

  currentEvent = event;
  bus.emit("state", event);
  return event;
}

function optionalDetail(
  key: "message" | "file",
  value: string | undefined
): Partial<Pick<StateEvent, "message" | "file">> {
  const trimmed = value?.trim();
  return trimmed ? { [key]: trimmed } : {};
}
