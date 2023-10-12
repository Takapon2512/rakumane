import React, { useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

//MUI
import { 
    Box,
    Typography,
    Link,
    List,
    Paper
} from '@mui/material';

//Font
import { notoSansJP } from "@/utils/font";

//CSS
import styles from './index.module.scss';

//type
type ChallengesType = {
    icon: React.JSX.Element,
    text: string
}

const SecondContent = () => {
    const challenges: ChallengesType[] = [
        {
            icon: <Image className={styles.secC_image} width={72} height={72} src="/images/cry_man.png" alt="英単語が多くて覚えられない" />,
            text: "英単語が多くて覚えられない..."
        },
        {
            icon: <Image className={styles.secC_image} width={72} height={72} src="/images/study_woman1.png" alt="覚えた単語と覚えていない単語の管理ができない" />,
            text: "覚えた単語と覚えていない単語の管理ができない..."
        },
        {
            icon: <Image className={styles.secC_image} width={72} height={72} src="/images/pc_man.png" alt="実際は暗記できていないのにアプリでは暗記済みになっている" />,
            text: "実際は暗記できていないのにアプリでは暗記済みになっている..."
        }
    ];

    useEffect(() => {

        const onScroll = () => {
            const challengeEl1 = document.getElementById("challenge1"); 
            const challengeEl2 = document.getElementById("challenge2"); 
            const challengeEl3 = document.getElementById("challenge3");

            if (!challengeEl1 || !challengeEl2 || !challengeEl3) return;
            
            const screenHeight = window.innerHeight || document.documentElement.clientHeight;
            const scrollPosition = window.scrollY;

            if (scrollPosition > screenHeight / 2) {
                gsap.to(challengeEl1, { opacity: 1, duration: 1, x: 0 });
                gsap.to(challengeEl2, { opacity: 1, duration: 1, delay: 0.2, x: 0 });
                gsap.to(challengeEl3, { opacity: 1, duration: 1, delay: 0.4, x: 0 });

                window.removeEventListener('scroll', onScroll);
            };
        };
        window.addEventListener('scroll', onScroll);
    }, []);

    return (
        <>
        <Box className={styles.secC}>
            <Box className={styles.secC_container}>
                <Typography 
                variant="h2"
                className={`${notoSansJP.className} ${styles.secC_title}`}
                sx={{ fontSize: { xs: "32px", md: "48px" } }}
                >
                    このような
                    <Box 
                    className={styles.secC_emphasis} 
                    component={'span'}
                    sx={{ fontSize: { xs: "36px", md: "56px" } }}
                    >
                        課題
                    </Box>
                    はありませんか？
                </Typography>
                <List className={styles.secC_Lists}>
                    {
                        challenges.map((item: ChallengesType, index: number) => (
                            <Paper 
                            key={index} 
                            className={styles.secC_Item} 
                            id={`challenge${index + 1}`} 
                            style={{ opacity: 0, transform: "translateX(-2000px)" }}
                            >
                                <Typography className={`${notoSansJP.className} ${styles.secC_case}`}>
                                    {`Case 0${index + 1}`}
                                </Typography>
                                { item.icon }
                                <Typography className={`${notoSansJP.className} ${styles.secC_Text}`}>
                                    { item.text }
                                </Typography>
                            </Paper>
                        ))
                    }
                </List>
                <Box className={styles.secC_triangle}></Box>
            </Box>
        </Box>
        </>
    )
};

export default SecondContent;