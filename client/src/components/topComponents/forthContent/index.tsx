import React, { useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

//MUI
import { 
    Box,
    Typography,
    Paper
} from '@mui/material';

//MUIIcon
import AirlineSeatFlatIcon from '@mui/icons-material/AirlineSeatFlat';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

//Font
import { notoSansJP } from "@/utils/font";

//CSS
import styles from './index.module.scss'

//type
type FunctionType = {
    id: number;
    icon: React.JSX.Element;
    title: string;
    description: string;
}

const ForthContent = () => {
    gsap.registerPlugin(ScrollTrigger);
    const functionArr: Array<FunctionType> = [
        {
            id: 0,
            icon: <AirlineSeatFlatIcon className={styles.fifC_icon} />,
            title: "サボりも反映",
            description: "学習に取り組み忘れた場合、ステータスをリセットする機能を搭載しています。これにより、定着している単語とそうでない単語を正確に反映します。"
        },
        {
            id: 1,
            icon: <SmartphoneIcon className={styles.fifC_icon} />,
            title: "タブレットやスマホでも使える",
            description: "インストール不要で、PCだけでなくスマホやタブレットからアクセスできます。端末に最適化された画面で、アプリをお使いいただけます。"
        },
        {
            id: 2,
            icon: <KeyboardIcon className={styles.fifC_icon} />,
            title: "タイピングが苦手でも安心",
            description: "タイピングが苦手な人も取り組みやすいように解答時間を延ばすことができます。あとから変更できるため、慣れてから時間を変更することもできます。"
        },
        {
            id: 3,
            icon: <NotificationsActiveIcon className={styles.fifC_icon} />,
            title: "LINEで学習通知(追加予定)",
            description: "翌日の0時に近づいても学習予定の単語が終了していない際にLINEで通知する機能を搭載予定です。普段忙しい方や学習の継続が難しい方でも毎日取り組めるようになります。"
        }
    ];

    useEffect(() => {
        const fifCBoxEl = document.getElementById("fifC_Box");

        const funcEl0 = document.getElementById("func_0");
        const funcEl1 = document.getElementById("func_1");
        const funcEl2 = document.getElementById("func_2");
        const funcEl3 = document.getElementById("func_3");

        if (!fifCBoxEl || !funcEl0 || !funcEl1 || !funcEl2 || !funcEl3) return;

        gsap.fromTo(funcEl0, {
            opacity: 0,
            transform: "translateY(16px)"
        }, {
            opacity: 1,
            transform: "translateY(0)",
            scrollTrigger: {
                trigger: fifCBoxEl,
                start: 'top center',
                end: "bottom"
            }
        });

        gsap.fromTo(funcEl1, {
            opacity: 0,
            transform: "translateY(16px)"
        }, {
            opacity: 1,
            transform: "translateY(0)",
            delay: 0.4,
            scrollTrigger: {
                trigger: fifCBoxEl,
                start: 'top center',
                end: "bottom"
            }
        });

        gsap.fromTo(funcEl2, {
            opacity: 0,
            transform: "translateY(16px)"
        }, {
            opacity: 1,
            transform: "translateY(0)",
            delay: 0.8,
            scrollTrigger: {
                trigger: fifCBoxEl,
                start: 'top center',
                end: "bottom"
            }
        });

        gsap.fromTo(funcEl3, {
            opacity: 0,
            transform: "translateY(16px)"
        }, {
            opacity: 1,
            transform: "translateY(0)",
            delay: 1.2,
            scrollTrigger: {
                trigger: fifCBoxEl,
                start: 'top center',
                end: "bottom"
            }
        });

    }, []);

    return (
        <>
        <Box id="fifC_Box" className={styles.fifC}>
            <Box className={styles.fifC_container}>
                <Typography
                variant="h6"
                className={styles.fifC_title}
                sx={{ 
                        fontSize: { xs: "32px", md: "48px" },
                        marginBottom: { xs: "36px", md: "64px" } 
                    }}
                >
                    他にもこんな
                    <Box 
                    sx={{ fontSize: { xs: "36px", md: "56px" }, color: "rgb(234, 87, 30)" }} 
                    component={'span'} 
                    >
                        機能
                    </Box>
                    があります！
                </Typography>
                <Box 
                className={styles.fifC_boxs}
                sx={{
                    display: { xs: "block", md: "flex" },
                    flexWrap: { md: "wrap" },
                    justifyContent: "center"
                }}
                >
                    {
                        functionArr.map((func: FunctionType, index: number) => (
                            <Paper 
                            id={`func_${index}`}
                            className={styles.fifC_function} 
                            elevation={2}
                            key={index}
                            sx={{
                                width: { md: "calc(42% - 24px)" },
                                marginBottom: "24px"
                            }}
                            >
                                { func.icon }
                                <Box className={styles.fifC_text}>
                                    <Typography
                                    className={`${notoSansJP.className} ${styles.fifC_fcTitle}`}
                                    >
                                        { func.title }
                                    </Typography>
                                    <Typography
                                    className={`${notoSansJP.className} ${styles.fifC_fcDescription}`}
                                    >
                                        { func.description }
                                    </Typography>
                                </Box>
                            </Paper>
                        ))
                    }
                </Box>
                <Image className={styles.fifC_leftImage} width="320" height="320" src="/images/geer2.png" alt="ギア" />
                <Image className={styles.fifC_rightImage} width="300" height="300" src="/images/geer2.png" alt="ギア" />
            </Box>
        </Box>
        </>
    )
};

export default ForthContent;