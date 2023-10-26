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

        const sql = `SELECT * FROM Word WHERE user_id = ? AND deleted_at IS NULL`;
        con.query(sql, [req.body.user_id], (err: MysqlError | null, result: WordDBType[]) => {
            if (err) return res.status(500).json({ error: "単語の抽出に失敗しました。" });

            return res.status(200).json({ words: result });
        });

        con.release();
    });
});

//ユーザーが登録した単語を探すAPI（暗記モード）
wordRouter.get("/db_search_memorize", isAuthenticated, (req, res) => {
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "単語の抽出ができません。" });

        const sql = `SELECT * FROM Word WHERE user_id = ? AND today_learning = true`;
        con.query(sql, [req.body.user_id], (err: MysqlError | null, result: WordDBType[]) => {
            if (err) return res.status(500).json({ error: "単語の抽出に失敗しました。" });

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
        return res.status(201).json({ message: "データ登録に成功しました。" });
    });
});

//学習予定の単語を取得するAPI
wordRouter.get("/today_learning", isAuthenticated, (req, res) => {
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "本日の単語を取得できません。" });

        const sql = `SELECT * FROM Word WHERE user_id = ? AND today_learning = true`;
        con.query(sql, [req.body.user_id], (err: MysqlError | null, result: WordDBType[]) => {
            if (err) return res.status(500).json({ error: "本日の単語の取得に失敗しました。" });
            return res.status(200).json({ words: result })
        });

        con.release();
    });
});

//ユーザーが登録した単語を取得するAPI
wordRouter.get("/search", isAuthenticated, (req, res) => {
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "単語を取得できません。" });

        const sql = `SELECT * FROM Word WHERE user_id = ? AND deleted_at IS NULL`;
        con.query(sql, [req.body.user_id], (err: MysqlError | null, result: WordDBType[]) => {
            if (err) return res.status(500).json({ error: "単語の取得に失敗しました。" });
            return res.status(200).json({ words: result });
        });

        con.release();
    });
});

//free_learningの状態をリセットするAPI
wordRouter.post("/freelearning_reset", (req, res) => {
    const words: WordDBType[] = req.body.words;
    const userId = words[0].user_id;

    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "出題状態のリセットができません。" });

        const sql = `UPDATE Word SET free_learning = false WHERE user_id = ?`;
        con.query(sql, [userId], (err) => {
            if (err) return res.status(500).json({ error: "出題状態のリセットに失敗しました。" });
            return res.status(200).json({ message: "出題状態の変更が完了しました。" });
        });

        con.release();
    });
});

//出題する単語を登録するAPI
wordRouter.post("/free_register", (req, res) => {
    const free_words: WordDBType[] = req.body.freeWords;
    const free_words_true = free_words.filter(word => word.free_learning === true);
    
    Pool.getConnection((err, con) => {
        let insideErr: MysqlError | null = null; 
        if (err) return res.status(500).json({ error: "出題状態を変更できません。" });

        free_words_true.map(word => {
            const sql = `UPDATE Word SET free_learning = true WHERE user_id = ? AND user_word_id = ?`;
            con.query(sql, [word.user_id, word.user_word_id], (err) => {
                if (err) {
                    insideErr = err;
                    console.error(err);
                };
            });
        });

        con.release();

        if (insideErr) return res.status(500).json({ error: "出題状態を変更できませんでした。" });
        return res.status(200).json({ message: "出題状態を変更しました。" });
    });
});

//出題状態の単語を取得するAPI
wordRouter.get("/free_search", isAuthenticated, (req, res) => {
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "単語を取得できません。" });

        const sql = `SELECT * FROM Word WHERE user_id = ? AND free_learning = true`;
        con.query(sql, [req.body.user_id], (err, result: WordDBType[]) => {
            if (err) return res.status(500).json({ error: "単語の取得に失敗しました。" });
            return res.status(200).json({ words: result });
        });

        con.release();
    });
});

