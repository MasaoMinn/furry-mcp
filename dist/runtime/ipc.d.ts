export interface StateIpcBridge {
    path: string;
    mode: "server" | "relay" | "disabled";
    close: () => Promise<void>;
}
export declare function getDefaultIpcPath(): string;
export declare function resolveIpcPath(): string;
export declare function startStateIpcBridge(ipcPath?: string): Promise<StateIpcBridge>;
