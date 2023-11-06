import { Router } from "express";
import { Pool } from "../server";
import { MysqlError } from "mysql";
import { scheduleJob } from "node-schedule";

//type
import { WordDBType, SettingType, UserType } from "../types/globalType";

export const scheduleRouter = Router();

//正答率の基準
const normalBorder = 60;
const goodBorder = 90;

//毎日23:55に学習対象の単語の「today_learning」をfalseにする（2023/11/6 動作に不備あり。修正済み）
scheduleJob('55 23 * * *', () => {
  Pool.getConnection((err, con) => {
    if (err) return console.error(err);

    const userSql = `SELECT * FROM User WHERE deleted_at IS NULL`;
    con.query(userSql, (err: MysqlError | null, users: UserType[]) => {

      if (err) return console.error(err);

      const wordSql = `SELECT * FROM Word WHERE user_id = ? AND today_learning = true AND deleted_at IS NULL`;
      for (let i = 0; i < users.length; i++) {
        con.query(wordSql, [users[i].uid], (err: MysqlError | null, words: WordDBType[]) => {
          if (err) return console.error(err);

          const wordUpdateSql = `UPDATE Word SET
            correct_count = ?,
            correct_rate = ?,
            question_count = ?,
            today_learning = false 
            WHERE user_word_id = ? AND user_id = ?
          `;

          words.map(word => {
            const values = [
              slackingJudge(word) ? 0 : word.correct_count,
              slackingJudge(word) ? 0 : word.correct_rate,
              slackingJudge(word) ? 0 : word.question_count,
              word.user_word_id,
              word.user_id
            ];

            con.query(wordUpdateSql, values, (err) => {
              if (err) return console.error(err);
              return console.log(`単語番号${word.user_word_id}: 登録解除が完了しました。`);
            });
          });
        });
      };
    });

    con.release();
  });
});

//毎日0時に学習する単語を決定する（2023/11/6 動作に不備あり。修正済み）
scheduleJob('0 0 * * *', () => {

  Pool.getConnection((err, con) => {
    if (err) return console.error(err);

    const userSql = `SELECT * FROM User WHERE deleted_at IS NULL`;
    con.query(userSql, (err: MysqlError | null, users: UserType[]) => {

      if (err) return console.error(err);
      
      //設定情報を取得
      const settingSql = `SELECT * FROM Setting WHERE user_id = ?`;
      for (let i = 0; i < users.length; i++) {
        con.query(settingSql, [users[i].uid], (err: MysqlError | null, settings: SettingType[]) => {
          if (err) return console.error(err);
          
          const wordSql = `SELECT * FROM Word WHERE user_id = ? AND deleted_at IS NULL`;
          con.query(wordSql, [users[i].uid], (err: MysqlError | null, words: WordDBType[]) => {
            if (err) return console.error(err);

            const registerSql = `UPDATE Word SET today_learning = true WHERE user_id = ? AND user_word_id = ?`;
            selectWords(words, settings[0].work_on_count).map(word => {
              con.query(registerSql, [word.user_id, word.user_word_id], (err) => {
                if (err) return console.error(err);
                return console.log(`単語番号${word.user_word_id}: 単語登録が完了しました。`);
              });
            });
          });
        });
      };

    });

    con.release();
  });
});

//単語の取捨選択
const selectWords = (targetWords: WordDBType[], work_on_count: number) => {

  //単語を絞る（優先度S：分類「苦手」の単語）
  const weakWords: Array<WordDBType> = targetWords.filter((word) => (
    normalBorder > word.correct_rate
  )).sort((x, y) => x.correct_count - y.correct_count);

  //単語を絞る（優先度A：分類「まずまず」の単語）
  const normalWords: Array<WordDBType> = targetWords.filter((word) => (
    normalBorder < word.correct_rate && word.correct_rate < goodBorder
  )).sort((x, y) => x.correct_count - y.correct_count);

  //単語を絞る（優先度B：分類「得意」の単語）
  const goodWords: Array<WordDBType> = targetWords.filter((word) => (
    word.correct_rate > goodBorder
  )).sort((x, y) => x.correct_count - y.correct_count);

  //絞った単語を格納し、制限数より後の単語をカット
  const filterWords: Array<WordDBType> = [
    ...weakWords,
    ...normalWords,
    ...goodWords
  ].slice(0, work_on_count);

  return filterWords.sort((x, y) => x.user_word_id - y.user_word_id);
};

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
