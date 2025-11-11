import { io } from "socket.io-client";
import { API_URL, SOCKET_OPTIONS } from "./config";

let _socket;
export function getSocket() {
  if (!_socket) {
    _socket = io(API_URL, SOCKET_OPTIONS);
  }
  return _socket;
}
