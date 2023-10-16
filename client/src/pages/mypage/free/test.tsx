import React from 'react';
import { GetServerSideProps } from 'next';

//lib
import { apiClient } from '@/lib/apiClient';

//MUI
import { 
    Box,
} from '@mui/material';

//CSS
import styles from "./test.module.scss";

//Component
import Layout from '@/components/layout/layout';
import WordTest from '@/components/FreeComponent/WordTest';

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

    const responseWords = await apiClient.get("/word/free_complete_test", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });


    return {
      props: { 
        timeConstraint: response.data.setting.time_constraint,
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

const Test = ({ timeConstraint, freeWords }: { timeConstraint: number, freeWords: WordDBType[] }) => {
  console.log(timeConstraint);

  return (
    <Layout>
        <Box className={styles.free}>
            <Box sx={{ maxWidth: "900px", margin: "auto" }}>
                <WordTest timeConstraint={timeConstraint} freeWords={freeWords} />
            </Box>
        </Box>
    </Layout>
  )
};

export default Test;