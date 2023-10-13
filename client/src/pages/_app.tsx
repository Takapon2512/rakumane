import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { StyledEngineProvider } from '@mui/material'
import { AuthProvider } from '@/context/auth'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <AuthProvider>
      <StyledEngineProvider injectFirst>
        <Component {...pageProps} />
      </StyledEngineProvider>
    </AuthProvider>
    </>
  );
};
