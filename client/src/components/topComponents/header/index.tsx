import React from "react";
import Image from "next/image";

//MUI
import { 
    Box,
    Link,
    Typography
} from "@mui/material";

//Font
import { notoSansJP } from "@/utils/font";

//CSS
import styles from './index.module.scss';

const Header = () => {
  return (
    <>
      <header 
      className={`${notoSansJP.className} ${styles.header}`}
      >
          <Box className={styles.header_container}>
              <Link href="/" className={styles.header_logo}>
                  <Image 
                  width={56} 
                  height={56} 
                  alt="RAKUMANE"
                  src="/svg/RakuMaNE.svg"
                  />
                  <Typography
                  className={notoSansJP.className}
                  sx={{ letterSpacing: "1px" }}
                  >
                      RAKUMANE
                  </Typography>
              </Link>
              <Box className={styles.header_buttons}>
                  <Link href='/login' className={styles.header_login}>ログイン</Link>
                  <Link href='/register' className={styles.header_register}>登録</Link>
              </Box>
          </Box>
      </header>
    </>
  );
};

export default Header;