import React, { useState, useEffect } from 'react';

//MUI
import { 
    Box,
    Typography,
    CircularProgress,
    circularProgressClasses
} from '@mui/material';

//utils
import { notoSansJP } from '@/utils/font';

const CircularResultLabel = ({ correct, questionNum }: { correct: number, questionNum: number }) => {
    //表示する正答率
    const [displayRate, setDisplayRate] = useState<number>(0);
    console.log(correct);
    console.log(questionNum === 0 ? correct : questionNum);

    //正答率
    const correctRate: number = Math.ceil((correct / (questionNum === 0 ? 1 : questionNum)) * 100);

    useEffect(() => {
        if (displayRate <= correctRate) {
            const timer = setInterval(() => {
                setDisplayRate((prev) => prev < correctRate ? prev + 1 : correctRate);
            }, 40);
            return () => {
                clearInterval(timer);
            };
        };
    }, []);

    return (
        <>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress 
            variant='determinate'
            size={240} 
            thickness={5.6}
            value={100}
            sx={{
                color: (theme) =>
                    theme.palette.grey[300]
            }}
            />
            <CircularProgress 
            variant='determinate' 
            size={240} 
            thickness={5.6} 
            value={displayRate > 100 ? 0 : displayRate} 
            sx={{
                position: "absolute",
                left: "0",
                [`& .${circularProgressClasses.circle}`]: {
                    strokeLinecap: 'round',
                },
            }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
                    <Typography
                    component="div"
                    className={notoSansJP.className}
                    sx={{userSelect: "none", fontSize: "50px"}}
                    >
                        { `${displayRate}%` }
                    </Typography>
            </Box>
        </Box>
        </>
    );
};

export default CircularResultLabel;