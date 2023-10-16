import React, { useState } from 'react';

//MUI
import {
    Box,
    Typography,
    Button,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

//MuiIcon
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

//CSS
import styles from './index.module.scss';

//Font
import { notoSansJP } from '../../../utils/font';

//Type
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
    }
}));

const TodayList = ({ dbWords }: { dbWords: WordDBType[] }) => {
    //現在のページを管理
    const [currentPage, setCurrentPage] = useState<number>(1)
    //フィルタリング後の配列を格納
    let splitWords: Array<WordDBType> = [];
    //ページあたりのアイテム数
    const perPageItemNum = 10;
    //最終ページを求める
    const lastPage = Math.ceil(dbWords.length / perPageItemNum);

    const sliceWords = (array: Array<WordDBType>, num: number) => {
        splitWords = array.filter((word, index) => (
            index >= num * (currentPage - 1) && num * currentPage > index
        ));
    };

    const pageNext = () => {
        setCurrentPage((prev) => prev + 1)
    };

    const pagePrev = () => {
        setCurrentPage((prev) => prev - 1)
    };

    sliceWords(dbWords, perPageItemNum);

    return (
        <Box className={styles.home_thirdContents}>
            <Typography 
            className={`${styles.home_wordListTitle} ${notoSansJP.className}`}
            sx={{ fontSize: { xs: "18px", md: "20px" } }}
            >
                本日の英単語一覧
            </Typography>
            {
                dbWords.length > 0 ? (
                    <>
                    <Box className={styles.home_todayWordList}>
                        <TableContainer sx={{ borderRadius: "4px" }}>
                            <Table sx={{ minWidth: "720px" }}>
                                <TableHead sx={{border: "1px solid rgb(240, 119, 49)"}}>
                                    <TableRow>
                                        <StyledTableCell 
                                        className={notoSansJP.className} align='center'
                                        sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                        >
                                            単語番号
                                        </StyledTableCell>
                                        <StyledTableCell 
                                        className={notoSansJP.className} align='center'
                                        sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                        >
                                            英単語
                                        </StyledTableCell>
                                        <StyledTableCell 
                                        className={notoSansJP.className} align='center'
                                        sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                        >
                                            日本語訳
                                        </StyledTableCell>
                                        <StyledTableCell 
                                        className={notoSansJP.className} align='center'
                                        sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                        >
                                            前回学習日
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{border: "1px solid rgb(217, 217, 217)"}}>
                                    {
                                        splitWords.map((word, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell
                                                align='center'
                                                className={notoSansJP.className}
                                                sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                                >
                                                    {word.user_word_id}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                align='center'
                                                className={notoSansJP.className}
                                                sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                                >
                                                    {word.english}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                align='center'
                                                className={notoSansJP.className}
                                                sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                                >
                                                    {word.japanese}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                align='center'
                                                className={notoSansJP.className}
                                                sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                                >
                                                    {
                                                        word.last_time_at === null 
                                                        ? ("未学習") 
                                                        : (new Date(word.last_time_at).toLocaleDateString())
                                                    }
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Box className={styles.home_buttons}>
                        <Button
                        className={`${notoSansJP.className} ${styles.home_prev}`}
                        onClick={pagePrev}
                        disabled={
                            currentPage === 1 ? true : false
                        }
                        >
                            <NavigateBeforeIcon />
                        </Button>
                        <Button
                        className={`${notoSansJP.className} ${styles.home_next}`}
                        onClick={pageNext}
                        disabled={
                            currentPage === lastPage ? true : false
                        }
                        >
                            <NavigateNextIcon />
                        </Button>
                    </Box>
                    </>
                ) : (
                    <Typography 
                    className={`${notoSansJP.className} ${styles.home_info}`}
                    sx={{ fontSize: { xs: "14px", md: "16px" } }}
                    >
                        本日の英単語を取得できませんでした。
                        <br />
                        単語登録していない場合は、登録後の翌日0時以降に再度ログインしてください。
                    </Typography>
                )
            }
        </Box>
    )
};

export default TodayList;