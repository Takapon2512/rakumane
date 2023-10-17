import React from 'react';

//MUI
import { Box, Typography } from '@mui/material';

//CSS
import styles from "./index.module.scss";

//Components
import SearchWordsInput from './SearchWordsInput';

//utils
import { notoSansJP } from '@/utils/font';

//type
import { WordDBType } from '@/types/globaltype';

type Props = {
  recordWords: WordDBType[]
}

const WordSearch = ({ recordWords }: Props) => {
    return (
        <Box className={styles.record}>
            <Typography className={`${styles.record_title} ${notoSansJP.className}`}>
                英単語の記録
            </Typography>
            <SearchWordsInput recordWords={recordWords} />
        </Box>
    );
};

export default WordSearch;