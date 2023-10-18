import express from "express";
import { createPool } from "mysql";
import cors from "cors";
import "dotenv/config";

//router
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { wordRouter } from "./routers/word";
import { scheduleRouter } from "./routers/schedule";

const app = express();
const PORT = process.env.PORT || 8080;

export const Pool = createPool({
    host: process.env.MYSQL_HOST || "",
    user: process.env.MYSQL_USER || "",
    password: process.env.MYSQL_PASSWORD || "",
    database: "rakumane",
    port: 8889
});

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/word", wordRouter);
app.use("/api/v1/schedule", scheduleRouter);

app.get("/", (req, res) => {
    Pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: err });
        console.log("MySQLと接続中...");

        connection.release();
        return res.status(200).json({ message: "OK" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});