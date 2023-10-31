import { ThemeProvider } from '@mui/material/styles';
import { useTheme, CssBaseline, Box, Grid, Button, Stack, Typography, Paper, ButtonBase, useMediaQuery, Link } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PackageShowcase from './pkgx.dev/PackageShowcase';
import PackageListing from './pkgx.dev/PackageListing';
import pkgxsh_txt from "./assets/pkgxsh.text.svg";
import ossapp_txt from "./assets/ossapp.text.svg";
import * as ReactDOM from 'react-dom/client';
import Masthead from './components/Masthead';
import logo from "./assets/pkgx.purple.svg";
import PrivacyPolicy from './PrivacyPolicy';
import Footer from "./components/Footer";
import pkgxsh from "./assets/pkgxsh.svg";
import ossapp from "./assets/ossapp.svg";
import Stars from './components/Stars';
import TermsOfUse from './TermsOfUse';
import theme from './utils/theme';
import React from "react";
import './main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path='/' element={<Body />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy/>} />
          <Route path='/terms-of-use' element={<TermsOfUse/>} />
          <Route path='/pkgs' element={<PackageListingFrame>
            <Typography variant='h4' component='h1'>
              New Packages
            </Typography>
            <PackageShowcase />
          </PackageListingFrame>} />
          <Route path='/pkgs/*' element={<PackageListingFrame>
              <PackageListing/>
          </PackageListingFrame>} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
);

function PackageListingFrame({children}: {children: React.ReactNode}) {
  return <Stack direction="column" width='fit-content' minWidth='md' p={2} minHeight='100vh' mx='auto' spacing={4}>
    <Masthead>
      <Button href='/pkgs/' color='inherit'>pkgs</Button>
      <Stars />
    </Masthead>
    {children}
    <Footer/>
  </Stack>
}

function Body() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return <Stack direction="column" width={isxs ? undefined : 'min-content'} maxWidth='md' sx={{p: 2, minHeight: '100vh'}} mx='auto' spacing={4} alignItems='center'>

    <Box flexGrow={1} />

    <Stack direction="column" spacing={4} pb={4}>
      <Box component='img' src={logo} height={111.45}/>
      <Typography variant="h2" my={6} fontWeight='regular' textAlign='center' fontSize={20} letterSpacing={0.4}>
        Crafters of fine open source products
      </Typography>
    </Stack>

    <Box display='inline-block' width='max-content'>
      <Grid container spacing={2} textAlign='center'>
        <Grid item xs={12} md={6}>
          <ButtonBase href='https://pkgx.sh'>
            <Paper variant='outlined' sx={{p: 4, width: '348px', height: '183px', py: '34px'}}>
              <Stack direction='column' spacing={2}>
                <img src={pkgxsh} height='33px' />
                <img src={pkgxsh_txt} height='34px' />
                <Typography variant='subtitle1' style={{marginTop: 5}}>
                  Blazingly fast, standalone pkg runner
                </Typography>
              </Stack>
            </Paper>
          </ButtonBase>
        </Grid>
        <Grid item xs={12} md={6}>
          <ButtonBase href='https://pkgx.app'>
            <Paper variant='outlined' sx={{p: 4, width: '348px', height: '183px', py: '34px'}}>
              <Stack direction='column' spacing={2}>
                <img src={ossapp} height='33px' />
                <img src={ossapp_txt} height='19px' style={{marginTop: 23}} />
                <Typography variant='subtitle1' style={{marginTop: 13}}>
                  The Open Source App Store
                </Typography>
              </Stack>
            </Paper>
          </ButtonBase>
        </Grid>
      </Grid>
    </Box>

    <Stack direction={isxs ? 'column' : 'row'} spacing={isxs ? 2 : 4} alignItems='center'>
      <Typography>Stay in the loop. Check out our <Link color='inherit' underline='always' style={{textDecoration: 'underline'}} href="https://blog.pkgx.dev">blog</Link>.</Typography>
    </Stack>

    <Box flexGrow={1} />

    <Footer />
  </Stack>
}
