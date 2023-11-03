import React, { useEffect, useState } from 'react';
import { useRouter, NextRouter } from 'next/router';

//lib
import { apiClient } from '@/lib/apiClient';

//MUI
import{
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    List,
    ListItem
} from "@mui/material";

//MUIIcon
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BackHandIcon from '@mui/icons-material/BackHand';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

//CSS
import styles from "./index.module.scss";

//type
import { WordDBType } from '@/types/globaltype';

//utils
import { notoSansJP } from '@/utils/font';

//Components
import CircularWithValueLabel from '@/components/CircularProgressWithLabel/CircularProgressWithLabel';
import AlertComponent from '../alert/alert';

const WordTest = ({ timeConstraint, freeWords }: { timeConstraint: number, freeWords: WordDBType[] }) => {
  console.log(freeWords);
  //router
  const router: NextRouter = useRouter();
  //暗記カードで出題した英単語を取得
  const [dbWords, setDBWords] = useState<WordDBType[]>([...freeWords]);
  //現在の問題番号を管理
  const [problemNum, setProblemNum] = useState<number>(1);
  //テキストフィールドの監視
  const [answerText, setAnswerText] = useState<string>("");
  //残り時間の設定を取得する
  const settingTime: number = timeConstraint;
  //残り時間を管理
  const [remainTime, setRemainTime] = useState<number>(settingTime);

  //入力を検知
  const [composing, setComposing] = useState<boolean>(false);

  //アラートの管理
  const [alert, setAlert] = useState<string>("");

  //選択肢を管理
  const [answerItems, setAnswerItems] = useState<WordDBType[]>([]);

  //出題状態の単語のみを取得
  const questionWords: Array<WordDBType> = 
  dbWords.filter((word: WordDBType) => Number(word.complete) === Number(true));

  //問題番号の配列を作成
  let intNumArr: Array<number> = [...Array(questionWords.length)].map((_, i: number) => i);

  //問題番号をシャッフルする
  intNumArr.forEach((_, index: number) => {
    let randomNum: number = Math.floor(Math.random() * (index + 1));
    let tmpNum: number = intNumArr[index];
    intNumArr[index] = intNumArr[randomNum];
    intNumArr[randomNum] = tmpNum;
  });

  const [intNum, setIntNum] = useState<number[]>(intNumArr);

  //解答欄の内容を日本語に限定する
  const answerTextDisabled = () => {
    if (!answerText.match(/^[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠、々〜]*$/) || answerText === "") return true;
    return false;
  };

  //解答ボタンを押したとき
  const handleAnswer = () => {
    const currentNum: number = problemNum;
    if (questionWords[intNum[problemNum - 1]].japanese === answerText) {
      userAnswerSituation(answerText, true);
    } else {
      userAnswerSituation(answerText, false);
    }

    setProblemNum(currentNum + 1);
    setRemainTime(settingTime);
    setAnswerText("");
  };

  //パスボタンを押したとき
  const handlePass = () => {
    const currentNum: number = problemNum;

    setProblemNum(currentNum + 1);
    userAnswerSituation("", false);
    setAnswerText("");
    setRemainTime(settingTime);
  };

  //問題の表示
  const englishDisplay = () => {
    if (problemNum > questionWords.length) return "お疲れ様でした";
    return questionWords[intNum[problemNum - 1]].english;
  };

  //ユーザーの解答状況を記録
  const userAnswerSituation = (answer: string, rightOrWrong: boolean) => {
    const prevArr: Array<WordDBType> = [...dbWords];
    const prevWord: WordDBType = questionWords[intNum[problemNum - 1]];

    const dbIndex: number = prevArr.indexOf(prevWord);

    prevArr[dbIndex] = {
      ...prevWord,
      user_answer: answer,
      right_or_wrong: rightOrWrong,
      question_count: prevWord.question_count + 1,
      correct_count: rightOrWrong ? prevWord.correct_count + 1 : prevWord.correct_count
    };
    const newArr: Array<WordDBType> = [...prevArr];
    setDBWords(newArr);
    console.log(dbWords);
  };

  //解答欄でEnterキーを押したとき
  const onkeyDownEnter = (key: string) => {
    if (key === "Enter" && composing === false) handleAnswer();
  };

  //結果を確認ボタンを押したとき
  const confirmResult = async () => {

    try {

      const dbRequest: Array<WordDBType> = questionWords.map((word: WordDBType) => (
        {
          ...word,
          correct_rate: Math.round((word.correct_count / word.question_count) * 100),
        }
      ));

      await apiClient.post("/word/test_send", {
        dbRequest: dbRequest
      });

      //結果を正常に登録できたことをアラートで知らせる
      setAlert("成功");

    } catch (err) {
      setAlert("失敗");
      console.error(err);
    };

    router.push("/mypage/free/result");
  };

  const selectAnswer = () => {
    let choiceArr: Array<WordDBType> = [];
      
    //0~3の数字配列を作成し、シャッフル
    let randomArr: Array<number> = [...Array(4)].map((_, i) => i);
    randomArr.forEach((_, index: number) => {
        const randomNum: number = Math.floor(Math.random() * (index + 1));
        [randomArr[index], randomArr[randomNum]] = [randomArr[randomNum], randomArr[index]];
    });
    
    for (let i = 0; i < randomArr.length; i++) {
        let intIndex: number = (problemNum - 1) + randomArr[i];
        if (intNum.length <= intIndex) {
          intIndex -= intNum.length;
        };
  
        let word: WordDBType = questionWords[intNum[intIndex]];
        choiceArr.push(word);
    };

    setAnswerItems(choiceArr);
  };

  useEffect(() => {
    selectAnswer();
  }, [problemNum]);


  //選択肢をクリックしたときの処理
  const clickChoice = (word: WordDBType) => {
    if (questionWords[intNum[problemNum - 1]].japanese === word.japanese) {
      console.log("正解");
      userAnswerSituation(word.japanese, true);
    } else {
      console.log("不正解");
      userAnswerSituation(word.japanese, false);
    };

    setProblemNum(prev => prev + 1);
    setRemainTime(settingTime);
  };

  useEffect(() => {
    //次の問題に遷移する
    if (remainTime < 0 && problemNum <= questionWords.length) handlePass();

    if (problemNum < questionWords.length + 1) {
      const timer = setInterval(() => {
        setRemainTime(prev => prev > -1 ? prev - 1 : settingTime);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    };
  }, [remainTime]);

  return (
    <>
    <AlertComponent alertFlag={alert} />
    <Box className={styles.free_firstContents}>
        <Typography 
        className={`${styles.free_testTitle} ${notoSansJP.className}`} 
        sx={{ fontSize: { xs: "18px", md: "20px" } }}
        >
            確認テスト
        </Typography>
        {
          problemNum <= questionWords.length ? (
            <Typography className={notoSansJP.className} 
            sx={{
              marginBottom: 1,
              fontSize: { xs: "14px", md: "16px" }
            }}
            >
              次の英単語の日本語訳を答えよ。
            </Typography>
          ) : (<></>)
        }
        <Paper
        className={styles.free_questionDisplay}
        elevation={2}
        >
          <Box 
          className={styles.free_questionDisplayContainer}
          sx={{
            height: { xs: "200px", md: "400px" }
          }}
          >
            <Typography 
            className={`${notoSansJP.className} ${styles.free_questionWord}`}
            sx={{ 
              fontSize: { xs: "48px", md: "78px" },
              paddingBottom: { xs: "16px", md: "36px" }
            }}
            suppressHydrationWarning={true}
            >
              { englishDisplay() }
            </Typography>
          </Box>
          {
            problemNum <= questionWords.length ? (
              <Box 
              className={styles.free_questionCount}
              sx={{
                width: { xs: "72px", md: "80px" },
                height: { xs: "24px", md: "32px" }
              }}
              >
                <Typography 
                className={`${notoSansJP.className} ${styles.free_questionCountText}`}
                sx={{ fontSize: { xs: "14px", md: "16px" } }}
                >
                  { problemNum } / { questionWords.length }
                </Typography>
              </Box>
            ) : (<></>)
          }
          {
            problemNum <= questionWords.length ? (
              <Box className={styles.free_remainTimer}>
                <CircularWithValueLabel currentTime={remainTime} initValue={settingTime} />
              </Box>
            ) : ( <></> )
          }
        </Paper>
        {
          problemNum <= questionWords.length ? (
            <Box 
            className={styles.free_answerInput}
            sx={{ display: { xs: "none", md: "block" } }}
            >
              <TextField
              label="解答欄（入力後、Enterキーを押下しても解答できます）"
              fullWidth
              value={answerText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswerText(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => onkeyDownEnter(e.key)}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={() => setComposing(false)}
              />
              <Box className={styles.free_answerButtons}>
                <Button
                className={`${styles.free_answerButton} ${notoSansJP.className}`}
                disabled={answerTextDisabled()}
                onClick={handleAnswer}
                >
                  <LightbulbIcon className={styles.free_answerButtonsIcon} />
                  <Typography className={notoSansJP.className}>
                    解答
                  </Typography>
                </Button>
                <Button
                className={`${styles.free_passButton} ${notoSansJP.className}`}
                onClick={handlePass}
                >
                  <BackHandIcon className={styles.free_answerButtonsIcon} />
                  <Typography className={notoSansJP.className}>
                    パス
                  </Typography>
                </Button>
              </Box>
            </Box>
          ) : (
            <Box className={styles.free_toResult}>
              <Button
              className={styles.free_toResultButton}
              onClick={confirmResult}
              >
                <TextSnippetIcon className={styles.free_toResultIcon} />
                <Typography className={notoSansJP.className}>
                  結果を確認
                </Typography>
              </Button>
            </Box>
          )
        }
        {
          problemNum <= questionWords.length ? (
              <Box 
              //スマホ・タブレット用の解答欄
              className={styles.free_answers}
              sx={{ display: { xs: "block", md: "none" } }}
              >
                  <List>
                      {
                      answerItems.map((word: WordDBType, index: number) => (
                          <ListItem 
                          className={styles.free_choice}
                          key={index}
                          component={Paper}
                          onClick={() => clickChoice(word)}
                          suppressHydrationWarning={true}
                          >
                              { word ? word.japanese : "" }
                          </ListItem>
                      ))                        
                      }
                  </List>
              </Box>
          ) : (<></>)
    }
    </Box>
    </>
  );
};

export default WordTest;