import React from 'react';
import Head from 'next/head';
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
import TestResult from '@/components/FreeComponent/TestResult';

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
        <>
        <Head>
            <title>テスト結果｜ラクマネイングリッシュ</title>    
        </Head>
        <Layout>
            <Box className={styles.free}>
                <Box sx={{ maxWidth: "900px", margin: "auto" }}>
                    <TestResult dbWords={words}/>
                </Box>
            </Box>
        </Layout>
        </>
    );
};

export default result;