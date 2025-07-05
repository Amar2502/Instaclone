import app from "./app";
import config from "./config/config";
import { connectDB } from "./config/db";

connectDB();

app.get("/", (req, res) => {
    res.send("Server is Running");
})

app.listen(config.PORT, () => {
    console.log(`Server is Running on Port ${config.PORT}`);
    console.log(`http://localhost:${config.PORT}/`);
})

