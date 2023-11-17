import { ThemeProvider, useTheme } from '@mui/material/styles';
import { Button, CssBaseline, Stack, useMediaQuery } from '@mui/material';
import { RunAnything, RunAnywhere, Dev, Trusted, Quote } from "./pkgx.sh/Landing";
import React from "react";
import * as ReactDOM from 'react-dom/client';
import theme from './utils/theme';
import Masthead from "./components/Masthead";
import Footer from "./components/Footer";
import Hero from "./pkgx.sh/Hero";
import './assets/main.css';
import Stars from './components/Stars';
import Discord from './components/Discord';

function Body() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack maxWidth='md' p={isxs ? 1 : 4} spacing={isxs ? 8 : 16} mx='auto'>
      <MyMasthead />
      <Hero />
      <RunAnything />
      <Quote />
      <RunAnywhere />
      <Dev />
      <Trusted />
      <Footer />
    </Stack>
  )
}

function MyMasthead() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));
  const size = isxs ? 'small' : undefined

  return <Masthead>
    <Button href='https://docs.pkgx.sh' color='inherit' size={size}>docs</Button>
    <Button href='https://pkgx.dev/pkgs/' color='inherit' size={size}>pkgs</Button>
    <Discord />
    <Stars hideCountIfMobile />
  </Masthead>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Body />
    </ThemeProvider>
  </React.StrictMode>,
);
