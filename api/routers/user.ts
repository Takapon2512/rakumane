import { Router } from "express";
import { Pool } from "../server";
import { MysqlError } from "mysql";
import { isAuthenticated } from "../middleware/isAuthenticated";

//type
import { UserType, SettingType } from "../types/globalType";

export const userRouter = Router();

//トークンから得られた情報を使ってユーザー情報を取得するAPI
userRouter.get("/find", isAuthenticated, (req, res) => {
    //ユーザー情報を抽出
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "ユーザーの抽出ができません。" });

        const sql = `SELECT * FROM User WHERE uid = ?`;
        con.query(sql, [req.body.user_id], (err: MysqlError | null, result: UserType[]) => {
            if (err || result.length === 0) return res.status(401).json({
                error: "ユーザーが見つかりませんでした" 
            });

            return res.status(200).json({ 
                id: result[0].id, email: result[0].email, username: result[0].username, uid: result[0].uid 
            });
        });

        con.release();
    });
});

//制限時間を取得するAPI
userRouter.get("/find_setting", isAuthenticated, (req, res) => {
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "設定情報を抽出できません。" });

        const sql = `SELECT * FROM Setting WHERE user_id = ?`;
        con.query(sql, [req.body.user_id], (err: MysqlError | null, result: SettingType[]) => {
            if (err) return res.status(500).json({ error: "設定情報の抽出に失敗しました。" });
            return res.status(200).json({ setting: result[0]});
        });
    });
});