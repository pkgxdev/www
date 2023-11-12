import { CssBaseline, Button, Stack, Typography, ThemeProvider } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PackageShowcase from './pkgx.dev/PackageShowcase';
import PackageListing from './pkgx.dev/PackageListing';
import PrivacyPolicy from './pkgx.dev/PrivacyPolicy';
import { InstantSearch } from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import TermsOfUse from './pkgx.dev/TermsOfUse';
import * as ReactDOM from 'react-dom/client';
import Masthead from './components/Masthead';
import HomeFeed from './pkgx.dev/HomeFeed';
import Footer from "./components/Footer";
import Search from './components/Search';
import Stars from './components/Stars';
import theme from './utils/theme';
import React, {  } from "react";
import './assets/main.css';

const searchClient = algoliasearch('UUTLHX01W7', '819a841ca219754c38918b8bcbbbfea7');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Stack direction="column" p={{xs: 1, md: 2}} maxWidth='lg' minHeight='100vh' mx='auto' spacing={4}>
          <Masthead>
            <Button href='/pkgs/' color='inherit'>pkgs</Button>
            <Stars href={`https://github.com/pkgxdev/`} hideCountIfMobile={true} />
            <InstantSearch searchClient={searchClient} indexName="pkgs">
              <Search />
            </InstantSearch>
          </Masthead>
          <Routes>
            <Route path='/' element={<HomeFeed />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy/>} />
            <Route path='/terms-of-use' element={<TermsOfUse/>} />
            <Route path='/pkgs' element={<PackageShowcase />} />
            <Route path='/pkgs/*' element={<PackageListing/>} />
          </Routes>
          <Footer/>
        </Stack>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
);
