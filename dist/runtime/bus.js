import { EventEmitter } from "node:events";
export class RuntimeBus extends EventEmitter {
    emit(eventName, ...args) {
        return super.emit(eventName, ...args);
    }
    on(eventName, listener) {
        return super.on(eventName, listener);
    }
    once(eventName, listener) {
        return super.once(eventName, listener);
    }
}
export const bus = new RuntimeBus();
//# sourceMappingURL=bus.js.map