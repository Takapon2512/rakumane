import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

//lib
import { apiClient } from '@/lib/apiClient';

//MUI
import { Box } from '@mui/material';

//CSS
import styles from './index.module.scss';

//type
import { WordDBType } from '@/types/globaltype';
type Props = {
  words: WordDBType[];
  todayWords: WordDBType[];
  token: string | undefined;
};

//Component
import Layout from '@/components/layout/layout';
import WordRegisterInput from '@/components/mypageComponent/WordRegisterInput';
import RegisterList from '@/components/mypageComponent/RegisterList';
// import TodayList from '@/components/mypageComponent/TodayList/TodayList';

//SSRでDBの単語を取得
export const getServerSideProps: GetServerSideProps = async (context) => {

  try {
    const token: string | undefined = context.req.headers.cookie?.split('=')[1];
    const response = await apiClient.get("/word/db_search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    //「today_learning」がtrueの単語を取得
    // const response_today = await apiClient.get("/posts/db_search_memorize", {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    return {
      props: {
        words: response.data.words,
        // todayWords: response_today.data
      },
    };

  } catch (err) {
    console.error(err);
    return {
      notFound: true
    };
  };
};

const Mypage = ({ words, todayWords }: Props) => {

  return (
      <>
      <Layout>
          <Box 
          className={styles.home}
          sx={{
            width: { xs: "100vw", md: "calc(100vw - 248px)" }
          }}
          >
              <Box sx={{ maxWidth: { xs: "100%", md: "80%" }, margin: "auto" }}>
                <WordRegisterInput dbWords={words}/>
                <RegisterList dbWords={words} />
                {/* <TodayList dbWords={todayWords} /> */}
              </Box>
          </Box>
      </Layout>
      </>
  );
};

export default Mypage;