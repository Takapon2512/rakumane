import { Router } from "express";
import { Pool } from "../server";
import { hashSync, genSaltSync, compareSync } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { sign } from "jsonwebtoken";
import { MysqlError } from "mysql";

//type
import { UserType } from "../types/globalType";

export const authRouter = Router();

//新規ユーザーの情報を取得し、DBに保存するAPI
authRouter.post("/register", async (req, res) => {
    const { name, email, password }: { name: string, email: string, password: string } = req.body;

    //DBに同じユーザーがないかを確認
    Pool.getConnection((err, con) => {
        const sql = `SELECT email FROM User`;
        if (err) return res.status(500).json({ error: "DBとの接続に問題が発生しました。" });

        con.query(sql, (err: MysqlError | null, result: UserType[] | null) => {
            const isUser = result?.some((value) => value.email === email);
            if (isUser) return res.status(500).json({ error: "すでにユーザーが存在します。" });
            if (err) return res.status(500).json({ error: "DBに問題が発生しました。" });

        });

        con.release();
    });

    //DBに退会したユーザーが存在しないかを確認
    Pool.getConnection((err, con) => {
        const isUserSql = `SELECT email FROM User WHERE deleted_at IS NOT NULL`;
        if (err) return res.status(500).json({ error: "DBとの接続に問題が発生しました。" });

        con.query(isUserSql, (err: MysqlError | null, result: UserType[] | null) => {
            if (err) return res.status(500).json({ error: "ユーザーデータの抽出に失敗しました。" });

            if (result && result.length > 0) {
                const delete_sql = `DELETE FROM User WHERE email = ?`;
                con.query(delete_sql, [email], (err) => {
                    if (err) return res.status(500).json({ error: "ユーザーデータの消去に失敗しました。" });
                    return console.log("ユーザーの消去が完了しました。");
                    
                });
            };

            con.release();
        });
    });

    //入力されたパスワードをハッシュ化する
    const hashedPassword: string = hashSync(password, genSaltSync(10));

    //uuidを生成
    const randomUUID: string = uuidv4();

    //登録した日付を記録
    const now = new Date(Date.now());
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

    //ユーザーデータをDBに登録する
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "DBとの接続に問題が発生しました。" });
        const sql = `INSERT INTO User (email, username, password, created_at, uid) VALUES (?, ?, ?, ?, ?)`;

        con.query(sql, [email, name, hashedPassword, formattedDate, randomUUID], (err: MysqlError | null) => {
            if (err) return res.status(500).json({ error: "データベースへの挿入に失敗しました。" });
            return console.log("データが挿入されました。");
        });

        con.release();
    });

    //ユーザー登録時に初期設定を行う
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "DBとの接続に問題が発生しました。" });
        const sql = `INSERT INTO Setting (user_id) VALUES (?)`;

        con.query(sql, [randomUUID], (err: MysqlError | null) => {
            if (err) return res.status(500).json({ error: "データベースへの挿入に失敗しました。" });
            console.log("データが挿入されました。");
        });

        con.release();
    });

    //クライアントにJWTトークンを発行
    const token: string = sign({ user_id: randomUUID }, process.env.SECRET_KEY || "", { expiresIn: "4h" });

    return res.status(200).json({ token: token });
});

//ユーザーログインのAPI
authRouter.post("/login", async (req, res) => {
    const { name, email, password }: { name: string, email: string, password: string } = req.body;

    //DBにユーザーが存在するかを確認
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "DBとの接続に問題が発生しました。" });
        const sql = `SELECT * FROM User WHERE email = ?`;

        con.query(sql, [email], (err: MysqlError | null, result: UserType[]) => {
            if (err) return res.status(500).json({ error: "ユーザーの抽出ができません。" });
            if (result.length === 0) return res.status(401).json({ error: "そのユーザーは存在しません。" });
            console.log(result);

            const isPassword: boolean = compareSync(password, result[0].password);
            if (!isPassword) return res.status(401).json({ error: "パスワードが違います。" });

            const token: string = sign({ user_id: result[0].uid }, process.env.SECRET_KEY || "", { expiresIn: "4h" });

            return res.json({ token: token });
        });
        con.release();
    });
});

//疎通テスト用のAPI
authRouter.get("/connection", (req, res) => {
    try {
        console.log("通信成功！");
        return res.status(200).json({ message: "通信に成功しました！" });
    } catch (err) {
        console.log("通信失敗");
        return res.status(500).json({ error: "通信に失敗しました。" });
    };
});