//暗記カードを終了したフラグをつけるAPI（free）
wordRouter.post("/free_complete", (req, res) => {
    const completeWords: WordDBType[] = req.body.dbRequest;

    Pool.getConnection((err, con) => {
        let insideErr: MysqlError | null = null; 
        if (err) return res.status(500).json({ error: "completeフラグをつけられません。" });

        completeWords.map(word => {
            const sql = `UPDATE Word SET complete = true WHERE user_id = ? AND user_word_id = ?`;
            con.query(sql, [word.user_id, word.user_word_id], (err) => {
                if (err) {
                    insideErr = err;
                    console.error(err);
                };
            });
        });

        con.release();

        if (insideErr) return res.status(500).json({ error: "completeフラグの変更に失敗しました。" });
        return res.status(200).json({ message: "completeフラグを変更しました。" });
    });
});

//暗記カードを終了したフラグをつけるAPI（暗記）
wordRouter.post("/memorize_complete", (req, res) => {
    const completeWords: WordDBType[] = req.body.dbRequest;

    Pool.getConnection((err, con) => {
        let insideErr: MysqlError | null = null; 
        if (err) return res.status(500).json({ error: "completeフラグをつけられません。" });

        completeWords.map(word => {
            const sql = `UPDATE Word SET complete = true WHERE user_id = ? AND user_word_id = ?`;
            con.query(sql, [word.user_id, word.user_word_id], (err) => {
                if (err) {
                    insideErr = err;
                    console.error(err);
                }
            });
        });

        con.release();

        if (insideErr) return res.status(500).json({ error: "completeフラグの変更に失敗しました。" });
        return res.status(200).json({ message: "completeフラグを変更しました。" });
    });
});

//テストする単語を取得するAPI（free）
wordRouter.get("/free_complete_test", isAuthenticated, (req, res) => {
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "単語の取得ができません。" });

        const sql = `SELECT * FROM Word WHERE complete = true AND user_id = ?`;
        con.query(sql, [req.body.user_id], (err, result: WordDBType[]) => {
            if (err) return res.status(500).json({ error: "単語の取得に失敗しました。" });
            return res.status(200).json({ words: result });
        });

        con.release();
    });
});

//テスト単語を取得するAPI（暗記）
wordRouter.get("/memorize_complete_test", isAuthenticated, (req, res) => {
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "単語の取得ができません。" });

        const sql = `SELECT * FROM Word WHERE complete = true AND user_id = ?`;
        con.query(sql, [req.body.user_id], (err, result: WordDBType[]) => {
            if (err) return res.status(500).json({ error: "単語の取得に失敗しました。" });
            return res.status(200).json({ words: result });
        });
        
        con.release();
    });
});



//テストの結果を送信するAPI
wordRouter.post("/test_send", (req, res) => {
    const targetWords: WordDBType[] = req.body.dbRequest;
    const now = new Date(Date.now());
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

    Pool.getConnection((err, con) => {
        let insideErr: MysqlError | null = null; 
        if (err) return res.status(500).json({ error: "テスト結果を送信できません。" });

        targetWords.map(word => {
            const sql = `UPDATE Word SET 
                last_time_at = ?,
                user_answer = ?,
                right_or_wrong = ?,
                correct_count = ?,
                question_count = ?,
                correct_rate = ? 
                WHERE user_id = ? AND user_word_id = ?
            `;

            const values = [
                formattedDate,
                word.user_answer,
                word.right_or_wrong,
                word.correct_count,
                word.question_count,
                word.correct_rate,
                word.user_id,
                word.user_word_id
            ];

            con.query(sql, values, (err) => {
                if (err) {
                    insideErr = err;
                    console.error(err);
                };
            });
        });

        con.release();
        if (insideErr) return res.status(500).json({ error: "テスト結果の記録が失敗しました。" });
        return res.status(200).json({ message: "テスト結果の記録が完了しました。" });
    });
});

//テスト結果を取得するAPI
wordRouter.get("/get_result", isAuthenticated, (req, res) => {
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "テスト結果を取得できません。" });

        const sql = `SELECT * FROM Word WHERE user_id = ? AND complete = true`;
        con.query(sql, [req.body.user_id], (err: MysqlError | null, result: WordDBType[]) => {
            if (err) return res.status(500).json({ error: "テスト結果の取得に失敗しました。" });
            return res.status(200).json({ results: result });
        });

        con.release();
    });
});

