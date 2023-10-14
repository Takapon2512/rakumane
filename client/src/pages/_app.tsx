import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { StyledEngineProvider } from '@mui/material'
import { AuthProvider } from '@/context/auth';
import { RecoilRoot } from 'recoil';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <RecoilRoot>
      <AuthProvider>
          <StyledEngineProvider injectFirst>
            <Component {...pageProps} />
          </StyledEngineProvider>
      </AuthProvider>
    </RecoilRoot>
    </>
  );
};
