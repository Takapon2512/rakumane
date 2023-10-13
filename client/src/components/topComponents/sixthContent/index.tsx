import React, { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

//MUI
import { 
    Box,
    Typography,
    Link
} from '@mui/material';

//Font
import { notoSansJP } from "@/utils/font";

//CSS
import styles from './index.module.scss';

const SixthContent = () => {
    gsap.registerPlugin(ScrollTrigger)
    
    useEffect(() => {
        //要素取得
        const sevCBoxEl = document.getElementById("sevC_Box");
        const titleEl = document.getElementById("sevC_title");
        const descriptionEl = document.getElementById("sevC_description");
        const buttonsEl = document.getElementById("sevC_buttons");

        if (!sevCBoxEl || !titleEl || !descriptionEl || !buttonsEl) return;

        gsap.fromTo(titleEl, {
            opacity: 0,
            transform: "translateY(16px)"
        }, {
            opacity: 1,
            transform: "translateY(0)",
            duration: 0.5,
            scrollTrigger: {
                trigger: sevCBoxEl,
                start: 'top 70%',
                end: "bottom"
            }
        });

        gsap.fromTo(descriptionEl, {
            opacity: 0,
            transform: "translateY(16px)"
        }, {
            opacity: 1,
            transform: "translateY(0)",
            duration: 0.5,
            delay: 0.4,
            scrollTrigger: {
                trigger: sevCBoxEl,
                start: 'top 70%',
                end: "bottom"
            }
        });

        gsap.fromTo(buttonsEl, {
            opacity: 0,
            transform: "translateY(16px)"
        }, {
            opacity: 1,
            transform: "translateY(0)",
            duration: 0.5,
            delay: 0.4,
            scrollTrigger: {
                trigger: sevCBoxEl,
                start: 'top 70%',
                end: "bottom"
            }
        });
    }, []);
    
    return (
        <>
        <Box id="sevC_Box" className={styles.sevC}>
            <Box className={styles.sevC_container}>
            <Typography
            id="sevC_title"
            variant="h3"
            className={`${notoSansJP.className} ${styles.sevC_title}`}
            sx={{ 
                fontSize: { xs: "32px", md: "48px" },
                marginBottom: { xs: "32px", md: "64px" }
            }}
            >
                今すぐ学習しよう！
            </Typography>
            <Typography
            id="sevC_description"
            className={`${notoSansJP.className} ${styles.sevC_subDescription}`}
            >
                メールアドレス、ユーザー名、パスワードで登録できます。
                <br></br>
                すでにアカウントをお持ちの方は、ログインを
                <br></br>
                クリックしてください。
            </Typography>
            <Box id="sevC_buttons" className={styles.sevC_buttons}>
                <Link 
                href="/register"
                className={`${notoSansJP.className} ${styles.sevC_mail}`}
                >
                    メールアドレスで登録
                </Link>
            </Box>
            </Box>
        </Box>
        </>
    );
};

export default SixthContent;