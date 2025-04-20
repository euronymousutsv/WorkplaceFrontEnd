import { io } from "socket.io-client";

// const SOCKET_URL = "https://310a-203-220-224-95.ngrok-free.app";
const SOCKET_URL = "https://workhive.space";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  forceNew: true,
});

export default socket;
