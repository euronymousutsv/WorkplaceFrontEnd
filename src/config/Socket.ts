import { io } from "socket.io-client";

// const SOCKET_URL = "http://206.83.112.12:3000";
const SOCKET_URL = "http://192.168.1.104:3000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  forceNew: true,
});

export default socket;
