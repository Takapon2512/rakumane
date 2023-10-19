import React from 'react';
import { GetServerSideProps } from 'next';

//lib
import { apiClient } from '@/lib/apiClient';

//MUI
import { Box } from '@mui/material';

//CSS
import styles from "./index.module.scss";

//Component
import Layout from '@/components/layout/layout';
import WordCard from '@/components/memorizeComponent/WordCard';

//type
import { WordDBType } from '@/types/globaltype';
type Props = {
  words: WordDBType[]
};

//SSR
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const token: string | undefined = context.req.headers.cookie?.split('=')[1];
    const response = await apiClient.get("/word/db_search_memorize", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      props: { words: response.data.words }
    }
  } catch (err) {
    console.error(err);
    return {
      notFound: true
    };
  };
};

const Memorize = ({ words }: Props) => {

  return (
    <Layout>
      <Box className={styles.memorize}>
        <Box className={styles.memorizeContainer}>
          <WordCard todayWords={words} />
        </Box>
      </Box>
    </Layout>
  )
};

export default Memorize;