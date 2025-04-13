import { io } from "socket.io-client";

const SOCKET_URL = "https://0b38-110-175-196-31.ngrok-free.app";
// const SOCKET_URL = "http://localhost:3000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  forceNew: true,
});

export default socket;
