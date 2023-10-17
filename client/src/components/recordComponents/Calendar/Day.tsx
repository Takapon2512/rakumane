import React from 'react';
import Image from 'next/image';

//MUI
import { Box, Typography } from '@mui/material';

//CSS
import styles from "./Day.module.scss";

//type
import dayjs, { Dayjs } from 'dayjs';
import { CalendarType } from '@/types/globaltype';

//utils
import { notoSansJP } from '@/utils/font';

const Day = ({day, rowIndex, calendars}: {day: Dayjs, rowIndex: number, calendars: CalendarType[]}) => {
    //今日の日付に色をつける
    const getCurrentDayStyle = () => {
        return day.format("YY-MM-DD") === dayjs().format("YY-MM-DD") ? true : false;
    };

    //暗記モードで本日分の学習に取り組んだかどうかを判断する処理
    const learningJudge = (calendars: CalendarType[]) => {
        const today: Dayjs = dayjs(day.toDate());
        const tommorow: Dayjs = dayjs(day.add(1, "d").toDate());

        const learning: Array<CalendarType> = 
        calendars.filter((calendar: CalendarType) => 
        ((today.isSame(calendar.learning_date) || today.isBefore(calendar.learning_date)) && tommorow.isAfter(calendar.learning_date)));

        if (learning.length > 0) return true;
        return false;
    };

    return (
        <Box className={styles.calendar_days}>            
            <Box className={styles.calendar_dayWrapper}>
                { 
                    rowIndex === 0 
                    &&
                    <Typography className={`${styles.calendar_week} ${notoSansJP.className}`}>
                        { day.format("ddd") }
                    </Typography>
                }
                <Typography 
                className={`${styles.calendar_day} ${notoSansJP.className}`}
                sx={
                    getCurrentDayStyle() 
                    ? {
                        backgroundColor: "rgb(240, 119, 49)",
                        borderRadius: "12px",
                        color: "#fff"
                    } : {}
                }
                >
                    { day.format("DD") }
                </Typography>
            </Box>
            {
                learningJudge(calendars) ? (
                    <Box className={styles.calendar_memorize}>
                        <Image 
                        className={styles.calendar_completion}
                        width={96}
                        height={32}
                        src="/images/complete.jpeg"
                        alt='完了'
                        />
                    </Box>
                ) : (<></>)
            }
        </Box>
    );
};

export default Day;
