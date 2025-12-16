// import { io } from "socket.io-client";
// import { API_URL, SOCKET_OPTIONS } from "./config";

// let _socket;
// export function getSocket() {
//   if (!_socket) {
//     _socket = io(API_URL, SOCKET_OPTIONS);
//   }
//   return _socket;
// }
import { WS_URL } from "./config";

let _ws = null;
let _connecting = false;
let _queue = [];
let _reconnectTimer = null;

function flushQueue() {
  if (!_ws || _ws.readyState !== WebSocket.OPEN) return;
  while (_queue.length) {
    _ws.send(_queue.shift());
  }
}

function scheduleReconnect() {
  if (_reconnectTimer) return;
  _reconnectTimer = setTimeout(() => {
    _reconnectTimer = null;
    getWS(); // try again
  }, 800); // small delay; you can increase to 1500–3000ms if you want
}

export function getWS() {
  // already open/connecting
  if (_ws && (_ws.readyState === WebSocket.OPEN || _ws.readyState === WebSocket.CONNECTING)) {
    return _ws;
  }

  // prevent double connects
  if (_connecting) return _ws || null;

  _connecting = true;
  _ws = new WebSocket(WS_URL);

  _ws.addEventListener("open", () => {
    _connecting = false;
    flushQueue();
  });

  _ws.addEventListener("close", () => {
    _connecting = false;
    scheduleReconnect();
  });

  _ws.addEventListener("error", () => {
    // error usually followed by close, but not always
    try { _ws.close(); } catch {}
  });

  return _ws;
}

export function sendJSON(ws, obj) {
  const payload = JSON.stringify(obj);

  // If caller passes stale ws, fall back to current singleton
  const sock = ws || getWS();

  if (sock && sock.readyState === WebSocket.OPEN) {
    sock.send(payload);
    return;
  }

  // not open yet → queue + ensure connection attempt
  _queue.push(payload);
  getWS();
}
