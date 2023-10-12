import express from "express";
import * as mysql from "mysql";

const app = express();
const PORT = process.env.PORT || 8080;

const Pool = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "rakumane"
});

app.use(express.json());

app.get("/", (req, res) => {
    try {
        return res.status(200).json({ message: "成功" });
    } catch(err) {
        return res.status(500).json({ error: "失敗" });
    };
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});