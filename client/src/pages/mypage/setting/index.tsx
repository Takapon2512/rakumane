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
import { SettingType } from '@/types/globaltype';
type Props = {
  setting: SettingType
};

//Component
import Layout from '@/components/layout/layout';
import Question from '@/components/settingComponents/Question';
import Address from '@/components/settingComponents/Address';
import Unsubscribe from '@/components/settingComponents/Unsubscribe';

//SSRでDBにある設定情報を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const token: string | undefined = context.req.headers.cookie?.split("=")[1];
    const response = await apiClient.get("/user/find_setting", {
      headers: {
        Authorization: `Barer ${token}`
      },
    });

    return {
      props: {
        setting: response.data.setting
      }
    };

  } catch (err) {
    console.error(err);

    return {
      notFound: true
    }
  }
};

const Setting = ({ setting }: Props) => {
  return (
    <Layout>
      <Box className={styles.setting}>
        <Box className={styles.setting_container}>
          <Address />
          <Question setting={setting} />
          <Unsubscribe />
        </Box>
      </Box>
    </Layout>
  )
}

export default Setting;