import React from 'react';
import { useRouter } from 'next/router';

//lib
import { apiClient } from '@/lib/apiClient';

//context
import { useAuth } from '@/context/auth';

//MUI
import { 
    Box, 
    Typography, 
    Button 
} from "@mui/material";

//CSS
import styles from "./index.module.scss";

//utils
import { notoSansJP } from '@/utils/font';


const Unsubscribe = () => {
    const router = useRouter();
    const { logout, user } = useAuth();
    const handleUnsubscribe = async () => {

        try {
            await apiClient.post("/user/unsubscribe", { user: user });
            
            logout();
            router.push("/");
        } catch (err) {
            console.error(err);
        };
    };

    return (
        <Box className={styles.unsubscribe}>
            <Typography className={`${styles.unsubscribe_title} ${notoSansJP.className}`}>
                退会手続き
            </Typography>
            <Box className={styles.unsubscribe_container}>
                <Button
                className={`${notoSansJP.className} ${styles.unsubscribe_button}`}
                onClick={handleUnsubscribe}
                >
                    退会
                </Button>
            </Box>
        </Box>
    );
};

export default Unsubscribe;