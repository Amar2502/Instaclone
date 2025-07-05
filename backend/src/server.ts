import app from "./app";
import config from "./config/config";

app.get("/", (req, res) => {
    res.send("Server is Running");
})

app.listen(config.PORT, () => {
    console.log(`Server is Running on Port ${config.PORT}`);
    console.log(`http://localhost:5000/`);
})

