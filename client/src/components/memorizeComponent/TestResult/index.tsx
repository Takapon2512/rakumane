import React, { useEffect, useState } from 'react';

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
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

//MUIIcon
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import HomeIcon from '@mui/icons-material/Home';

//CSS
import styles from "./index.module.scss";

//Types
import { WordDBType } from '@/types/globaltype';

//utils
import { notoSansJP } from '@/utils/font';

//Components
import CircularResultLabel from '@/components/CircularProgressWithLabel/CircularResultLabel';
import { useRouter } from 'next/router';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'rgb(240, 119, 49)',
        color: theme.palette.common.white,
        paddingTop: 12,
        paddingBottom: 12
    },
    [`&.${tableCellClasses.body}`]: {
        paddingTop: 12,
        paddingBottom: 12
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    }
}));

const TestResult = ({ todayWords }: { todayWords: WordDBType[] }) => {
    //router
    const router = useRouter();

    //問題の数を求める
    const questionWords: Array<WordDBType> = todayWords.filter((word: WordDBType) => Number(word.today_learning) === Number(true));
    const questionWordsNum: number = questionWords.length;

    //正解した単語のみを取り出す
    const correctWords: Array<WordDBType> = todayWords.filter((word) => Number(word.right_or_wrong) === Number(true));
    const correctWordsNum: number = correctWords.length;

    //現在のページを管理
    const [currentPage, setCurrentPage] = useState<number>(1);

    //ユーザー情報
    const { user } = useAuth();

    //1ページに表示する単語数
    const perPageItemNum = 10;

    //最終ページの番号を求める
    const lastPage: number = Math.ceil(questionWordsNum / perPageItemNum);

    //1ページに表示する単語数を10個に制限する
    const sliceArr: Array<WordDBType> = todayWords.filter((word, index) => (
        index >= perPageItemNum * (currentPage - 1)
        && perPageItemNum * currentPage > index
    ));
    console.log(sliceArr);

    //結果を確認した後のボタン
    const handleNextAction = async () => {
        const prevWords: Array<WordDBType> = [...questionWords];
        const finishQuestionWords: Array<WordDBType> = prevWords.map(word => (
            {
                ...word,
                complete: false,
                user_answer: "",
                right_or_wrong: false
            }
        ));

        await apiClient.post("/word/memorize_reset", {
            finishQuestionWords: finishQuestionWords
        });

        // perfectRecord();
        router.push("/mypage");
    };

    const perfectRecord = async () => {
        //満点を取ったときのみ暗記ができているとし、現在時刻を記録する
        const correctWords: Array<WordDBType> = todayWords.filter((word) => Number(word.right_or_wrong) === Number(true));
        console.log(correctWords);
        if (correctWords.length === todayWords.length) await apiClient.post("/user/complete", { userData: user });
    };

    return (
        <Box className={styles.memorize_firstContents}>
            <Typography 
            className={`${notoSansJP.className} ${styles.memorize_resultTitle}`}
            sx={{ fontSize: { xs: "18px", md: "20px" } }}
            >
                確認テストの結果
            </Typography>
            <Box 
            className={styles.memorize_resultDisplay}
            sx={{ 
                padding: { xs: "24px 16px", md: "24px 32px" }
            }}
            >
                <Typography 
                className={`${notoSansJP.className} ${styles.memorize_correctRateTitle}`}
                sx={{ fontSize: { xs: "24px", md: "40px" } }}
                >
                    あなたの正答率は...
                </Typography>
                <Box className={styles.memorize_resultDisplayContainer}>
                    <CircularResultLabel correct={correctWordsNum} questionNum={questionWordsNum} />
                </Box>
                <Box className={styles.memorize_resultDetail}>
                    <TableContainer sx={{ borderRadius: "4px" }}>
                        <Table sx={{ minWidth: "720px" }}>
                            <TableHead sx={{border: "1px solid rgb(240, 119, 49)"}}>
                                <TableRow>
                                    <StyledTableCell 
                                    align='center'
                                    sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                    >
                                        単語番号
                                    </StyledTableCell>
                                    <StyledTableCell 
                                    align='center'
                                    sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                    >
                                        英単語
                                    </StyledTableCell>
                                    <StyledTableCell 
                                    align='center'
                                    sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                    >
                                        日本語訳
                                    </StyledTableCell>
                                    <StyledTableCell 
                                    align='center'
                                    sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                    >
                                        あなたの解答
                                    </StyledTableCell>
                                    <StyledTableCell 
                                    align='center'
                                    sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                    >
                                        正誤
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{border: "1px solid rgb(217, 217, 217)"}}>
                                {
                                    sliceArr.map((word, index) => (
                                        <StyledTableRow
                                        key={index}
                                        >
                                            <StyledTableCell
                                            className={notoSansJP.className}
                                            align='center'
                                            sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                            >
                                                {word.id}
                                            </StyledTableCell>
                                            <StyledTableCell
                                            className={notoSansJP.className}
                                            align='center'
                                            sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                            >
                                                {word.english}
                                            </StyledTableCell>
                                            <StyledTableCell
                                            className={notoSansJP.className}
                                            align='center'
                                            sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                            >
                                                {word.japanese}
                                            </StyledTableCell>
                                            <StyledTableCell
                                            className={notoSansJP.className}
                                            align='center'
                                            sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                            >
                                                {word.user_answer}
                                            </StyledTableCell>
                                            <StyledTableCell
                                            className={notoSansJP.className}
                                            align='center'
                                            sx={
                                                word.right_or_wrong ? 
                                                { 
                                                    color: "rgb(48, 48, 48)",
                                                    fontSize: { xs: "14px", md: "16px" }
                                                } : 
                                                { 
                                                    color: "rgb(236, 75, 18)",
                                                    fontSize: { xs: "14px", md: "16px" }
                                                }
                                            }
                                            >
                                                {word.right_or_wrong ? "正解" : "誤答"}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box className={styles.memorize_pageButtons}>
                    <Button 
                    className={styles.memorize_before}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={ currentPage === 1 ? true : false }
                    >
                        <NavigateBeforeIcon />
                    </Button>
                    <Button 
                    className={styles.memorize_next}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={ currentPage === lastPage ? true : false }
                    >
                        <NavigateNextIcon />
                    </Button>
                </Box>
            </Box>
            <Box className={styles.memorize_resultButtonWrapper}>
                <Button 
                className={styles.memorize_resultButton}
                onClick={handleNextAction}
                >
                <HomeIcon className={styles.memorize_resultButtonIcon} />
                    <Typography className={notoSansJP.className}>
                        ホームに戻る
                    </Typography>
                </Button>
            </Box>
        </Box>
    );
};

export default TestResult;
