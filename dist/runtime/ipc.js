import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import net from "node:net";
import { bus } from "./bus.js";
import { getState } from "./state.js";
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
    const clients = new Set();
    if (process.platform !== "win32" && existsSync(ipcPath)) {
        await unlink(ipcPath);
    }
    const writeEvent = (socket, event) => {
        if (!socket.destroyed) {
            socket.write(`${JSON.stringify(event)}\n`);
        }
    };
    const broadcastState = (event) => {
        for (const client of clients) {
            writeEvent(client, event);
        }
    };
    const server = net.createServer((socket) => {
        clients.add(socket);
        writeEvent(socket, {
            type: "state",
            state: getState()
        });
        socket.on("close", () => {
            clients.delete(socket);
        });
        socket.on("error", () => {
            clients.delete(socket);
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
//# sourceMappingURL=ipc.js.map