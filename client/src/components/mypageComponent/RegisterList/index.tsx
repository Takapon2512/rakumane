import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

//lib
import { apiClient } from '@/lib/apiClient';

//Recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import { remainNumState, wordsState } from '@/store/mypageState';

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
    TextField
} from '@mui/material';

//Font
import { notoSansJP } from '../../../utils/font';

//CSS
import styles from './index.module.scss';
import { WordDBType, WordDataType } from '@/types/globaltype';

//context
import { useAuth } from '@/context/auth';
import AlertComponent from '../alert/alert';

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
    },
    [`&.${tableCellClasses.body}:not(:first-of-type):hover`]: {
        cursor: 'pointer',
        backgroundColor: 'rgb(231, 231, 231)',
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const RegisterList = ({ dbWords }: { dbWords: WordDBType[] }) => {
    const [registerWords, setRegisterWords] = 
    useRecoilState<WordDataType[]>(wordsState);
    const setRemainNum = useSetRecoilState<number>(remainNumState);
    
    //編集モードの制御（編集モードにできるのは1つの単語のみにする）
    const [editing, setEditing] = useState<boolean>(false);
    
    const [editWord, setEditWord] = useState<WordDataType>({
        id: 0,
        english: '',
        japanese: '',
        created_at: "",
        editing: false,
        free_learning: false,
        today_learning: false,
        complete: false,
        user_answer: "",
        right_or_wrong: false,
        correct_count: 0,
        question_count: 0,
        correct_rate: 0,
        deleted_at: null, 
        last_time_at: null, 
        user_word_id: 0, 
        user_id: ""
    });
    const [editWordIndex, setEditWordIndex] = useState<number>(0);
    
    //登録可能数を求める
    const registerWordsMax = 10;
    const remain = registerWordsMax - registerWords.length;
    
    //編集テキストの制御
    const [editEngText, setEditEngText] = useState<string>('');
    const [editJapText, setEditJapText] = useState<string>('');

    //登録した単語を格納
    const [registered, setRegistered] = useState<WordDBType[]>([]);

    //ユーザー情報を取得
    const { user } = useAuth();

    //router
    const router = useRouter();

    //登録リストを削除
    const RegisterListDelete = () => setRegisterWords([]);

    //アラート発報管理
    const [alertFlag, setAlertFlag] = useState<string>("");
    console.log(registered);


    //編集モードにする 
    const handleWordEditing = (word: WordDataType, index: number) => {
        if (editing !== true) {
            const wordsArr: Array<WordDataType> = [...registerWords];
            const newWord: WordDataType = {
                ...word,
                editing: true
            };
    
            wordsArr[index] = newWord;
    
            setRegisterWords(wordsArr);
            setEditing(true);

            //現在の内容を編集モードのテキストフィールドに渡す
            setEditEngText(word.english);
            setEditJapText(word.japanese);
    
            //mapの外でもwordとindexを参照できるようにする
            setEditWord(word);
            setEditWordIndex(index);
        };
    };

    //編集を完了
    const handleEditEnd = () => {
        const wordsArr: Array<WordDataType> = [...registerWords];
        const prevWord: WordDataType = editWord;
        const newWord: WordDataType = {
            ...prevWord,
            english: editEngText,
            japanese: editJapText,
            editing: false
        };

        wordsArr[editWordIndex] = newWord;

        setRegisterWords(wordsArr);
        setEditing(false);
    };

    //編集モードの単語を削除する
    const RegisterWordDelete = (index: number) => {
        const wordsArr: Array<WordDataType> = [...registerWords];
        
        const wordsMinId: number = wordsArr[0].user_word_id;
        wordsArr.splice(index, 1);

        //欠番が生じる可能性があるため、単語番号をふり直す
        const prevWordsArr: Array<WordDataType> = wordsArr;
        const newWordsArr: Array<WordDataType> = 
        prevWordsArr.map((word: WordDataType, num: number) => ({
            ...word,
            user_word_id: wordsMinId + num
        }));

        setRegisterWords(newWordsArr);
        setEditing(false);
    };

    //テキストフィールドの中身を監視
    const TextFieldLimit = (text: string, regular: RegExp) => {
        if (!text.match(regular)) return true;
        return false;
    };

    //本登録ボタンをクリックしたときの処理
    const handleSendDB = async () => {
        //日付を取得
        const now: Date = new Date(Date.now());
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

        if (user !== null) {
            const dbRegisterWords: Array<WordDBType> = registerWords.map((word: WordDataType, index: number) => ({
                id: 0,
                english: word.english,
                japanese: word.japanese,
                created_at: formattedDate,
                deleted_at: null,
                last_time_at: null,
                complete: false,
                today_learning: false,
                free_learning: false,
                user_answer: "",
                right_or_wrong: false,
                correct_count: 0,
                question_count: 0,
                correct_rate: 0,
                user_word_id: registered.length + (index + 1),
                user_id: user.uid
            }));
    
            try {
                await apiClient.post("/word/db_register", { dbRegisterWords: dbRegisterWords});
    
                setRegisterWords([]);
                setAlertFlag("成功");

            } catch (err) {
                console.error(err);
                setAlertFlag("失敗");
            };
        } else {
            router.push("/login");
        }
    };

    const getUserWords = async () => {
        try {
            const token: string | undefined = document.cookie?.split('=')[1];
            const response = await apiClient.get("/word/db_search", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setRegistered(response.data.words);
        } catch(err) {
            console.error(err);
        };
    };
    
    useEffect(() => {
        setRemainNum(remain);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remain]);

    useEffect(() => {
        getUserWords();
    }, [registerWords]);

    useEffect(() => {
        setAlertFlag("");
    }, []);

    return (
        <>
        <AlertComponent alertFlag={alertFlag} />
        {
            remain < registerWordsMax ? (
                <Box className={styles.home_secondContents}>
                <Box className={styles.home_titleWrapper}>
                    <Typography 
                    className={`${styles.home_wordListTitle} ${notoSansJP.className}`}
                    sx={{ fontSize: { xs: "18px", md: "20px" } }}
                    >
                        登録リスト
                    </Typography>
                    <Box className={styles.home_remainWrapper}>
                        <Typography 
                        className={`${styles.home_remainRegister} ${notoSansJP.className}`}
                        sx={{ fontSize: { xs: "14px", md: "16px" } }}
                        >
                            登録できる数
                        </Typography>
                        <Typography 
                        className={`${styles.home_remainNumber} ${notoSansJP.className}`}
                        sx={{ fontSize: { xs: "14px", md: "16px" } }}
                        >
                            {remain} / 10
                        </Typography>
                    </Box>
                </Box>
                <Box className={styles.home_wordRegisterList}>
                    <TableContainer sx={{ borderRadius: "4px" }}>
                        <Table sx={{ minWidth: "480px" }}>
                            <TableHead sx={{border: "1px solid rgb(240, 119, 49)"}}>
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
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    registerWords.map((word: WordDataType, index: number) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell
                                            align='center'
                                            className={notoSansJP.className}
                                            >
                                                {word.user_word_id}
                                            </StyledTableCell>
                                            <StyledTableCell 
                                            align='center'
                                            className={notoSansJP.className}
                                            onClick={() => handleWordEditing(word, index)}
                                            >
                                                {
                                                    word.editing ? (
                                                        <TextField
                                                        value={editEngText}
                                                        className={`${notoSansJP.className} ${styles.home_editTextField}`}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                            setEditEngText(e.target.value)}
                                                        />
                                                    ) : (
                                                        <Typography>
                                                            {word.english}
                                                        </Typography>
                                                    )
                                                }
                                            </StyledTableCell>
                                            <StyledTableCell 
                                            align='center'
                                            className={notoSansJP.className}
                                            onClick={() => handleWordEditing(word, index)}
                                            >
                                                {
                                                    word.editing ? (
                                                        <TextField
                                                        value={editJapText}
                                                        className={`${notoSansJP.className} ${styles.home_editTextField}`}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                                            setEditJapText(e.target.value)}
                                                        />
                                                    ) : (
                                                        <Typography>
                                                            {word.japanese}
                                                        </Typography>
                                                    )
                                                }
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box className={styles.home_registerButtonWrapper}>
                    {
                        editing ? (
                            <>                           
                            <Button
                            className={`${styles.home_registerButton} ${notoSansJP.className}`}
                            onClick={handleEditEnd}
                            sx={{ width: { xs: "136px", md: "160px" } }}
                            disabled={
                                editEngText.length === 0 ||
                                editJapText.length === 0 ||
                                TextFieldLimit(editEngText, /^[a-zA-Z]*$/) ||
                                TextFieldLimit(editJapText, /^[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠、〜々]*$/) 
                                ? true : false
                            }
                            >
                                完了
                            </Button>
                            <Button
                            className={`${styles.home_deleteButton} ${notoSansJP.className}`}
                            onClick={() => RegisterWordDelete(editWordIndex)}
                            sx={{ width: { xs: "136px", md: "160px" } }}
                            >
                                単語削除
                            </Button>
                            </>
                        ) : (
                            <>                            
                            <Button
                            className={`${styles.home_registerButton} ${notoSansJP.className}`}
                            onClick={handleSendDB}
                            sx={{ width: { xs: "136px", md: "160px" } }}
                            >
                                本登録
                            </Button>
                            <Button
                            className={`${styles.home_deleteButton} ${notoSansJP.className}`}
                            onClick={RegisterListDelete}
                            sx={{ width: { xs: "136px", md: "160px" } }}
                            >
                                リスト削除
                            </Button>
                            </>
                        )
                    }
                </Box>
                </Box>
            ) : (<></>)
        }
        </>
    )
};

export default RegisterList;