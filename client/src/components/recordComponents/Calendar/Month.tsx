import React, { useState } from 'react';
import Day from './Day';

//MUI
import { Box, Typography, Button } from '@mui/material';

//MUIIcon
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

//CSS
import styles from "./Month.module.scss";

//type
import dayjs, { Dayjs } from 'dayjs';
import { CalendarType } from '@/types/globaltype';

//utils
import { getMonth } from '@/utils/days';
import { notoSansJP } from '@/utils/font';

const Month = ({ calendars }: { calendars: CalendarType[] }) => {
    const [monthNum, setMonthNum] = useState<number>(dayjs().month());

    return (
        <Box className={styles.calendar_paper}>
            <Box className={styles.calendar_monthDisplay}>
                <Typography className={`${notoSansJP.className}`} sx={{fontSize: "20px"}}>
                    { dayjs(new Date(dayjs().year(), monthNum)).format("MMMM YYYY") }
                </Typography>
                <Box className={styles.calendar_buttons}>
                    <Button className={styles.calendar_before} onClick={() => setMonthNum(prev => prev - 1)}>
                        <NavigateBeforeIcon />
                    </Button>
                    <Button className={styles.calendar_next} onClick={() => setMonthNum(prev => prev + 1)}>
                        <NavigateNextIcon />
                    </Button>
                </Box>
            </Box>
            <Box sx={{ overflow: { xs: "auto" } }}>
                <Box 
                className={styles.calendar_container} 
                sx={{ minWidth: { xs: "720px" } }}
                >
                    {
                        getMonth(monthNum).map((row: Dayjs[], i: number) => (
                            <React.Fragment key={i}>
                                {
                                    row.map((day: Dayjs, index: number) => (
                                        <Day day={day} key={index} rowIndex={i} calendars={calendars} />
                                    ))
                                }
                            </React.Fragment>
                        ))
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default Month;