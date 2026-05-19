import { bus } from "./bus.js";
let currentEvent = {
    type: "state",
    state: "idle"
};
export function getState() {
    return currentEvent.state;
}
export function getStateEvent() {
    return currentEvent;
}
export function setRuntimeState(input) {
    const nextInput = typeof input === "string" ? { state: input } : input;
    const event = {
        type: "state",
        state: nextInput.state,
        ...optionalDetail("message", nextInput.message),
        ...optionalDetail("file", nextInput.file)
    };
    currentEvent = event;
    bus.emit("state", event);
    return event;
}
function optionalDetail(key, value) {
    const trimmed = value?.trim();
    return trimmed ? { [key]: trimmed } : {};
}
//# sourceMappingURL=state.js.map