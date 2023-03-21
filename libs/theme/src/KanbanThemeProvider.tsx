import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { useEffect } from 'react';
import { Flip, ToastContainer } from 'react-toastify';
import { generateTheme } from './theme';
import { ModeType } from './modeContext/mode.interface';
import ModeContextProvider, {
  useMode,
} from './modeContext/ModeContextProvider';

const TempApp = ({ children }: { children: React.ReactNode }) => {
  const { activeMode, modeDispatch } = useMode();

  useEffect(() => {
    const mode = (localStorage.getItem('activeTheme') as ModeType) ?? 'light';
    modeDispatch({ type: mode === 'dark' ? 'USE_DARK' : 'USE_LIGHT' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={generateTheme(activeMode)}>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        transition={Flip}
      />
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export function KanbanThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModeContextProvider>
      <TempApp>{children}</TempApp>
    </ModeContextProvider>
  );
}

export default KanbanThemeProvider;
