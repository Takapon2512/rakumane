import React, { useState, useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';

//lib
import { apiClient } from '@/lib/apiClient';

//MUI
import { 
    Box,
    Typography,
    TextField,
    Button,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';

//MUIIcon
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
  
//CSS
import styles from './index.module.scss';

//utils
import { notoSansJP } from '@/utils/font';

//type
import { WordDBType } from '@/types/globaltype';

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
    },
    '&:hover': {
        cursor: "pointer",
        backgroundColor: "rgb(224, 224, 224)"
    }
}));

interface weakButtonType {
    weak: boolean,
    normal: boolean,
    good: boolean
}

const SearchWords = ({ dbWords }: { dbWords: WordDBType[] }) => {
    //Router
    const router: NextRouter = useRouter();

    //テキストフィールドの監視
    const [minText, setMinText] = useState<string>("1");
    const [maxText, setMaxText] = useState<string>(`${dbWords.length}`);
    const [keyword, setKeyword] = useState<string>("");

    //単語番号をnumber型にする
    const numMin: number = Number(minText);
    const numMax: number = Number(maxText);

    //現在のページ番号を管理
    const [currentPage, setCurrentPage] = useState<number>(1);

    //苦手度ボタンの切り替えを管理
    const [isActive, setIsActive] = useState<weakButtonType>({
        weak: false,
        normal: false,
        good: false
    });

    //1ページに表示する単語数
    const perPageItemNum = 10;

    //データベースに入っている単語配列を複製
    const wordsArr: Array<WordDBType> = [...dbWords];
    const [wordDataWords, setWordDataWords] = useState<WordDBType[]>([...wordsArr]);

    //単語番号で絞る
    const numWordsArr: Array<WordDBType> = wordDataWords
        .filter((word: WordDBType) => 
        word.user_word_id >= numMin  && numMax >= word.user_word_id);

    //正答率の基準
    const normalBorder = 60;
    const goodBorder = 90;

    //単語番号で絞った後、苦手度で絞る
    const weakWordsArr: Array<WordDBType> = numWordsArr.filter((word: WordDBType, index: number) => {
        if (word.correct_rate !== null) {
            if (isActive.weak) {
                return word.correct_rate < normalBorder;
            } else if (isActive.normal) {
                return word.correct_rate >= normalBorder && goodBorder > word.correct_rate;
            } else if (isActive.good) {
                return word.correct_rate >= goodBorder;
            }
            return word.correct_rate >= 0 && 100 >= word.correct_rate;
        };
    });

    //苦手度で絞った後、キーワードで絞る
    const keyWordsArr: Array<WordDBType> = weakWordsArr
        .filter((word: WordDBType, index: number) => 
        word.english.includes(keyword));

    //最後のページ番号を求める
    const lastPage: number = Math.ceil(keyWordsArr.length / perPageItemNum); 

    //sliceArr配列のステータスに「出題しない」が1つでもあるかを判定
    const statusNotAskJudge = (wordsArr: WordDBType[]) => {
        const notAskArr: Array<WordDBType> = 
            wordsArr.filter((word: WordDBType) => word.free_learning === false);
        if (notAskArr.length > 0) return true;
        return false;
    };

    //一度に表示する単語を10個に制限する
    const sliceArr: Array<WordDBType> = keyWordsArr.filter((_, index: number) => (
        index >= perPageItemNum * (currentPage - 1) 
        && perPageItemNum * currentPage > index 
    ));

    //ステータスを切り替える
    const handleChangeStatus = (word: WordDBType) => {
        const wordsArr: Array<WordDBType> = [...wordDataWords];
        const prevWord: WordDBType = word;
        const dbWordsIndex: number = word.user_word_id - 1;

        const newWord: WordDBType = 
        word.free_learning 
        ? { ...prevWord, free_learning: false }
        : { ...prevWord, free_learning: true };

        wordsArr[dbWordsIndex] = newWord;
        setWordDataWords(wordsArr);
    };

    //「すべて出題」ボタンを押すとステータスを「出題」にし、「すべて出題しない」ボタンを押すとステータスを「出題しない」にする
    const handleAllStatusChange = () => {
        const prevQuestions: Array<WordDBType> = [...keyWordsArr];
        const newQuestions: Array<WordDBType> = prevQuestions.map((word: WordDBType) => (
            statusNotAskJudge(wordDataWords) ?
            { ...word, free_learning: true } : { ...word, free_learning: false }
    ));
        setWordDataWords(newQuestions);
    };

    //「暗記する」ボタンを押したとき
    const registerButton = async () => {
        try {
            await apiClient.post("/word/free_register", { freeWords: wordDataWords });
            router.push("/mypage/free/wordcard");
        } catch (err) {
            console.error(err);
        };
    };

    const registerButtonDisabed = () => {
        const questonArr: Array<WordDBType> = wordDataWords
            .filter((word: WordDBType) => word.free_learning === true);
        if (questonArr.length === 0) return true;
        return false;
    };
    
    const handleWeakButton = () => {
        const newObj: weakButtonType = isActive.weak 
        ? { weak: false, normal: false, good: false } : { weak: true, normal: false, good: false };
        setIsActive(newObj);
        setCurrentPage(1);
    };

    const handleNormalButton = () => {
        const newObj: weakButtonType = isActive.normal
        ? { weak: false, normal: false, good: false } : { weak: false, normal: true, good: false };
        setIsActive(newObj);
        setCurrentPage(1);
    };

    const handleGoodButton = () => {
        const newObj: weakButtonType = isActive.good
        ? { weak: false, normal: false, good: false } : { weak: false, normal: false, good: true };
        setIsActive(newObj);
        setCurrentPage(1);
    };

    const handleFreeLeaningReset = async () => {
        try {
            await apiClient.post("/word/freelearning_reset", { words: wordDataWords });
        } catch (err) {
            console.error(err);
        };
    };

    useEffect(() => {
        handleFreeLeaningReset();
    }, []);

    return (
        <>        
        <Box className={styles.free_firstContents}>
            <Typography 
            className={styles.free_searchTitle}
            sx={{ fontSize: { xs: "18px", md: "20px" } }}
            >
                単語を検索する
            </Typography>
            <Box 
            className={styles.free_searchInputs}
            sx={{ padding: { xs: "24px 16px", md: "32px 24px" } }}
            >
                <Box 
                className={styles.free_searchNumber}
                sx={{ display: { xs: "block", md: "flex" } }}
                >
                    <TextField
                    label="最初の単語番号"
                    type='number'
                    className={styles.free_searchNumMin}
                    sx={{ width: { xs: "100%", md: "calc(50% - 48px)" }, marginBottom: { xs: "16px"} }}
                    value={minText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setMinText(e.target.value); setCurrentPage(1)}}
                    />
                    <Typography 
                    className={`${styles.free_searchNumberMiddle} ${notoSansJP.className}`}
                    sx={{ display: { xs: "none", md: "block" } }}
                    >
                        ～
                    </Typography>
                    <TextField 
                    label="最後の単語番号"
                    type='number'
                    className={styles.free_searchNumMax}
                    sx={{ width: { xs: "100%", md: "calc(50% - 48px)" } }}
                    value={maxText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setMaxText(e.target.value); setCurrentPage(1)}}
                    />
                </Box>
                <Box className={styles.free_searchKeyword}>
                    <TextField 
                    label="英単語で検索"
                    fullWidth
                    value={keyword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setKeyword(e.target.value); setCurrentPage(1)}}
                    />
                </Box>
                <Box className={styles.free_correctRateButtons}>
                    <Typography 
                    className={notoSansJP.className}
                    sx={{ display: { xs: "none", md: "block" } }}
                    >
                        苦手度で検索：
                    </Typography>
                    <Box 
                    className={styles.free_correctRateButtonsContainer}
                    sx={{ paddingLeft: { md: "32px" } }}
                    >
                        <Button 
                        className={`${notoSansJP.className} ${styles.free_weakButton}`}
                        sx={
                            isActive.weak ? ({
                                backgroundColor: "rgb(241, 39, 39)",
                                color: "#fff !important",
                                border: "1px solid transparent !important",
                            }) : ({})
                        }
                        onClick={handleWeakButton}
                        >
                            苦手
                        </Button>
                        <Button 
                        className={`${notoSansJP.className} ${styles.free_normalButton}`}
                        sx={
                            isActive.normal ? ({
                                backgroundColor: "rgb(240, 119, 49)",
                                color: "#fff !important",
                                border: "1px solid transparent !important",
                            }) : ({})
                        }
                        onClick={handleNormalButton}
                        >
                            まずまず
                        </Button>
                        <Button 
                        className={`${notoSansJP.className} ${styles.free_goodButton}`}
                        sx={
                            isActive.good ? ({
                                backgroundColor: "rgb(60, 123, 239)",
                                color: "#fff !important",
                                border: "1px solid transparent !important",
                            }) : ({})
                        }
                        onClick={handleGoodButton}
                        >
                            得意
                        </Button>
                    </Box>
                </Box>
                {
                    sliceArr.length !== 0 ? (                        
                        <Box className={styles.free_searchList}>
                            <TableContainer sx={{ borderRadius: "4px" }}>
                                <Table sx={{ minWidth: "720px" }}>
                                    <TableHead sx={{border: "1px solid rgb(217, 217, 217)"}}>
                                        <TableRow>
                                            <StyledTableCell 
                                            className={notoSansJP.className} 
                                            align='center'
                                            sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                            >
                                                単語番号
                                            </StyledTableCell>
                                            <StyledTableCell 
                                            className={notoSansJP.className} 
                                            align='center'
                                            sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                            >
                                                英単語
                                            </StyledTableCell>
                                            <StyledTableCell 
                                            className={notoSansJP.className} 
                                            align='center'
                                            sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                            >
                                                日本語訳
                                            </StyledTableCell>
                                            <StyledTableCell 
                                            className={notoSansJP.className} 
                                            align='center'
                                            sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                            >
                                                正答率
                                            </StyledTableCell>
                                            <StyledTableCell 
                                            className={notoSansJP.className} 
                                            align='center'
                                            sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                            >
                                                ステータス
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody sx={{border: "1px solid rgb(217, 217, 217)"}}>
                                        {
                                            sliceArr.map((word: WordDBType, index: number) => (
                                                <StyledTableRow 
                                                key={index}
                                                onClick={() => handleChangeStatus(word)}
                                                >
                                                    <StyledTableCell
                                                    className={notoSansJP.className}
                                                    align='center'
                                                    >
                                                        {word.user_word_id}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                    className={notoSansJP.className}
                                                    align='center'
                                                    >
                                                        {word.english}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                    className={notoSansJP.className}
                                                    align='center'
                                                    >
                                                        {word.japanese}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                    className={notoSansJP.className}
                                                    align='center'
                                                    >
                                                        {`${word.correct_rate} %`}
                                                    </StyledTableCell>
                                                    <StyledTableCell
                                                    className={notoSansJP.className}
                                                    align='center'
                                                    >
                                                        {word.free_learning ? "出題" : "出題しない"}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box className={styles.free_pageButtons}>
                                <Button 
                                className={styles.free_before}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                disabled={ currentPage === 1 ? true : false }
                                >
                                    <NavigateBeforeIcon />
                                </Button>
                                <Button 
                                className={styles.free_next}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={ currentPage === lastPage ? true : false }
                                >
                                    <NavigateNextIcon />
                                </Button>
                            </Box>
                            <Box className={styles.free_registerButtons}>
                                <Button
                                className={`${notoSansJP.className} ${styles.free_register}`}
                                onClick={registerButton}
                                disabled={registerButtonDisabed()}
                                sx={{ width: { xs: "136px", md: "160px" } }}
                                >
                                    暗記する
                                </Button>
                                {
                                    statusNotAskJudge(sliceArr) ? (
                                        <Button
                                        className={`${notoSansJP.className} ${styles.free_all}`}
                                        sx={{ width: { xs: "136px", md: "160px" } }}
                                        onClick={handleAllStatusChange}
                                        >
                                            すべて出題
                                        </Button>
                                    ) : (
                                        <Button
                                        className={`${notoSansJP.className} ${styles.free_all}`}
                                        sx={{ width: { xs: "136px", md: "160px" } }}
                                        onClick={handleAllStatusChange}
                                        >
                                            すべて出題しない
                                        </Button>
                                    )
                                }
                            </Box>
                        </Box>
                    ) : (
                        <Typography align='center' className={notoSansJP.className}>
                            一致する単語が見つかりませんでした。
                        </Typography>
                    )
                }
            </Box>

        </Box>
        </>
    );
};

export default SearchWords;