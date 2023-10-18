import React, { useState, useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';

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
import styles from "./WordCard.module.scss";

//type
import { WordDBType } from '@/types/globaltype';

//utils
import { notoSansJP } from '@/utils/font';
import { apiClient } from '@/lib/apiClient';

const WordCard = ({ todayWords }: { todayWords: WordDBType[] }) => {
    //router
    const router: NextRouter = useRouter();

    //単語を管理
    const [manageWords, setManageWords] = useState<WordDBType[]>([]);
    //単語管理(暗記カードページ用)
    const [memorizeWords, setMemorizeWords] = useState<WordDBType[]>(todayWords);

    //英単語と日本語訳の切り替え
    const [ejSwitch, setEJSwitch] = useState<boolean>(true);

    //completeがfalseの単語のみを取得
    const incompleteWords: Array<WordDBType> = memorizeWords.filter(word => word.complete === false);

    //現在の問題番号を管理
    const [problemNum, setProblemNum] = useState<number>(1);
    //覚えていない単語の数を管理
    const [incompleteCount, setIncompleteCount] = useState<number>(0);

    //「覚えた！」ボタンをクリックしたとき
    const handleRemember = () => {
        //現在のmemorizeWords配列を保存
        const prevWords: Array<WordDBType> = [...memorizeWords];

        //現在のincompleteWordsをコピー
        const incompleteWordsArr: Array<WordDBType> = [...incompleteWords];

        //現在の単語の状態
        const currentWord: WordDBType = incompleteWordsArr[0 + incompleteCount];

        //対象の単語の「complete」をtrueにする
        const newWord: WordDBType = { ...currentWord, complete: true };

        //インデックス番号を検索
        const searchIndex: number = memorizeWords.indexOf(currentWord);
        
        //prevWordsにある対象の単語を更新
        prevWords[searchIndex] = newWord;
        const newWords: Array<WordDBType> = [...prevWords];

        //問題番号を更新
        setProblemNum(current => current + 1);

        //更新後の配列にする
        setMemorizeWords(newWords);

        if (incompleteWords.length > 0 && (problemNum === incompleteWords.length + (problemNum - incompleteCount) - 1)) {
            setProblemNum(1);
            setIncompleteCount(0);
        };

        if (ejSwitch === false) setEJSwitch(true);
    };

    //「もう一度」ボタンをクリックしたとき
    const handleRetry = () => {
        if (problemNum < incompleteWords.length + (problemNum - incompleteCount) - 1) {
            setProblemNum(current => current + 1);
            setIncompleteCount(current => current + 1);
        } else if (problemNum >= incompleteWords.length + (problemNum - incompleteCount) - 1) {
            setProblemNum(1);
            setIncompleteCount(0);
        };

        if (ejSwitch === false) setEJSwitch(true);
    };

    //英単語を画面に表示する関数
    const englishDisplay = () => {
        if (incompleteWords.length === 0) return "お疲れ様でした";
        return (incompleteWords[0 + incompleteCount].english) ? (incompleteWords[0 + incompleteCount].english) : "";
    };

    //日本語を画面に表示する関数
    const japaneseDisplay = () => {
        if (incompleteWords.length === 0) return "";
        return (incompleteWords[0 + incompleteCount].japanese) ? (incompleteWords[0 + incompleteCount].japanese) : "";
    };

    const handleEJSwitch = () => {
        if (incompleteWords.length === 0) {
            setEJSwitch(true);
        } else {
            setEJSwitch(!ejSwitch);
        };
    };

    const handleToTest = async () => {
        await apiClient.post("/posts/db_learning", { dbRequest: manageWords });
        router.push("/mypage/memorization/test");
    };

    //テストモードに遷移した後に、暗記モードのトップ画面に戻り「暗記する」ボタンを押しても暗記カードで学習に取り組めるようにする
    useEffect(() => {
        setManageWords(todayWords);
    }, []);

    return (
        <Box className={styles.memorize_firstContents}>
            <Typography 
            className={`${styles.memorize_memoryTitle} ${notoSansJP.className}`}
            sx={{ fontSize: { xs: "18px", md: "20px" } }}
            >
                英単語を暗記する
            </Typography>
            <Paper
            className={styles.memorize_memoryCard}
            elevation={2}
            onClick={handleEJSwitch}
            sx={{ marginBottom: { xs: "16px", md: "32px" } }}
            >
                <Box 
                className={styles.memorize_memoryCardContainer}
                sx={{
                    height: { xs: "200px", md: "400px" }
                }}
                >
                    <Typography 
                    variant='h2'
                    className={`${notoSansJP.className} ${styles.memorize_memoryWord}`}
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
                    problemNum <= incompleteWords.length + ( problemNum - incompleteCount ) - 1 ? (
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
                                { problemNum } / { incompleteWords.length + ( problemNum - incompleteCount ) - 1 }
                            </Typography>
                        </Box>
                    ) : (<></>)
                }
            </Paper>
            <Box className={styles.memorize_nextButtons}>
                {
                    problemNum <= incompleteWords.length + (problemNum - incompleteCount) - 1 ? (
                        <>
                        <Button 
                        className={styles.memorize_remembered}
                        onClick={handleRemember}
                        >
                            <SentimentVerySatisfiedIcon className={styles.memorize_nextButtonsIcon} />
                            <Typography className={notoSansJP.className} sx={{paddingLeft: "15px"}}>
                            覚えた！
                            </Typography>
                        </Button>
                        <Button 
                        className={styles.memorize_notRemembered}
                        onClick={handleRetry}
                        >
                            <SentimentVeryDissatisfiedIcon className={styles.memorize_nextButtonsIcon} />
                            <Typography className={notoSansJP.className}>
                            もう一度
                            </Typography>
                        </Button>
                        </>
                    ) : (
                        <Button
                        className={styles.memorize_complete}
                        onClick={handleToTest}
                        >
                        <QuizIcon className={styles.memorize_nextButtonsIcon} />
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