import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

//MUI
import { 
    Box,
    Typography
} from '@mui/material';

//Font
import { notoSansJP, nothingYouCouldDo } from "@/utils/font";

//CSS
import styles from './index.module.scss';

const FirstContent = () => {
    const textRef = useRef<HTMLDivElement | null>(null);
    const descriptionRef = useRef<HTMLDivElement | null>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);

        const horizontalBar = document.getElementById("horizontal");
        const verticalBar = document.getElementById("vertical");
        const container = document.getElementById("firC_container");
        const vocabulary = document.getElementById("vocabulary");
        const english = document.getElementById("english");

        if (!horizontalBar || 
            !verticalBar || 
            !container || 
            !vocabulary || 
            !english
        ) return;

        // GSAPアニメーション
        gsap.fromTo(horizontalBar, { x: '-200%', opacity: 0 },{ x: '-50%', opacity: 1, duration: 2, ease: 'power2.inOut', delay: 1 });
        gsap.fromTo(verticalBar, { y: '-100%', opacity: 0 }, { y: '-50%', opacity: 1, duration: 1, ease: 'power2.inOut', delay: 2 });

        gsap.fromTo(container, { opacity: 0 }, { opacity: 1 });

        gsap.fromTo(english, { left: "-100%", opacity: 0 }, { left: "10%", opacity: 1, delay: 3 })
        gsap.fromTo(vocabulary, { left: "100%", opacity: 0 }, { left: "20%", opacity: 1, delay: 3 })


    }, []);

    useEffect(() => {
        if (isMounted && textRef.current) {
            const textElement = textRef.current;

            const text = textElement.innerText;
            textElement.innerText = ''; // 初期表示を空にする
      
            let index = 0;
            const interval = setInterval(() => {
                textElement.innerText += text[index];
                index++;
        
                if (index === text.length) {
                    clearInterval(interval);
                }
            }, 150);
        };
    }, [isMounted]);

    return (
        <>
        <Box className={styles.firC}>
            <Box id="firC_container"
            className={styles.firC_container}
            sx={{ 
                width: { xs: "92%", md: "96%" }
            }}
            >
                <Typography 
                variant="h4" 
                className={`${notoSansJP.className} ${styles.firC_title}`}
                sx={{ 
                    opacity: isMounted ? 1 : 0, 
                    fontSize: { xs: "32px", md: "48px" },
                    textAlign: "center"
                }}
                ref={textRef}
                >
                    ラクラク管理で英単語を暗記できる
                </Typography>
                <Typography
                className={`${notoSansJP.className} ${styles.firC_description}`}
                ref={descriptionRef}
                sx={{
                    fontSize: { xs: "16px", md: "20px" }
                }}
                >
                    英単語の学習で何を覚えたかしっかり管理できたら...と思うことはありませんか？
                    本アプリは、管理操作なしで学習すべき単語を示すことができます。
                </Typography>
                <Typography
                id="english"
                className={`${styles.firC_english} ${nothingYouCouldDo.className}`}
                sx={{ fontSize: { xs: "96px", md: "140px" } }}
                >
                    English
                </Typography>
                <Typography 
                id="vocabulary" 
                className={`${styles.firC_vocabulary} ${nothingYouCouldDo.className}`}
                sx={{ 
                    fontSize: { xs: "96px", md: "140px" }
                }}
                >
                    Vocabulary
                </Typography>
                <Box id="horizontal" className={styles.firC_horizontal}></Box>
                <Box id="vertical" 
                className={styles.firC_vertical}
                
                ></Box>
            </Box>
        </Box>
        </>
    )
};

export default FirstContent;