import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';

//MUI
import { 
    Box,
    Alert
} from '@mui/material';

//CSS
import styles from "./alert.module.scss";

const AlertComponent = ({ alertFlag }: { alertFlag: string }) => {

    useEffect(() => {
        //アラートボックスのアニメーション
        const alertAnimation = gsap.timeline();

        alertAnimation.to("#alertBox", 0.5, {
            opacity: 1
        }, 0)
        .to('#alertBox', 1, {
            opacity: 0
        }, 4);
    }, [alertFlag]);

    return (
        <>
        {
            alertFlag === "" ? (<></>) : (
                <Box 
                className={styles.alert}
                id="alertBox"
                sx={{ opacity: 0, top: { sx: "0px", md: "24px" }, right: { sx: "0px", md: "24px" } }}
                >
                    {
                        alertFlag === "失敗" ? (
                            <Alert variant='filled' severity='error' id='alert' className={styles.alert_error}>
                                登録されている単語が少ないため、チャレンジできません
                            </Alert>
                        ) : (<></>)
                    }
                </Box>
            )
        }
        </>
    );
};

export default AlertComponent;