import { Router } from "express";
import { Pool } from "../server";
import { MysqlError } from "mysql";
import { scheduleJob } from "node-schedule";

//type
import { WordDBType, SettingType } from "../types/globalType";
type UserIdType = {
  uid: string
};

export const scheduleRouter = Router();

//正答率の基準
const normalBorder = 60;
const goodBorder = 90;

//毎日23:55に学習対象の単語の「today_learning」をfalseにする。（2023/10/18動作確認済み）
scheduleJob('55 23 * * *', () => {
  Pool.getConnection((err, con) => {
    if (err) throw console.error(err);

    const idSql = `SELECT uid FROM User WHERE deleted_at IS NULL`;
    con.query(idSql, (err: MysqlError | null, userIdArr: UserIdType[]) => {
      let i = 0;
      
      while (true) {
        if (userIdArr.length - 1 < i) break;

        const wordSql = `SELECT * FROM Word WHERE user_id = ? AND today_learning = true`;
        con.query(wordSql, [userIdArr[i].uid], (err: MysqlError | null, words: WordDBType[]) => {
          if (err) throw console.error(err);

          words.map((word) => {
            const wordUpdateSql = `UPDATE Word SET 
              correct_count = ?, 
              correct_rate = ?, 
              question_count = ?, 
              today_learning = false 
              WHERE user_word_id = ?
            `;

            const values = [
              slackingJudge(word) ? 0 : word.correct_count,
              slackingJudge(word) ? 0 : word.correct_rate,
              slackingJudge(word) ? 0 : word.question_count,
              word.user_word_id
            ];

            con.query(wordUpdateSql, values, (err) => {
              if (err) throw console.error(err);
            });
          });
        });
        i++;
      };

      console.log("ループを抜ける");
      i = 0;
      console.log("処理完了");
    });

    con.release();
  });
});

//毎日00:00に学習する単語を決定し「today_learning」をtrueにする。
scheduleJob('0 0 * * *', () => {
  Pool.getConnection((err, con) => {
    if (err) throw console.error(err);
    // if (err) return res.status(500).json({ error: "本日の単語を指定できません。" })

    const idSql = `SELECT uid FROM User WHERE deleted_at IS NULL`;
    con.query(idSql, (err: MysqlError | null, userIdArr: UserIdType[]) => {
      if (err) throw console.error(err);
      // if (err) return res.status(500).json({ error: "ユーザー情報の抽出に失敗しました。" });
      let i = 0;

      while (true) {
        if (userIdArr.length - 1 < i) break;

        const settingSql = `SELECT * FROM Setting WHERE user_id = ?`;
        con.query(settingSql, [userIdArr[i].uid], (err: MysqlError | null, settingDataArr: SettingType[]) => {
          if (err) throw console.error(err);
          // if (err) return res.status(500).json({ error: "設定情報の抽出に失敗しました。" });

          const wordsSql = `SELECT * FROM Word WHERE user_id = ? AND deleted_at IS NULL`;
          con.query(wordsSql, [userIdArr[i].uid], (err: MysqlError | null, words: WordDBType[]) => {
            if (err) throw console.error(err);
            // if (err) return res.status(500).json({ error: "単語の抽出に失敗しました。" });
  
            //単語を絞る（優先度S：分類「苦手」の単語）
            const weakWords: Array<WordDBType> = words.filter((word) => (
              normalBorder > word.correct_rate
            )).sort((x, y) => x.correct_count - y.correct_count);
  
            //単語を絞る（優先度A：分類「まあまあ」の単語）
            const normalWords: Array<WordDBType> = words.filter((word) => (
              normalBorder < word.correct_rate && word.correct_rate < goodBorder
            )).sort((x, y) => x.correct_count - y.correct_count);
  
            //単語を絞る（優先度B：分類「得意」の単語）
            const goodWords: Array<WordDBType> = words.filter((word) => (
              word.correct_rate > goodBorder
            )).sort((x, y) => x.correct_count - y.correct_count);

            //絞った単語を格納し、制限数より後の単語をカット
            const filterWords: Array<WordDBType> = [
              ...weakWords,
              ...normalWords,
              ...goodWords
            ].slice(0, settingDataArr[0].work_on_count);

            //格納した単語の「today_learning」をtrueにする
            const targetSql = `UPDATE Word SET today_learning = true WHERE user_id = ? AND user_word_id = ?`;
            filterWords.map((word) => {
              con.query(targetSql, [word.user_id, word.user_word_id], (err) => {
                if (err) throw console.error(err);
                // if (err) return res.status(500).json({ error: "単語情報の変更に失敗しました。" });
              });
            });
          });
        });
        i++;
      };
      console.log("ループを抜ける");
      i = 0;
      console.log("処理完了");
    });

    con.release();
  });
});

const slackingJudge = (word: WordDBType) => {
  //現時刻を取得
  const now = new Date();

  //本日の0時を取得
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);

  //明日の0時を取得
  const tomorrowMidnight = new Date(now);
  tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
  tomorrowMidnight.setHours(0, 0, 0, 0);

  if (word.last_time_at === null || 
    !(tomorrowMidnight >= word.last_time_at && word.last_time_at >= todayMidnight)
  ) return true;

  return false;
};