//complete、free_learning、user_answer、right_or_wrongを元に戻すAPI（free）
wordRouter.post("/free_reset", (req, res) => {
    const targetWords: WordDBType[] = req.body.finishQuestionWords;

    Pool.getConnection((err, con) => {
        let insideErr: MysqlError | null = null; 
        if (err) return res.status(500).json({ error: "データをリセットできません。" });

        targetWords.map((word) => {
            const sql = `UPDATE Word SET
                complete = false,
                free_learning = false,
                user_answer = "",
                right_or_wrong = false 
                WHERE user_id = ? AND user_word_id = ?
            `;

            con.query(sql, [word.user_id, word.user_word_id], (err) => {
                if (err) {
                    insideErr = err;
                    console.error(err);

                };
            });
        });
        con.release();
        if (insideErr) return res.status(500).json({ error: "データのリセットに失敗しました。" });
        return res.status(200).json({ message: "データのリセットが完了しました。" });
    });
    
});

//complete、user_answer、right_or_wrongを元に戻すAPI（暗記）
wordRouter.post("/memorize_reset", (req, res) => {
    const targetWords: WordDBType[] = req.body.finishQuestionWords;

    Pool.getConnection((err, con) => {
        let insideErr: MysqlError | null = null; 
        if (err) return res.status(500).json({ error: "データをリセットできません。" });

        targetWords.map((word) => {
            const sql = `UPDATE Word SET
                complete = false,
                user_answer = "",
                right_or_wrong = false 
                WHERE user_id = ? AND user_word_id = ?
            `;

            con.query(sql, [word.user_id, word.user_word_id], (err) => {
                if (err) {
                    insideErr = err;
                    console.error(err);

                };
            });
        });
        
        con.release();
        if (insideErr) return res.status(500).json({ error: "データのリセットに失敗しました。" });
        return res.status(200).json({ message: "データのリセットが完了しました。" });
    });
});

//テスト中に中断した際のリセット処理をするAPI
wordRouter.post("/reset", isAuthenticated, (req, res) => {

    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "処理ができません。" });

        const flagSql = `SELECT * FROM Word WHERE user_id = ? AND complete = true`;
        con.query(flagSql, [req.body.user_id], (err: MysqlError | null, words: WordDBType[]) => {
            if (err) return res.status(500).json({ error: "単語の抽出ができません。" });
            if (words.length > 0) {
                const resetSql = `UPDATE Word SET 
                    complete = false,
                    free_learning = false,
                    user_answer = "",
                    right_or_wrong = false WHERE user_id = ?
                `;

                con.query(resetSql, [req.body.user_id], (err) => {
                    if (err) return res.status(500).json({ error: "リセット処理に失敗しました。" });
                    return res.status(200).json({ message: "リセット処理が完了しました。" });
                });
            };
        });

        con.release();
    });
});

//単語を編集するAPI
wordRouter.post("/edit", (req, res) => {
    const targetWord: WordDBType = req.body.editWord;
    
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "単語を編集できません。" });

        const sql = `UPDATE Word SET 
            english = ?,
            japanese = ? 
            WHERE user_id = ? AND user_word_id = ?
        `;

        con.query(sql, [
            targetWord.english, 
            targetWord.japanese, 
            targetWord.user_id, 
            targetWord.user_word_id
        ], (err) => {
            if (err) return res.status(500).json({ error: "単語の編集に失敗しました。" });
            return res.status(200).json({ message: "単語の編集が完了しました。" });
        });
        
        con.release();
    });

});

//単語を削除するAPI
wordRouter.post("/delete", (req, res) => {
    const targetWord: WordDBType = req.body.deleteWord;
    const now = new Date(Date.now());
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "単語を削除できません。" });
        
        const sql = `UPDATE Word SET deleted_at = ? WHERE user_id = ? AND user_word_id = ?`;
        con.query(sql, [formattedDate, targetWord.user_id, targetWord.user_word_id], (err) => {
            if (err) return res.status(500).json({ error: "単語の削除に失敗しました。" });
            return res.status(200).json({ message: "単語を削除しました。" });
        });
        
        con.release();
    });

});

