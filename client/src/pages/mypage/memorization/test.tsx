import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

//lib
import { apiClient } from '@/lib/apiClient';

//MUI
import { Box } from '@mui/material';

//CSS
import styles from "./test.module.scss";

//Component
import Layout from '@/components/layout/layout';
import WordTest from '@/components/memorizeComponent/WordTest';

//type
import { WordDBType } from '@/types/globaltype';

//SSR
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const token: string | undefined = context.req.headers.cookie?.split("=")[1];
    const response = await apiClient.get("/user/find_setting", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const responseWords = await apiClient.get("/word/memorize_complete_test", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      props: { 
        timeConstraint: response.data.setting.time_constraint,
        words: responseWords.data.words
      }
    }

  } catch (err) {
    console.error(err);
    return {
      notFound: true
    }
  };
};

const Test = ({ timeConstraint, words }: { timeConstraint: number, words: WordDBType[] }) => {
  return (
    <>
    <Head>
      <title>単語テスト｜ラクマネイングリッシュ</title>
    </Head>
    <Layout>
        <Box 
        className={styles.memorize}>
            <Box className={styles.memorize_container}>
                <WordTest timeConstraint={timeConstraint} targetWords={words} />
            </Box>
        </Box>
    </Layout>
    </>
  );
};

export default Test;