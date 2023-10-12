import React, { useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

//MUI
import { 
    Box,
    Typography,
    Button,
    List,
    ListItem
} from '@mui/material';

//Font
import { notoSansJP } from "@/utils/font";

//CSS
import styles from './index.module.scss';

//type
type functionType = {
    id: number
    title: string;
    imageUrl: string;
    description: string
};

const ThirdContent = () => {
    const [next, setNext] = useState<number>(0);
    const [textStatus, setTextStatus] = useState<boolean>(false);

    gsap.registerPlugin(ScrollTrigger);

    //機能
    const functions: Array<functionType> = [
        {
            id: 0,
            title: "暗記カード",
            imageUrl: "/images/memorization1.png",
            description: "暗記カードは、出題対象の単語を覚える機能です。操作はシンプルで、覚えたと思ったら「覚えた！」ボタンを、そうでない場合は「もう一度」ボタンで後回しにできます。また、英語と日本語の切り替えは画面をクリックするだけです。"
        },
        {
            id: 1,
            title: "フリーモード",
            imageUrl: "/images/free_search3.png",
            description: "フリーモードでは、取り組みたい単語を出題することができます。1つずつ選んだり、「すべて出題」でまとめて選べます。また、苦手別に検索できるため、苦手な単語だけ取り組むという使い方も可能です。"
        },
        {
            id: 2,
            title: "確認テスト",
            imageUrl: "/images/test1.png",
            description: "確認テストでは、暗記カードで暗記した内容を出題します。キーボードで解答するため、あやふやな記憶で正解する心配がありません。スマートフォンやタブレットでは解答しやすいように選択式を採用しております。"
        },
        {
            id: 3,
            title: "学習する単語を提示",
            imageUrl: "/images/today_learning3.png",
            description: "本アプリは、学習に効率よく取り組みやすいようにその日に学習する単語を提示しています。ユーザーごとの単語の定着度に基づいており、未学習の単語や苦手な単語が優先して表示されます。これにより、学習メニューを考える必要がありません。"
        },
        {
            id: 4,
            title: "学習の記録",
            imageUrl: "/images/record_calendar.png",
            description: "暗記モードで学習予定の単語にすべて正解すると、学習完了の記録がつきます。全問正解でないと完了扱いにならないため、暗記の漏れを防ぐことが可能です。"
        },
        {
            id: 5,
            title: "単語の記録、修正、消去",
            imageUrl: "/images/record_search.png",
            description: "記録モードでは単語ごとに正答率や出題回数、登録日などを確認することができます。また、単語の編集や消去も可能で、間違って登録した単語の修正や整理も可能です。"
        }
    ];

    const handleSwitch = () => setTextStatus(!textStatus);

    const handleNext = () => {
        let current: number = next;
        if (next === functions.length - 1) {
            current -= functions.length;
        };
        current++;
        setNext(current);
        setTextStatus(false);

        const imageEl = document.getElementById("func_image");
        const imageBoxEl = document.getElementById("func_imageBox");

        const textTitleEl = document.getElementById("func_textTitle");
        const descriptionEl = document.getElementById("func_description");

        if (
            !imageEl || 
            !imageBoxEl ||
            !textTitleEl ||
            !descriptionEl
        ) return;

        gsap.fromTo(imageEl, {
            opacity: 0,
            transform: "translateX(-16px)"
        }, {
            opacity: 1,
            transform: "translateX(0)",
            duration: 0.4
        });

        gsap.fromTo([textTitleEl, descriptionEl], {
            opacity: 0,
            transform: "translateX(16px)"
        }, {
            opacity: 1,
            transform: "translateY(0)",
            duration: 0.4
        });
    };

    useEffect(() => {
        
        const thirdEl = document.getElementById("thirdContent");

        const imageBoxEl = document.getElementById("func_imageBox");
        const imageBackEl = document.getElementById("func_back");

        const textBoxEl = document.getElementById("func_text");

        const supportEl = document.getElementById("support");
        const functionEl = document.getElementById("function");

        const nextButton = document.getElementById("nextButton");
        
        if (
            !thirdEl || 
            !imageBoxEl || 
            !imageBackEl || 
            !textBoxEl || 
            !supportEl || 
            !functionEl ||
            !nextButton
        ) return;

        gsap.to([imageBoxEl, imageBackEl], { 
            x: 0, 
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: imageBoxEl,
                start: 'top center',
                end: "bottom",
            }
        });

        gsap.to(supportEl, {
            x: 0,
            opacity: 1,
            duration: 1,
            delay: 0.5,
            scrollTrigger: {
                trigger: imageBoxEl,
                start: 'top center',
                end: "bottom",
            }
        });

        gsap.to(textBoxEl, {
            x: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: imageBoxEl,
                start: 'top center',
                end: "bottom",
            }
        });

        gsap.to(functionEl, {
            x: 0,
            opacity: 1,
            duration: 1,
            delay: 0.5,
            scrollTrigger: {
                trigger: imageBoxEl,
                start: 'top center',
                end: "bottom",
            }
        });

        gsap.to(nextButton, {
            opacity: 1,
            duration: 0.3,
            width: "140px",
            delay: 1,
            scrollTrigger: {
                trigger: imageBoxEl,
                start: 'top center',
                end: "bottom",
            }
        });

    }, []);

    return (
        <>
        <Box id="thirdContent" className={styles.thiC}>
            <Box className={styles.thiC_container}>
                <Typography
                variant="h3"
                className={`${notoSansJP.className} ${styles.thiC_title}`}
                sx={{ fontSize: { xs: "32px", md: "48px" } }}
                >
                    サポート
                    <Box 
                    sx={{ 
                      color: "rgb(234, 87, 30)", 
                      fontSize: { xs: "36px", md: "56px" }, 
                      display: "inline-block" 
                    }}
                    >
                      機能
                    </Box>
                    で
                    <br />
                    すべて解決します！
                </Typography>
                <Typography
                id="support"
                sx={{ 
                  opacity: 1, 
                  transform: "translateX(-100vw)",
                  display: { xs: "none", md: "block" }
                }}
                className={`${notoSansJP.className} ${styles.thiC_support}`}
                >
                    Support
                </Typography>
                <Typography
                id="function"
                sx={{ 
                  opacity: 0, 
                  transform: "translateX(100vw)",
                  display: { xs: "none", md: "block" }
                }}
                className={`${notoSansJP.className} ${styles.thiC_function}`}
                >
                    Function
                </Typography>
                        
                <Box className={styles.thiC_contents} sx={{ display: { xs: "none", md: "block" } }}>
                    <Box 
                    id="func_imageBox" 
                    className={styles.thiC_ImageContainer}
                    sx={{ opacity: 0, transform: "translateX(-53vw)" }}
                    >
                        <Image 
                        id="func_image" 
                        width={540} 
                        height={434} 
                        src={functions[next].imageUrl} 
                        alt="暗記カードの機能" 
                        className={styles.thiC_Image} 
                        />
                    </Box>
                    <Box 
                    id="func_back" 
                    className={styles.thiC_ImageContainerBack} 
                    component={'span'} 
                    sx={{ opacity: 0, transform: "translateX(-53vw)" }}></Box>
                    <Box 
                    id="func_text" 
                    className={styles.thiC_TextBoxRight}
                    sx={{ transform: "translateX(64vw)", opacity: 0 }}
                    >
                        <Box className={styles.thiC_TextContainer}>
                            <Box className={styles.thiC_TextBox}>
                                <Typography 
                                id="func_textTitle"
                                className={styles.thiC_textTitle}
                                >
                                    { functions[next].title }
                                </Typography>
                                <Typography 
                                id="func_description"
                                className={styles.thiC_description}
                                >
                                    { functions[next].description }
                                </Typography>
                                <List className={styles.thiC_page}>
                                    {
                                        functions.map((func: functionType) => (
                                            <ListItem
                                            key={func.title}
                                            className={styles.thiC_pageCircle}
                                            sx={
                                                func.id === next ? {
                                                    backgroundColor: "rgb(234, 87, 30) !important"
                                                } : {}
                                            }
                                            ></ListItem>
                                        ))
                                    }
                                </List>
                            </Box>
                        </Box>
                        <Button
                        id="nextButton"
                        className={`${styles.thiC_next} ${notoSansJP.className}`}
                        sx={{ opacity: 0 }}
                        onClick={handleNext}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
                <Box className={styles.thiC_contentsTb}>
                  <Box 
                  className={styles.thiC_ImageContainerTb}
                  >
                    <Image 
                    id="func_imageSp"
                    width={460}
                    height={354}
                    src={functions[next].imageUrl} 
                    alt="暗記カードの機能" 
                    className={styles.thiC_ImageTb}
                    />
                  </Box>
                  <Box className={styles.thiC_textBoxRightTb}>
                    <Box className={styles.thiC_textContainerTb}>
                      <Box className={styles.thiC_textBoxTb}>
                        <Typography
                        className={styles.thiC_textTitleTb}
                        >
                          { functions[next].title }
                        </Typography>
                        <Typography
                        className={styles.thiC_descriptionTb}
                        >
                          { functions[next].description }
                        </Typography>
                        <List className={styles.thiC_pageTb}>
                          {
                              functions.map((func: functionType) => (
                                  <ListItem
                                  key={func.title}
                                  className={styles.thiC_pageTbCircleTb}
                                  sx={
                                      func.id === next ? {
                                          backgroundColor: "rgb(234, 87, 30) !important"
                                      } : {}
                                  }
                                  ></ListItem>
                              ))
                          }
                        </List>
                        <Button
                        id="nextButton"
                        className={`${styles.thiC_nextTb} ${notoSansJP.className}`}
                        onClick={handleNext}
                        >
                            Next
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box className={styles.thiC_contentsSp}>
                  <Box className={styles.thiC_ImageContainerSp}>
                    {
                        textStatus ? (
                            <>
                            <Box className={styles.thiC_descriptionBoxSp}>
                                <Typography
                                className={styles.thiC_TitleSp}
                                >
                                    { functions[next].title }
                                </Typography>
                                <Typography
                                className={styles.thiC_descriptionSp}
                                >
                                    { functions[next].description }   
                                </Typography>
                            </Box>
                            </>
                        ) : (
                            <Image 
                            width={500}
                            height={434}
                            alt="暗記機能紹介"
                            src={functions[next].imageUrl}
                            className={styles.thiC_ImageSp}
                            />
                        )
                    }
                  </Box>
                  <Box className={styles.thiC_actionBtnSp}>
                    <Button
                    className={styles.thiC_switch}
                    onClick={handleSwitch}
                    >
                        切替
                    </Button>
                    <Button
                        id="nextButton"
                        className={`${styles.thiC_nextSp} ${notoSansJP.className}`}
                        onClick={handleNext}
                        >
                            Next
                     </Button>
                  </Box>
                </Box>
            </Box>
        </Box>
        </>
    )
};

export default ThirdContent;