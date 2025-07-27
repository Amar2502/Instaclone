import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = (userId: number): Socket => {
  if (!socket) {
    socket = io("http://localhost:8080", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log(`✅ Connected to Socket.IO server: ${userId}`, socket.id);
      socket.emit("join", userId); // Join your own room
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
    });
  }

  return socket;
};

export const getSocket = (): Socket => {
  return socket;
};
