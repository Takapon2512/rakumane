import React, { useState, useEffect } from 'react';

//Recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { remainNumState, wordsState } from '@/store/mypageState';

//MUI
import {
    Box,
    Typography,
    TextField,
    Button
} from '@mui/material';

//Font
import { notoSansJP } from '../../../utils/font';

//CSS
import styles from './index.module.scss';

//Type
import { WordDBType, WordDataType } from '@/types/globaltype';
import { apiClient } from '@/lib/apiClient';

const WordRegisterInput = ({ dbWords }: { dbWords: WordDBType[] }) => {
    
    //登録リストに入っているすべての単語を取得
    const registerWords = useRecoilValue<WordDataType[]>(wordsState);
    
    const [words, setWords] = useRecoilState<WordDataType[]>(wordsState);
    const [remain, setRemain] = useRecoilState<number>(remainNumState);
    const [engField, setEngField] = useState('');
    const [japField, setJapField] = useState('');

    //現在のDB登録されている単語を管理
    const [registered, setRegistered] = useState<WordDBType[]>([...dbWords]);

    //入力を検知
    const [composing, setComposing] = useState<boolean>(false);

    const handleWordsAdd = async () => {
        //日付を取得する
        const now: Date = new Date(Date.now());
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

        const registerWord: WordDataType = {
            id: 0,
            english: engField,
            japanese: japField,
            created_at: formattedDate,
            deleted_at: null,
            editing: false,
            complete: false,
            today_learning: false,
            free_learning: false,
            user_answer: "",
            right_or_wrong: false,
            correct_count: 0,
            question_count: 0,
            correct_rate: 0,
            last_time_at: null,
            user_word_id: dbWords.length + registerWords.length + 1, 
            user_id: ""
        };
        console.log(registerWord);

        //words配列に追加の単語を格納
        const preWords = [...words];
        const newWords = [...preWords, registerWord];
        setWords(newWords);

        setEngField('');
        setJapField('');
    };

    //テキストフィールドの監視
    const eWordTextField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEngField(e.target.value);
    };
    const jWordTextField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJapField(e.target.value);
    };

    //テキストフィールドの中身を監視
    const TextFieldLimit = (text: string, regular: RegExp) => {
        if (!text.match(regular)) return true;
        return false;
    };

    //Enterキーを押したとき
    const TextFieldEnter = (key: string) => {
        if (
            key === "Enter" 
            && composing === false 
            && japField !== "" 
            && engField !== ""
            && TextFieldLimit(engField, /^[a-zA-Z]*$/) === false 
            && TextFieldLimit(japField, /^[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠、々〜]*$/) === false
            ) {
                handleWordsAdd();
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
        getUserWords();
    }, [registerWords]);

    return (
        <Box className={styles.home_firstContents}>
            <Typography 
            className={`${styles.home_wordRegisterTitle} ${notoSansJP.className}`}
            sx={{ fontSize: { xs: "18px", md: "20px" } }}
            >
                英単語を登録
            </Typography>
            <Box 
            className={styles.home_wordRegisterInputs}
            sx={{ padding: { xs: "16px 24px" } }}
            >
                <Box className={styles.home_RegisterEnglish}>
                    <TextField 
                    //レスポンシブ対応はscssファイルに記入(43)
                    label="英単語"
                    required
                    className={notoSansJP.className}
                    fullWidth
                    onChange={eWordTextField}
                    value={engField}
                    onCompositionStart={() => setComposing(true)}
                    onCompositionEnd={() => setComposing(false)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => TextFieldEnter(e.key)}
                    />
                </Box>
                <Box className={styles.home_RegisterJapanese}>
                    <TextField 
                    //レスポンシブ対応はscssファイルに記入(58)
                    label="日本語訳"
                    required
                    className={notoSansJP.className}
                    fullWidth
                    onChange={jWordTextField}
                    value={japField}
                    onCompositionStart={() => setComposing(true)}
                    onCompositionEnd={() => setComposing(false)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => TextFieldEnter(e.key)}
                    />
                </Box>
                <Box className={styles.home_wordRegisterWrapper}>
                    <Button
                    className={`${styles.home_wordRegister} ${notoSansJP.className}`}
                    sx={{ fontSize: { xs: "12px", md: "14px" }, width: { xs: "140px", md: "160px" } }}
                    onClick={handleWordsAdd}
                    disabled={ 
                        remain === 0 || 
                        engField === "" || 
                        japField === "" ||
                        TextFieldLimit(engField, /^[a-zA-Z]*$/) ||
                        TextFieldLimit(japField, /^[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠、々〜]*$/)
                        ? true : false 
                    }
                    >
                        登録リストに追加
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default WordRegisterInput;