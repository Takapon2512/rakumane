import React, { useState } from 'react';

//MUI
import { 
    Box,
    Typography,
    TextField
} from '@mui/material';

//CSS
import styles from "./index.module.scss";
import { notoSansJP } from '@/utils/font';

//Components
import WordList from '../WordList';

//type
import { UserInputType, WordDBType } from '@/types/globaltype';
type Props = {
    recordWords: WordDBType[]
}

const SearchWordsInput = ({recordWords}: Props) => {

    const [userInput, setUserInput] = useState<UserInputType>({
        minText: "1",
        maxText: String(recordWords.length),
        wordText: ""
    });
    const prevUserInput: UserInputType = userInput;

    //テキストフィールドの内容を監視
    const changeMinText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setUserInput({...prevUserInput, minText: e.target.value});
    const changeMaxText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setUserInput({...prevUserInput, maxText: e.target.value});
    const changeWordText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setUserInput({...prevUserInput, wordText: e.target.value}); 

    return (
        <Box 
        className={styles.inputs}
        sx={{ padding: { xs: "24px 16px", md: "32px 24px" } }}
        >
            <Box 
            className={styles.inputs_searchNumber}
            sx={{ display: { xs: "block", md: "flex" } }}
            >
                <TextField 
                label="最初の単語番号"
                type='number'
                className={styles.inputs_searchNumMin}
                sx={{ width: { xs: "100%", md: "calc(50% - 48px)" }, marginBottom: { xs: "16px"} }}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => changeMinText(e)}
                value={userInput.minText}
                />
                <Typography 
                className={`${styles.inputs_searchNumberMiddle} ${notoSansJP.className}`}
                sx={{ display: { xs: "none", md: "block" } }}
                >
                    〜
                </Typography>
                <TextField 
                label="最後の単語番号"
                type='number'
                className={styles.inputs_searchNumMax}
                sx={{ width: { xs: "100%", md: "calc(50% - 48px)" } }}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => changeMaxText(e)}
                value={userInput.maxText}
                />
            </Box>
            <Box className={styles.inputs_keyword}>
                <TextField 
                label="英単語で検索"
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => changeWordText(e)}
                />
            </Box>
            <WordList
            minText={userInput.minText}
            maxText={userInput.maxText}
            wordText={userInput.wordText}
            recordWords={recordWords}
            />
        </Box>
    );
};

export default SearchWordsInput;