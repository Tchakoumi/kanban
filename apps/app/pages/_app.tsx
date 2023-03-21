import { CacheProvider, EmotionCache } from '@emotion/react';
import { KanbanThemeProvider } from '@kanban/theme';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.css';
import createEmotionCache from '../config_mui/createEmotionCache';
import './globalStyles.css';

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
        <KanbanThemeProvider>
          <Component {...pageProps} />
        </KanbanThemeProvider>
      </CacheProvider>
    </>
  );
}

export default CustomApp;
