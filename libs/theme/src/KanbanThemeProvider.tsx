import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Flip, ToastContainer } from 'react-toastify';
import { generateTheme } from './theme';

export function KanbanThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const mode =
      (localStorage.getItem('activeTheme') as 'light' | 'dark') ?? 'light';
    setMode(mode);
  }, []);
  return (
    <ThemeProvider theme={generateTheme(mode)}>
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
}

export default KanbanThemeProvider;
