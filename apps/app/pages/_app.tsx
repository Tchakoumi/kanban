import { CacheProvider, EmotionCache } from '@emotion/react';
import { KanbanThemeProvider } from '@kanban/theme';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import createEmotionCache from '../config_mui/createEmotionCache';
import './globalStyles.css';
import { SWRConfig } from 'swr';
import { fetcher } from '../services';

interface CustomAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

function CustomApp(props: CustomAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  return (
    <>
      <Head>
        <title>Kanban</title>
        <link rel="icon" type="image/x-icon" href="favicon_colored.png" />
      </Head>
      <CacheProvider value={emotionCache}>
        <SWRConfig
          value={{
            refreshInterval: 3000,
            errorRetryInterval: 100,
            errorRetryCount: 3,
            shouldRetryOnError: false,
            fetcher,
          }}
        >
          <KanbanThemeProvider>
            <Component {...pageProps} />
          </KanbanThemeProvider>
        </SWRConfig>
      </CacheProvider>
    </>
  );
}

export default CustomApp;
