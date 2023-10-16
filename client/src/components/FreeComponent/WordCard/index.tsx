import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

//lib
import { apiClient } from '@/lib/apiClient';

//MUI
import {
  Box,
  Typography,
  Button,
  Paper
} from "@mui/material";

//MUIIcon
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import QuizIcon from '@mui/icons-material/Quiz';

//CSS
import styles from "./index.module.scss";

//type
import { WordDBType } from '@/types/globaltype';

//utils
import { notoSansJP } from '@/utils/font';

const WordCard = ({ freeWords }: { freeWords: WordDBType[] }) => {
  //router
  const router = useRouter();

  const [dbWords, setDBWords] = useState<WordDBType[]>([...freeWords]);
  console.log(dbWords);

  //英単語と日本語訳の切替を管理
  const [ejSwitch, setEJSwitch] = useState<boolean>(true);

  //出題状態の単語のみを取得
  const questionWords: Array<WordDBType> = 
    dbWords.filter((word: WordDBType) => Number(word.free_learning) === Number(true) && word.complete === false);

  //現在の問題番号を管理
  const [problemNum, setProblemNum] = useState<number>(1);
  //覚えてない単語の数を管理
  const [incompleteCount, setIncompleteCount] = useState<number>(0);

  //「覚えた！」ボタンをクリックしたときの処理
  const handleRemember = () => {

    const dbWordsArr: Array<WordDBType> = [...dbWords];
    const questionWordsArr: Array<WordDBType> = [...questionWords];
    const prevWord: WordDBType = questionWordsArr[0 + incompleteCount];
    const newWord: WordDBType = {
      ...prevWord,
      complete: true
    };

    const dbIndex: number = dbWordsArr.indexOf(prevWord);
    dbWordsArr[dbIndex] = newWord;
    
    setProblemNum(problemNum + 1);
    setDBWords(dbWordsArr);

    if (questionWords.length > 0 && problemNum === questionWords.length + (problemNum - incompleteCount) - 1) {
      setProblemNum(1);
      setIncompleteCount(0);
    };

    if (ejSwitch === false) setEJSwitch(true);
  };

  //「もう一度」ボタンをクリックしたときの処理
  const handleRetry = () => {

    if (problemNum < questionWords.length + (problemNum - incompleteCount) - 1) {
      setProblemNum(prev => prev + 1);
      setIncompleteCount(incompleteCount + 1);
    } else if (problemNum >= questionWords.length + (problemNum - incompleteCount) - 1) {
      setProblemNum(1);
      setIncompleteCount(0);
    };

    if (ejSwitch === false) setEJSwitch(true);
  };

  //questionsWords配列が空のときは「お疲れ様でした」を表示する
  const englishDisplay = () => {
    if (questionWords.length === 0) return "お疲れ様でした";
    return (questionWords[incompleteCount].english) ? (questionWords[incompleteCount].english) : "";
  };

  //questionWords配列が空のときは空文字を表示する
  const japaneseDisplay = () => {
    if (questionWords.length === 0) return "";
    return (questionWords[incompleteCount].japanese) ? (questionWords[incompleteCount].japanese) : "";
  };

  //questionWords配列が空のときは英単語と日本語の切替をできなくさせる
  const handleEJSwitch = () => {
    if (questionWords.length === 0) {
      setEJSwitch(true);
    } else {
      setEJSwitch(!ejSwitch);
    };
  };

  const handleToTestPage = async () => {
    await apiClient.post("/word/free_complete", { dbRequest: dbWords });
    router.push("/mypage/free/test");
  };

  //テストモードに遷移した後に、フリーモードのトップ画面に戻り「暗記する」ボタンを押しても暗記カードで学習に取り組めるようにする
  useEffect(() => {
    const prevArr: Array<WordDBType> = [...dbWords];
    const newArr: Array<WordDBType> = prevArr.map((word: WordDBType) => (
      {
        ...word,
        complete: false
      }
    ));
    setDBWords(newArr);
  }, []);

  return (
    <Box className={styles.free_firstContents}>
      <Typography 
      className={`${styles.free_memoryTitle} ${notoSansJP.className}`}
      sx={{ fontSize: { xs: "18px", md: "20px" } }}
      >
        英単語を暗記する
      </Typography>
      <Paper
      className={styles.free_memoryCard}
      elevation={2}
      onClick={handleEJSwitch}
      sx={{ marginBottom: { xs: "16px", md: "32px" } }}
      >
        <Box 
        className={styles.free_memoryCardContainer}
        sx={{
          height: { xs: "200px", md: "400px" }
        }}
        >
          <Typography 
          className={`${styles.free_memoryWord} ${notoSansJP.className}`} 
          variant='h2'
          sx={{ 
            fontSize: { xs: "48px", md: "78px" },
            paddingBottom: { xs: "16px", md: "36px" }
          }}
          >
            {
              ejSwitch ? englishDisplay() : japaneseDisplay()
            }
          </Typography>
        </Box>
        {
          problemNum <= questionWords.length + (problemNum - incompleteCount) - 1 ? (
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
                { problemNum } / { questionWords.length + (problemNum - incompleteCount) - 1 }
              </Typography>
            </Box>
          ) : (<></>)
        }
      </Paper>
      <Box className={styles.free_nextButtons}>
        {
          problemNum <= questionWords.length + (problemNum - incompleteCount) - 1 ? (
            <>
              <Button 
              className={styles.free_remembered}
              onClick={handleRemember}
              >
                <SentimentVerySatisfiedIcon className={styles.free_nextButtonsIcon} />
                <Typography className={notoSansJP.className} sx={{paddingLeft: "15px"}}>
                  覚えた！
                </Typography>
              </Button>
              <Button 
              className={styles.free_notRemembered}
              onClick={handleRetry}
              >
                <SentimentVeryDissatisfiedIcon className={styles.free_nextButtonsIcon} />
                <Typography className={notoSansJP.className}>
                  もう一度
                </Typography>
              </Button>
            </>
          ) : (
            <Button
            className={styles.free_complete}
            onClick={handleToTestPage}
            >
              <QuizIcon className={styles.free_nextButtonsIcon} />
              <Typography className={notoSansJP.className}>
                確認テストを行う
              </Typography>
            </Button>
          )
        }
      </Box>
    </Box>
  );
};

export default WordCard;
