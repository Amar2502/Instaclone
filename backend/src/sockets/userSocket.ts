import { Server, Socket } from "socket.io";

export const registerUserSocketHandlers = (
  io: Server,
  socket: Socket,
  onlineUsers: Map<string, string>
) => {
  socket.on("join", (userId: string) => {
    onlineUsers.set(userId, socket.id);
    (socket as any).userId = userId;
    console.log(`✅ User ${userId} joined with socket ${socket.id}`);
    console.log(onlineUsers);
    socket.emit("online-users", Array.from(onlineUsers.keys()));
  });

  // Add other events here
  // socket.on("send-message", ...)
};
