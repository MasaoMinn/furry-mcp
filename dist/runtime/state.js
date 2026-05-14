import { bus } from "./bus.js";
let currentState = "idle";
export function getState() {
    return currentState;
}
export function setRuntimeState(state) {
    currentState = state;
    const event = {
        type: "state",
        state
    };
    bus.emit("state", event);
    return event;
}
//# sourceMappingURL=state.js.map