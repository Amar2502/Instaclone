import express from "express";
import userroutes from "./routes/userroutes";
import otproutes from "./routes/otproutes";
import cors from "cors";
import cookieParser from "cookie-parser";   
import followroutes from "./routes/followroutes";
import postsroutes from "./routes/postsroutes";
import contentroutes from "./routes/contentroutes";
import messageroutes from "./routes/messageroutes";

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))

app.use("/users", userroutes);
app.use("/otp", otproutes); 
app.use("/following", followroutes);
app.use("/posts", postsroutes);
app.use("/content", contentroutes);
app.use("/messages", messageroutes);

export default app;