import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"], // avoid polling issues
  extraHeaders: {
    "ngrok-skip-browser-warning": "true",
  },
});
