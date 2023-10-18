import { Router } from "express";
import { Pool } from "../server";
import { MysqlError } from "mysql";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { isAuthenticated } from "../middleware/isAuthenticated";

//type
import { UserType, SettingType, CalendarType, ResUserType } from "../types/globalType";
interface SendDataType {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    user: ResUserType
}

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

//設定情報を取得するAPI
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

//暗記モードで学習した日を記録するAPI


//暗記モードで学習した日を取得するAPI
userRouter.get("/get_memorize_day", isAuthenticated, (req, res) => {
    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "学習日を抽出できません。" });

        const sql = `SELECT * FROM Calendar WHERE user_id = ?`;
        con.query(sql, [req.body.user_id], (err: MysqlError | null, result: CalendarType[]) => {
            if (err) return res.status(500).json({ error: "学習日の抽出に失敗しました。" });
            return res.status(200).json({ calendars: result });
        });
    });
});

//設定情報を編集するAPI
userRouter.post("/address_upload", (req, res) => {
    const { name, email, currentPassword, newPassword, confirmPassword, user }: SendDataType = req.body;

    if (name !== "") {
        Pool.getConnection((err, con) => {
            if (err) return res.status(500).json({ error: "ユーザー名を変更できません。" });

            const sql = `UPDATE Setting SET username = ? WHERE user_id = ?`;
            con.query(sql, [name, user.uid], (err) => {
                if (err) return res.status(500).json({ error: "ユーザー名の変更に失敗しました。" });
            });

            con.release();
        });
    };

    if (email !== "") {
        Pool.getConnection((err, con) => {
            if (err) return res.status(500).json({ error: "メールアドレスを変更できません。" });

            const sql = `UPDATE Setting email = ? WHERE user_id = ?`;
            con.query(sql, [email, user.uid], (err) => {
                if (err) return res.status(500).json({ error: "メールアドレスの変更に失敗しました。" })
            });

            con.release();
        });
    };

    if (currentPassword !== "" && newPassword !== "" && confirmPassword !== "") {
        Pool.getConnection((err, con) => {
            if (err) return res.status(500).json({ error: "パスワードを変更できません。" });

            const passwordSql = `SELECT password FROM User WHERE user_id = ?`;
            con.query(passwordSql, [user.uid], (err, result: string[]) => {
                if (err) return res.status(500).json({ error: "現在のパスワード情報の抽出に失敗しました。" });

                const isPassword = compareSync(currentPassword, result[0]);
                if (!isPassword) return res.status(500).json({ error: "パスワードが違います。" });
            });

            const updateSql = `UPDATE Setting SET password = ? WHERE user_id = ?`;
            const hashedPassword = hashSync(newPassword, genSaltSync(10));
            con.query(updateSql, [hashedPassword, user.uid], (err) => {
                if (err) return res.status(500).json({ error: "パスワードの変更に失敗しました。" });
            });

            con.release();
        });
    };

    return res.status(200).json({ message: "設定情報を変更しました。" });
});

//モード設定を編集するAPI
userRouter.post("/question_upload", (req, res) => {
    const { 
        num_timeLimit, 
        num_questions, 
        user 
    }: { num_timeLimit: number, num_questions: number, user: ResUserType } = req.body;

    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "モード設定の変更ができません。" });

        const sql = `UPDATE Setting SET time_constraint = ?, work_on_count = ? WHERE user_id = ?`;
        con.query(sql, [num_timeLimit, num_questions, user.uid], (err) => {
            if (err) return res.status(500).json({ error: "モード設定の変更に失敗しました。" });
        });
    });
    
    return res.status(200).json({ message: "モード設定を変更しました。" });
});

//退会の手続きを行うAPI
userRouter.post("/unsubscribe", (req, res) => {
    const userData: ResUserType = req.body.user;

    const now = new Date(Date.now());
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

    Pool.getConnection((err, con) => {
        if (err) return res.status(500).json({ error: "退会できません。" });

        const sql = `UPDATE User SET deleted_at = ? WHERE uid = ?`;
        con.query(sql, [formattedDate, userData.uid], (err) => {
            if (err) return res.status(500).json({ error: "退会手続きに失敗しました。" });
        });
    
        con.release();
    });

    return res.status(200).json({ message: "削除が完了しました。" });
});