import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import net from "node:net";
import { bus } from "./bus.js";
import { getStateEvent } from "./state.js";
import { StateEventSchema } from "../shared/protocol.js";
const DEFAULT_IPC_NAME = "furry-companion-mcp";
export function getDefaultIpcPath() {
    if (process.platform === "win32") {
        return `\\\\.\\pipe\\${DEFAULT_IPC_NAME}`;
    }
    return path.join(tmpdir(), `${DEFAULT_IPC_NAME}.sock`);
}
export function resolveIpcPath() {
    return process.env.FURRY_COMPANION_IPC_PATH?.trim() || getDefaultIpcPath();
}
export async function startStateIpcBridge(ipcPath = resolveIpcPath()) {
    try {
        return await startStateIpcServer(ipcPath);
    }
    catch (error) {
        if (isAddressInUse(error)) {
            try {
                return await startStateIpcRelay(ipcPath);
            }
            catch (relayError) {
                if (process.platform !== "win32" && existsSync(ipcPath)) {
                    try {
                        await unlink(ipcPath);
                        return await startStateIpcServer(ipcPath);
                    }
                    catch (retryError) {
                        console.error(`[furry-companion-mcp] ipc disabled: ${getErrorMessage(retryError)}`);
                    }
                }
                else {
                    console.error(`[furry-companion-mcp] ipc disabled: ${getErrorMessage(relayError)}`);
                }
            }
        }
        else {
            console.error(`[furry-companion-mcp] ipc disabled: ${getErrorMessage(error)}`);
        }
    }
    return createDisabledBridge(ipcPath);
}
async function startStateIpcServer(ipcPath) {
    const clients = new Set();
    const buffers = new Map();
    let bridgeEvent = getStateEvent();
    const writeEvent = (socket, event) => {
        if (!socket.destroyed) {
            socket.write(`${JSON.stringify(event)}\n`);
        }
    };
    const broadcastState = (event) => {
        bridgeEvent = event;
        for (const client of clients) {
            writeEvent(client, event);
        }
    };
    const handleIncomingChunk = (socket, chunk) => {
        const nextBuffer = `${buffers.get(socket) ?? ""}${chunk.toString("utf8")}`;
        const lines = nextBuffer.split("\n");
        buffers.set(socket, lines.pop() ?? "");
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) {
                continue;
            }
            try {
                const parsed = StateEventSchema.safeParse(JSON.parse(trimmed));
                if (parsed.success) {
                    broadcastState(parsed.data);
                }
            }
            catch {
                // Ignore malformed bridge input. MCP stdio must stay healthy.
            }
        }
    };
    const server = net.createServer((socket) => {
        clients.add(socket);
        writeEvent(socket, bridgeEvent);
        socket.on("data", (chunk) => {
            handleIncomingChunk(socket, chunk);
        });
        socket.on("close", () => {
            clients.delete(socket);
            buffers.delete(socket);
        });
        socket.on("error", () => {
            clients.delete(socket);
            buffers.delete(socket);
            socket.destroy();
        });
    });
    bus.on("state", broadcastState);
    await new Promise((resolve, reject) => {
        const onError = (error) => {
            server.off("listening", onListening);
            reject(error);
        };
        const onListening = () => {
            server.off("error", onError);
            resolve();
        };
        server.once("error", onError);
        server.once("listening", onListening);
        server.listen(ipcPath);
    });
    server.on("error", (error) => {
        console.error(`[furry-companion-mcp] ipc error: ${error.message}`);
    });
    return {
        path: ipcPath,
        mode: "server",
        close: async () => {
            bus.removeListener("state", broadcastState);
            for (const client of clients) {
                client.destroy();
            }
            clients.clear();
            if (!server.listening) {
                return;
            }
            await new Promise((resolve) => {
                server.close(() => resolve());
            });
            if (process.platform !== "win32" && existsSync(ipcPath)) {
                await unlink(ipcPath);
            }
        }
    };
}
async function startStateIpcRelay(ipcPath) {
    const socket = net.createConnection(ipcPath);
    await new Promise((resolve, reject) => {
        const onError = (error) => {
            socket.off("connect", onConnect);
            reject(error);
        };
        const onConnect = () => {
            socket.off("error", onError);
            resolve();
        };
        socket.once("error", onError);
        socket.once("connect", onConnect);
    });
    const forwardState = (event) => {
        if (!socket.destroyed) {
            socket.write(`${JSON.stringify(event)}\n`);
        }
    };
    socket.on("error", (error) => {
        console.error(`[furry-companion-mcp] ipc relay error: ${error.message}`);
    });
    bus.on("state", forwardState);
    return {
        path: ipcPath,
        mode: "relay",
        close: async () => {
            bus.removeListener("state", forwardState);
            socket.destroy();
        }
    };
}
function createDisabledBridge(ipcPath) {
    return {
        path: ipcPath,
        mode: "disabled",
        close: async () => { }
    };
}
function isAddressInUse(error) {
    return (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "EADDRINUSE");
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
//# sourceMappingURL=ipc.js.map