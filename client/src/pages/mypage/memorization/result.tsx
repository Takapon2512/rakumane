import React from 'react';
import { GetServerSideProps } from 'next';

//lib
import { apiClient } from '@/lib/apiClient';

//MUI
import { Box } from '@mui/material';

//CSS
import styles from "./result.module.scss";

//type
import { WordDBType } from '@/types/globaltype';
type Props = {
    words: WordDBType[]
}

//Component
import Layout from '@/components/layout/layout';
import TestResult from '@/components/memorizeComponent/TestResult';

//SSR
export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const token: string | undefined = context.req.headers.cookie?.split('=')[1];
        const response = await apiClient.get("/word/get_result", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });

        return {
            props: { words: response.data.results }
        }

    } catch (err) {
        console.error(err);
        return {
            notFound: true
        };
    }
};

const result = ({ words }: Props) => {
    return (
        <Layout>
            <Box className={styles.memorize}>
                <Box className={styles.memorize_container}>
                    <TestResult todayWords={words} />
                </Box>
            </Box>
        </Layout>
    );
};

export default result;