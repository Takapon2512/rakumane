import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

//lib
import { apiClient } from '@/lib/apiClient';

//context
import { useAuth } from '@/context/auth';

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


const WordTest = ({ timeConstraint, targetWords }: { timeConstraint: number, targetWords: WordDBType[] }) => {
    //router
    const router = useRouter();

    //本日分の英単語を取得・管理
    const [todayWords, setTodayWords] = useState<WordDBType[]>([...targetWords]);

    //現在の問題番号を管理
    const [problemNum, setProblemNum] = useState<number>(1);

    //テキストフィールドの監視
    const [answerText, setAnswerText] = useState<string>("");

    //正答数
    const [correctNum, setCorrectNum] = useState<number>(1);

    //残り時間の設定を受け取る
    const settingTime: number = timeConstraint;

    //残り時間を管理
    const [remainTime, setRemainTime] = useState<number>(settingTime);

    //入力を検知
    const [composing, setComposing] = useState<boolean>(false);

    //アラートの管理
    const [alert, setAlert] = useState<string>("");

    //選択肢を管理
    const [answerItems, setAnswerItems] = useState<WordDBType[]>([]);

    //ユーザー情報
    const { user } = useAuth();

    //問題番号の配列を作成
    let intNumArr: Array<number> = [...Array(todayWords.length)].map((_, i) => i);
    
    intNumArr.forEach((_, index: number) => {
        let randomNum: number = Math.floor(Math.random() * (index + 1));
        let tmpNum: number = intNumArr[index];
        intNumArr[index] = intNumArr[randomNum];
        intNumArr[randomNum] = tmpNum;
    });
    const [intNum, setIntNum] = useState<number[]>(intNumArr);

    //画面に問題文を表示する
    const englishDisplay = () => {
        if (todayWords.length === 0) return "";
        if (problemNum > todayWords.length) return "お疲れ様でした";
        return todayWords[intNum[problemNum - 1]].english;
    };

    //解答欄の内容を日本語に限定する
    const answerTextDisabled = () => {
        if (!answerText.match(/^[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠、々〜]*$/) || answerText === "") return true;
        return false;
    };

    //「解答」ボタンを押したとき
    const handleAnswer = () => {
        const curretNum: number = problemNum;
        if (todayWords[intNum[curretNum - 1]].japanese === answerText) {
            userAnswerSituation(answerText, true);
            setCorrectNum(prev => prev + 1);
        } else {
            userAnswerSituation(answerText, false);
        };

        setProblemNum(prev => prev + 1);
        setRemainTime(settingTime);
        setAnswerText("");
    };

    //「パス」ボタンを押したとき
    const handlePass = () => {
        setProblemNum(prev => prev + 1);
        userAnswerSituation("", false);
        setAnswerText("");
        setRemainTime(settingTime);
    };

    //ユーザーの解答状況を記録
    const userAnswerSituation = (answer: string, rightOrWrong: boolean) => {
        const prevArr: Array<WordDBType> = [...todayWords];
        const prevWord: WordDBType = todayWords[intNum[problemNum - 1]];

        prevArr[intNum[problemNum - 1]] = {
            ...prevWord,
            user_answer: answer,
            right_or_wrong: rightOrWrong,
            question_count: prevWord.question_count + 1,
            correct_count: rightOrWrong ? prevWord.correct_count + 1 : prevWord.correct_count
        };
        const newArr: Array<WordDBType> = prevArr;
        setTodayWords(newArr);
    };

    //解答欄でEnterキーを押したとき
    const onkeyDownEnter = (key: string) => {
        if (key === "Enter" && composing === false) handleAnswer();
    };

    //「結果を確認」ボタンを押したとき
    const confirmResult = async () => {
        try {
            const dbRequest: Array<WordDBType> = todayWords.map((word: WordDBType) => (
                {
                    ...word,
                    correct_rate: Math.round((word.correct_count / word.question_count) * 100)
                }
            ));

            await apiClient.post("/word/test_send", {
                dbRequest: dbRequest
            });

            perfectRecord();

            //結果を正常に登録できたことをアラートで知らせる
            setAlert("成功");

        } catch(err) {
            console.error(err);
            setAlert("失敗");
        };

        router.push("/mypage/memorization/result");
    };

    const perfectRecord = async () => { 
        try {
            //満点を取ったときのみ暗記ができているとし、現在時刻を記録する
            const correctWords: Array<WordDBType> = todayWords.filter((word) => Number(word.right_or_wrong) === Number(true));
            const token: string | undefined = document.cookie?.split('=')[1];
            if (correctWords.length === todayWords.length) await apiClient.post("/user/complete", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.error(err);
        };
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
      
            let word: WordDBType = todayWords[intNum[intIndex]];
            choiceArr.push(word);
        };
    
        setAnswerItems(choiceArr);
      };
    
    useEffect(() => {
    selectAnswer();
    }, [problemNum]);
    

    //選択肢をクリックしたときの処理
    const clickChoice = (word: WordDBType) => {
        console.log(word);
        
        if (todayWords[intNum[problemNum - 1]].japanese === word.japanese) {
            userAnswerSituation(word.japanese, true);
        } else {
            userAnswerSituation(word.japanese, false);
        };

        setProblemNum(prev => prev + 1);
        setRemainTime(settingTime);
        console.log(todayWords);
    };

    useEffect(() => {
        if (todayWords.length === 0) router.push("/mypage");
        setAlert("");
    }, []);

    // useEffect(() => {
    //     //次の問題に遷移し、解答状況を反映する
    //     if (remainTime < 0 && problemNum <= todayWords.length) handlePass();

    //     if (problemNum < todayWords.length + 1) {
    //       const timer = setInterval(() => {
    //         setRemainTime(prev => prev >= -1 ? prev - 1 : settingTime);
    //       }, 1000);
    //       return () => {
    //         clearInterval(timer);
    //       };
    //     };
    // }, [remainTime]);

    return (
        <>
        <AlertComponent alertFlag={alert} />
        <Box className={styles.memorize_firstContents}>
            <Typography 
            className={`${notoSansJP.className} ${styles.memorize_testTitle}`}
            sx={{ fontSize: { xs: "18px", md: "20px" } }}
            >
                確認テスト
            </Typography>
            {
                problemNum <= todayWords.length ? (
                    <Typography 
                    className={notoSansJP.className} 
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
            className={styles.memorize_questionDisplay}
            >
                <Box 
                className={styles.memorize_questionDisplayContainer}
                sx={{
                    height: { xs: "200px", md: "240px" }
                }}
                >
                    <Typography 
                    className={`${notoSansJP.className} ${styles.memorize_questionWord}`}
                    suppressHydrationWarning={true}
                    sx={{ 
                        fontSize: { xs: "48px", md: "78px" },
                        paddingBottom: { xs: "16px", md: "36px" }
                    }}
                    >
                        { englishDisplay() }
                    </Typography>
                </Box>
                {
                    problemNum <= todayWords.length ? (
                        <>
                        <Box 
                        className={styles.memorize_questionCount}
                        sx={{
                            width: { xs: "72px", md: "80px" },
                            height: { xs: "24px", md: "32px" }
                        }}
                        >
                            <Typography 
                            className={`${notoSansJP.className} ${styles.memorize_questionCountText}`}
                            sx={{ fontSize: { xs: "14px", md: "16px" } }}
                            >
                                {problemNum} / {todayWords.length}
                            </Typography>
                        </Box>
                        <Box className={styles.memorize_remainTimer}>
                            <CircularWithValueLabel currentTime={remainTime} initValue={settingTime} />
                        </Box>
                        </>
                    ) : (<></>)
                }
            </Paper>
            {
                problemNum <= todayWords.length ? (
                    <Box 
                    className={styles.memorize_answerInput}
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
                        <Box className={styles.memorize_answerButtons}>
                            <Button 
                            className={styles.memorize_answerButton}
                            disabled={answerTextDisabled()}
                            onClick={handleAnswer}
                            >
                                <LightbulbIcon className={styles.memorize_answerButtonsIcon} />
                                <Typography className={notoSansJP.className}>
                                    解答
                                </Typography>
                            </Button>
                            <Button 
                            className={styles.memorize_passButton}
                            onClick={handlePass}
                            >
                                <BackHandIcon className={styles.memorize_answerButtonsIcon} />
                                <Typography className={notoSansJP.className}>
                                    パス
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box className={styles.memorize_toResult}>
                        <Button
                        className={styles.memorize_toResultButton}
                        onClick={() => confirmResult()}
                        >
                            <TextSnippetIcon className={styles.memorize_toResultIcon} />
                            <Typography className={notoSansJP.className}>
                                結果を確認
                            </Typography>
                        </Button>
                    </Box>
                )
            }
            {
                problemNum <= todayWords.length ? (
                    <Box 
                    //スマホ・タブレット用の解答欄
                    className={styles.memorize_answers}
                    sx={{ display: { xs: "block", md: "none" } }}
                    >
                        <List>
                            {
                            answerItems.map((word: WordDBType, index: number) => (
                                <ListItem 
                                className={styles.memorize_choice}
                                key={index}
                                component={Paper}
                                onClick={() => clickChoice(word)}
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