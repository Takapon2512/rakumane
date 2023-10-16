import React from 'react';
import { 
    CircularProgress, 
    CircularProgressProps,
    Box,
    Typography,
    circularProgressClasses
} from '@mui/material';

import { notoSansJP } from '@/utils/font';

const CirculerProgressWithLabel = (
    props: CircularProgressProps & { value: number, remaintime: number }
) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress 
            variant='determinate'
            size={48} 
            thickness={5.0}
            value={100}
            sx={{
                color: (theme) =>
                    theme.palette.grey[300]
            }}
            />
            <CircularProgress 
            variant="determinate" 
            size={48} 
            thickness={5.0} 
            sx={{
                position: "absolute",
                left: "0",
                [`& .${circularProgressClasses.circle}`]: {
                    strokeLinecap: 'round',
                },
            }}
            {...props} />
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
                sx={{userSelect: "none"}}
                >
                    { props.remaintime }
                </Typography>
            </Box>
        </Box>
    );
};

const CircularWithValueLabel = ({ currentTime, initValue }: { currentTime: number, initValue: number }) => {
    const init: number = 100 / initValue;
    const remainGuage: number = currentTime * init;

    return <CirculerProgressWithLabel value={remainGuage} remaintime={currentTime} />;
}

export default CircularWithValueLabel;