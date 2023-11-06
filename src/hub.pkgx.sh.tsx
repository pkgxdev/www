import { ThemeProvider, useTheme } from '@mui/material/styles';
import { Button, CssBaseline, Stack, useMediaQuery } from '@mui/material';
import HeroTypography from "./components/HeroTypography"
import * as ReactDOM from 'react-dom/client';
import Masthead from "./components/Masthead";
import Footer from "./components/Footer";
import Stars from './components/Stars';
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
      <Footer />
    </Stack>
  )
}

function Hero() {
  return <HeroTypography>ScriptHub</HeroTypography>
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
