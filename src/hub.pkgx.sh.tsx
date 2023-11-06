import { Button, CssBaseline, Stack, useMediaQuery, ThemeProvider, useTheme } from '@mui/material';
import * as ReactDOM from 'react-dom/client';
import Masthead from "./components/Masthead";
import Landing from './hub.pkgx.sh/Landing';
import Footer from "./components/Footer";
import Stars from './components/Stars';
import Hero from './hub.pkgx.sh/Hero';
import theme from './utils/theme';
import './assets/main.css';
import React from "react";

function Body() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack maxWidth='md' p={isxs ? 1 : 4} spacing={isxs ? 8 : 16} mx='auto'>
      <MyMasthead />
      <Hero />
      <Landing />
      <Footer />
    </Stack>
  )
}

function MyMasthead() {
  return <Masthead>
    <Button href='https://docs.pkgx.sh' color='inherit'>docs</Button>
    <Button href='https://pkgx.dev/pkgs/' color='inherit'>pkgs</Button>
    <Button href='https://web.libera.chat/?channel=#pkgx' color='inherit'>irc</Button>
    <Stars />
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
