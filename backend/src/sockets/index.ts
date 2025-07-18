import { Server, Socket } from "socket.io";
import { registerUserSocketHandlers } from "./userSocket"
const onlineUsers = new Map<string, string>();

export const setupSocketIO = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 New socket connected: ${socket.id}`);

    // Register all user-related events
    registerUserSocketHandlers(io, socket, onlineUsers);

    socket.on("disconnect", () => {
      const userId = (socket as any).userId;
      if (userId) {
        onlineUsers.delete(userId);
        console.log(`❌ Disconnected: ${userId}`);
      } else {
        console.log(`❌ Socket disconnected: ${socket.id}`);
      }
    });
  });
};
