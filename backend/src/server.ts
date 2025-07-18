import app from "./app";
import config from "./config/config";
import { connectDB } from "./config/db";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocketIO } from "./sockets";

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});
connectDB();
setupSocketIO(io);


httpServer.listen(config.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${config.PORT}/`);
  });
