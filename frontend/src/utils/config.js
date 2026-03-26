// const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// // API base
// export const API_URL = SERVER_URL;

// // WebSocket base
// export const WS_URL = SERVER_URL.replace("http", "ws");
const SERVER_URL = (import.meta.env.VITE_SERVER_URL || "http://localhost:3000")
  .replace(/\/+$/, ""); // strip trailing slash

// HTTP base for REST and Socket.IO
export const API_URL = SERVER_URL;

// Keep WS_URL only if you use native WebSocket elsewhere (not needed for socket.io)
export const WS_URL = SERVER_URL.startsWith("https")
  ? SERVER_URL.replace("https", "wss")
  : SERVER_URL.replace("http", "ws");

// Common socket.io options (forces ws transport, avoids polling)
// export const SOCKET_OPTIONS = { transports: ["websocket"] };
