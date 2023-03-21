import { createTheme } from '@mui/material/styles';
import React from 'react';
import { ModeType } from './modeContext/mode.interface';

// thin: 100
// extraLight: 200
// light: 300
// regular: 400
// medium: 500
// semiBold: 600
// bold: 700
// extraBold: 800
// black: 900
// 16px => 1rem

declare module '@mui/material/styles' {
  interface Theme {
    common: {
      black: React.CSSProperties['color'];
      white: React.CSSProperties['color'];
      very_dark_grey: React.CSSProperties['color'];
      dark_grey: React.CSSProperties['color'];
      medium_grey: React.CSSProperties['color'];
      light_grey: React.CSSProperties['color'];
      line_light: React.CSSProperties['color'];
      line_dark: React.CSSProperties['color'];
    };
  }
  interface ThemeOptions {
    common: {
      black: React.CSSProperties['color'];
      white: React.CSSProperties['color'];
      very_dark_grey: React.CSSProperties['color'];
      dark_grey: React.CSSProperties['color'];
      medium_grey: React.CSSProperties['color'];
      light_grey: React.CSSProperties['color'];
      line_light: React.CSSProperties['color'];
      line_dark: React.CSSProperties['color'];
    };
  }
  interface TypographyVariants {
    h1: React.CSSProperties;
    h2: React.CSSProperties;
    h3: React.CSSProperties;
    h4: React.CSSProperties;
    h5: React.CSSProperties;
    h6: React.CSSProperties;
    body1: React.CSSProperties;
    body2: React.CSSProperties;
    caption: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    h1: React.CSSProperties;
    h2: React.CSSProperties;
    h3: React.CSSProperties;
    body1: React.CSSProperties;
    body2: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1: true;
    h2: true;
    h3: true;
    body1: true;
    body2: true;
  }
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true; // adds the `mobile` breakpoint
    tablet: true;
    laptop: true;
    desktop: true;
  }
}

const MEDIUM_GREY = '#828FA3';
const LIGHT_GREY = '#F4F7FD';
const VERY_DARK_GREY = '#20212C';

export function generateTheme(mode?: ModeType) {
  return createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'dark' ? VERY_DARK_GREY : LIGHT_GREY,
      },
      primary: {
        main: '#635FC7',
        light: '#A8A4FF',
      },
      secondary: {
        main: '#FF9600',
      },
      error: {
        main: '#EA5555',
        light: '#FF9898',
      },
      success: {
        main: '#4BB543',
      },
      warning: {
        main: '#F0AD4E',
      },
    },
    common: {
      black: '#000112',
      white: '#FFFFFF',
      very_dark_grey: VERY_DARK_GREY,
      dark_grey: '#2B2C37',
      medium_grey: MEDIUM_GREY,
      light_grey: LIGHT_GREY,
      line_light: '#E4EBFA',
      line_dark: '#3E3F4E',
    },
    typography: {
      fontFamily: ['Plus Jakarta Sans', 'sans-serif'].join(','),
      h1: {
        fontSize: '1.5rem',
        fontWeight: 700,
        lineHeight: '30px',
      },
      h2: {
        fontSize: '1.125rem',
        fontWeight: 700,
        lineHeight: '23px',
      },
      body1: {
        fontSize: '0.94rem',
        fontWeight: 700,
        lineHeight: '19px',
      },
      body2: {
        fontSize: '0.75rem',
        fontWeight: 700,
        lineHeight: '15px',
        letterSpacing: '2.4px',
        color: MEDIUM_GREY,
      },
      caption: {
        fontSize: '0.8125rem',
        fontWeight: 500,
        lineHeight: '23px',
      },
      h3: {
        fontSize: '12px',
        fontWeight: 700,
        lineHeight: '15px',
      },
    },
    breakpoints: {
      values: {
        mobile: 0,
        tablet: 744,
        laptop: 992,
        desktop: 1200,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: '100px',
            textTransform: 'none',
            '&.MuiButton-containedPrimary:hover': {
              backgroundColor: theme.palette.primary.light,
            },
            '&.MuiButton-containedSecondary': {
              color: theme.palette.primary.main,
              backgroundColor:
                theme.palette.mode === 'light'
                  ? 'rgba(99, 95, 199, 0.1)'
                  : 'white',
            },
            '&.MuiButton-containedSecondary:hover': {
              backgroundColor:
                theme.palette.mode === 'light'
                  ? 'rgba(99, 95, 199, 0.25)'
                  : 'white',
            },
            '&.MuiButton-containedError:hover': {
              backgroundColor: theme.palette.error.light,
            },
          }),
        },
      },
    },
  });
}
