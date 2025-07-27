import { Server, Socket } from "socket.io";
import { registerUserSocketHandlers } from "./userSocket"
const onlineUsers = new Map<number, string>();

export const setupSocketIO = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    // Register all user-related events
    registerUserSocketHandlers(io, socket, onlineUsers);

    socket.on("disconnect", () => {
      const userId = (socket as any).userId;
      if (userId) {
        onlineUsers.delete(userId);
        console.log(`❌ Disconnected: ${userId}`);
        io.emit("online-users", Array.from(onlineUsers.keys()));
      } else {
        console.log(`❌ Socket disconnected: ${socket.id}`);
      }
    });
  });
};

