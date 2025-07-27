import { log } from "console";
import { Server, Socket } from "socket.io";

export const registerUserSocketHandlers = (
  io: Server,
  socket: Socket,
  onlineUsers: Map<number, string>
) => {
  socket.on("join", (userId: number) => {
    onlineUsers.set(userId, socket.id);
    (socket as any).userId = userId;
    console.log("online users :- ", onlineUsers);
  });

  // Add other events here
  socket.on(
    "send-message",
    (senderId: number, receiverId: number, message: string) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", senderId, message);
      }
    }
  );

  socket.on("is-typing", (receiverId: number, senderId: number) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("is-typing", senderId);
    }
  });

  socket.on("stop-typing", (receiverId: number, senderId: number) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stop-typing", senderId);
    }
  });
};
