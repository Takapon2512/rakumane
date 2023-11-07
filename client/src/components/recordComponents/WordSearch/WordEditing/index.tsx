import React, { useEffect, useState } from 'react';

//lib
import { apiClient } from '@/lib/apiClient';

//MUI
import {
    Box,
    Typography,
    TextField,
    Button
} from "@mui/material";

//CSS
import styles from "./index.module.scss";

//utils
import { notoSansJP } from '@/utils/font';

//type
import { WordDBType } from '@/types/globaltype';

//Component
import AlertComponent from '../alert/alert';

const WordEditing = ({ wordData }: { wordData: WordDBType | null }) => {
    const [word, setWord] = useState<WordDBType | null>(null);
    const [english, setEnglish] = useState<string>("");
    const [japanese, setJapanese] = useState<string>("");
    const [alert, setAlert] = useState<string>("");

    //×ボタンを押した時の処理
    const handleClose = () => {
        setEnglish("");
        setJapanese("");
        
        setWord(null);
        setAlert("");
    };

    //登録するボタンの無効化判定
    const TextFieldLimit = (text: string, regular: RegExp) => {
        if (!text.match(regular)) return true;
        return false;
    };

    //単語を編集するボタンの処理
    const handleEditingWord = async () => {
        try {
            const response = await apiClient.post("/word/edit", { editWord: {
                ...wordData,
                english: english,
                japanese: japanese
            }});

            setAlert("成功");

            return response.data;
        } catch (err) {
            console.error(err);
            
            setAlert("失敗");
        };
    };

    //単語を削除するボタンの処理
    const handleDeleteWord = async () => {
        try {
            await apiClient.post("/word/delete", { deleteWord: word });
            setAlert("成功");
            location.reload();
        } catch (err) {
            console.error(err);
            setAlert("失敗");
        };
    };

    useEffect(() => {
        if (wordData !== null) {
            setWord(wordData);
            setEnglish(wordData.english);
            setJapanese(wordData.japanese);
        }
    }, [wordData]);

    return (
        word !== null ? (
        <>
        <Box className={styles.editing_wordDetail}>
            <Box className={styles.editing_wordDetailContainer}>
                <AlertComponent alertFlag={alert} />
                <Box 
                sx={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    marginBottom: 2
                }}>
                    <Typography 
                    className={notoSansJP.className} 
                    sx={{ fontSize: "18px", fontWeight: 600 }}
                    >
                        単語の編集
                    </Typography>
                    <Button 
                    id="closeBox" 
                    className={styles.editing_close}
                    onClick={handleClose}
                    >
                        <span className={styles.editing_span}></span>
                        <span className={styles.editing_span}></span>
                    </Button>
                </Box>
                <Box className={styles.editing_targetBox}>
                    <Typography
                    className={`${notoSansJP.className} ${styles.editing_targetTitle}`}
                    sx={{ fontSize: { xs: "14px", md: "16px" } }}
                    >
                        対象の単語
                    </Typography>
                    <Typography
                    className={`${notoSansJP.className} ${styles.editing_targetWord}`}
                    sx={{ fontSize: { xs: "14px", md: "16px" } }}
                    >
                        { word.english }
                    </Typography>
                </Box>
                <Box className={styles.editing_English}>
                    <Typography 
                    className={`${notoSansJP.className} ${styles.editing_EnglishTitle}`}
                    sx={{ fontSize: { xs: "14px", md: "16px" } }}
                    >
                        英単語
                    </Typography>
                    <TextField 
                    fullWidth
                    value={english}
                    onChange={(e) => setEnglish(e.target.value)}
                    />
                </Box>
                <Box className={styles.editing_Japanese}>
                    <Typography 
                    className={`${notoSansJP.className} ${styles.editing_JapaneseTitle}`}
                    sx={{ fontSize: { xs: "14px", md: "16px" } }}
                    >
                        日本語訳
                    </Typography>
                    <TextField 
                    fullWidth
                    value={japanese}
                    onChange={(e) => setJapanese(e.target.value)}
                    />
                </Box>
                <Box className={styles.editing_buttons}>
                    <Button
                    className={`${notoSansJP.className} ${styles.editing_register}`}
                    sx={{ width: { xs: "136px", md: "160px" } }}
                    disabled={
                        english === "" || 
                        japanese === "" ||
                        TextFieldLimit(english, /^[a-zA-Z]*$/) ||
                        TextFieldLimit(japanese, /^[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠、々〜]*$/)
                        ? true : false 
                    }
                    onClick={handleEditingWord}
                    >
                        登録する
                    </Button>
                    <Button
                    className={`${notoSansJP.className} ${styles.editing_delete}`}
                    sx={{ width: { xs: "136px", md: "160px" } }}
                    onClick={handleDeleteWord}
                    >
                        単語を削除
                    </Button>
                </Box>
            </Box>
        </Box>
        </>
        ) : (
        <></>
        )
    );
};

export default WordEditing;