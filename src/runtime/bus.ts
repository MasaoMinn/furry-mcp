import { EventEmitter } from "node:events";
import type { StateEvent } from "../shared/protocol.js";

export type RuntimeEvents = {
  state: [event: StateEvent];
};

export class RuntimeBus extends EventEmitter {
  emit<EventName extends keyof RuntimeEvents>(
    eventName: EventName,
    ...args: RuntimeEvents[EventName]
  ): boolean {
    return super.emit(eventName, ...args);
  }

  on<EventName extends keyof RuntimeEvents>(
    eventName: EventName,
    listener: (...args: RuntimeEvents[EventName]) => void
  ): this {
    return super.on(eventName, listener);
  }

  once<EventName extends keyof RuntimeEvents>(
    eventName: EventName,
    listener: (...args: RuntimeEvents[EventName]) => void
  ): this {
    return super.once(eventName, listener);
  }
}

export const bus = new RuntimeBus();
