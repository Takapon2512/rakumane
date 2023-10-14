import { Router } from "express";
import { Pool } from "../server";
import { MysqlError } from "mysql";
import { isAuthenticated } from "../middleware/isAuthenticated";

//type
import { WordDBType } from "../types/globalType";

export const wordRouter = Router();

//ユーザーが登録した単語を探すAPI
wordRouter.get("/db_search", isAuthenticated, (req, res) => {
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "単語の抽出ができません。" });

        const sql = `SELECT * FROM Word WHERE user_id = ?`;
        con.query(sql, [req.body.user_id], (err: MysqlError | null, result: WordDBType[]) => {
            if (err) return res.status(500).json({ error: "単語の抽出に失敗しました。" });
            console.log(result);

            return res.status(200).json({ words: result });
        });

        con.release();
    });
});

//現在時刻を取得するAPI
wordRouter.get("/get_time", (req, res) => {
    const now = new Date();
    return res.status(200).json({ now: now });
});

//単語をDBに登録するAPI
wordRouter.post("/db_register", (req, res) => {
    const registerWords: WordDBType[] = req.body.dbRegisterWords;

    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "単語の登録ができません" });
        let insideErr: MysqlError | null = null; 

        registerWords.map((word) => {
            const sql = `INSERT INTO Word (
                english,
                japanese,
                created_at,
                complete,
                today_learning,
                free_learning,
                user_answer,
                right_or_wrong,
                correct_count,
                question_count,
                correct_rate,
                user_word_id,
                user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
            con.query(sql, [
                word.english,
                word.japanese,
                word.created_at,
                word.complete,
                word.today_learning,
                word.free_learning,
                word.user_answer,
                word.right_or_wrong,
                word.correct_count,
                word.question_count,
                word.correct_rate,
                word.user_word_id,
                word.user_id
            ], (err) => {
                if (err) insideErr = err;
                console.error(err);
            });
        });
        
        con.release();

        if (insideErr) return res.status(500).json({ error: "データの登録ができませんでした。" });
        return res.status(200).json({ message: "データ登録に成功しました。" });
    });
});