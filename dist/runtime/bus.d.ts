import { EventEmitter } from "node:events";
import type { StateEvent } from "../shared/protocol.js";
export type RuntimeEvents = {
    state: [event: StateEvent];
};
export declare class RuntimeBus extends EventEmitter {
    emit<EventName extends keyof RuntimeEvents>(eventName: EventName, ...args: RuntimeEvents[EventName]): boolean;
    on<EventName extends keyof RuntimeEvents>(eventName: EventName, listener: (...args: RuntimeEvents[EventName]) => void): this;
    once<EventName extends keyof RuntimeEvents>(eventName: EventName, listener: (...args: RuntimeEvents[EventName]) => void): this;
}
export declare const bus: RuntimeBus;
