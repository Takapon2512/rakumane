import React from 'react';

//MUI
import { Box, Typography } from '@mui/material';

//CSS
import styles from "./index.module.scss";

//Component
import Month from './Month';

//utils
import { notoSansJP } from '@/utils/font';

//type
import { CalendarType } from '@/types/globaltype';

const Calendar = ({ calendars }: { calendars: CalendarType[] }) => {
    return (

        <Box className={styles.record}>
            <Typography className={`${styles.record_title} ${notoSansJP.className}`}>
                学習日の記録
            </Typography>
            <Month calendars={calendars} />
        </Box>

    );
};

export default Calendar;