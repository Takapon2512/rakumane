import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

//lib
import { apiClient } from '@/lib/apiClient';

//MUI
import { Box } from "@mui/material";

//CSS
import styles from "./wordcard.module.scss";

//Components
import Layout from '@/components/layout/layout';
import WordCard from '@/components/FreeComponent/WordCard';

//type
import { WordDBType } from '@/types/globaltype';

//SSR
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const token: string | undefined = context.req.headers.cookie?.split("=")[1];
    const responseWords = await apiClient.get("/word/free_search", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      props: { 
        freeWords: responseWords.data.words
      }
    }

  } catch (err) {
    console.error(err);
    return {
      notFound: true
    }
  };
};

const WordCardPage = ({ freeWords }: { freeWords: WordDBType[] }) => {
  return (
    <>
    <Head>
      <title>暗記カード｜ラクマネイングリッシュ</title>  
    </Head>    
    <Layout>
      <Box className={styles.free}>
        <Box className={styles.free_container}>
          <WordCard freeWords={freeWords} />
        </Box>
      </Box>
    </Layout>
    </>
  )
}

export default WordCardPage;