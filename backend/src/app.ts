import express from "express";
import userroutes from "./routes/userroutes";
import otproutes from "./routes/otproutes";
import cors from "cors";

const app = express()

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))

app.use("/users", userroutes);
app.use("/otp", otproutes); 

export default app;