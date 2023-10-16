import React from 'react';
import { GetServerSideProps } from 'next';

//lib
import { apiClient } from '@/lib/apiClient';

//MUI
import { 
  Box,
} from '@mui/material';

//CSS
import styles from './index.module.scss';

//type
import { WordDBType } from '@/types/globaltype';
type Props = {
  words: WordDBType[]
}

//Component
import Layout from '@/components/layout/layout';
import SearchWords from '@/components/FreeComponent/SearchWords';

//SSR
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const token: string | undefined = context.req.headers.cookie?.split('=')[1];
    const response = await apiClient.get("/word/search", {
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

const Free = ({ words }: Props) => {

  return (
    <Layout>
      <Box className={styles.free}>
        <Box className={styles.free_container}>
          <SearchWords dbWords={words} />
        </Box>
      </Box>
    </Layout>
  );
};

export default Free;