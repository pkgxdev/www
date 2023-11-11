import { ThemeProvider } from '@mui/material/styles';
import { useTheme, CssBaseline, Box, Button, Stack, Typography, Paper, ButtonBase, useMediaQuery, Link, Alert, Card, CardActionArea, CardContent, CardMedia, Chip } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PackageShowcase from './pkgx.dev/PackageShowcase';
import PackageListing from './pkgx.dev/PackageListing';
import PrivacyPolicy from './pkgx.dev/PrivacyPolicy';
import pkgxsh_txt from "./assets/pkgxsh.text.svg";
import ossapp_txt from "./assets/ossapp.text.svg";
import TermsOfUse from './pkgx.dev/TermsOfUse';
import * as ReactDOM from 'react-dom/client';
import Masthead from './components/Masthead';
import logo from "./assets/pkgx.purple.svg";
import Footer from "./components/Footer";
import pkgxsh from "./assets/pkgxsh.svg";
import ossapp from "./assets/ossapp.svg";
import Search from './components/Search';
import Stars from './components/Stars';
import theme from './utils/theme';
import React, { CSSProperties, useState } from "react";
import './assets/main.css';
import { useAsync } from 'react-use';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import FeedItem from "./utils/FeedItem"
import { InstantSearch } from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch('UUTLHX01W7', '819a841ca219754c38918b8bcbbbfea7');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Stack direction="column" p={2} maxWidth='lg' minHeight='100vh' mx='auto' spacing={4}>
          <Masthead>
            <InstantSearch searchClient={searchClient} indexName="pkgs">
              <Search />
            </InstantSearch>
            <Button href='/pkgs/' color='inherit'>pkgs</Button>
            <Stars href={`https://github.com/pkgxdev/`} />
          </Masthead>
          <Routes>
            <Route path='/' element={<Body />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy/>} />
            <Route path='/terms-of-use' element={<TermsOfUse/>} />
            <Route path='/pkgs' element={<>
              <Typography variant='h4' component='h1'>
                New Packages
              </Typography>
              <PackageShowcase />
            </>} />
            <Route path='/pkgs/*' element={<PackageListing/>} />
          </Routes>
          <Footer/>
        </Stack>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
);

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import HeroTypography from './components/HeroTypography';

function Body() {
  return <>
    <HeroTypography>
      Crafters of Fine Open Source Products
    </HeroTypography>

    <Grid container spacing={2} textAlign='center'>
      <Grid xs={12} md={6}>
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
      <Grid xs={12} md={6}>
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

    <Typography variant='h4' sx={{"&&": {mt: 12}}} component='h1'>
      What’s New?
    </Typography>

    <Feed />
  </>
}

function Feed() {
  const { loading, items, hasNextPage, error, loadMore } = useLoadItems();

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMore,
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: !!error,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 800px 0px',
    delayInMs: 0
  });

  return <Grid container>
    {items.map(item => <Grid xs={3}>
      <FeedItemBox {...item} />
    </Grid>)}
    {(loading || hasNextPage) && <Grid xs={12} ref={sentryRef}>Skeleton</Grid>}
    {error && <Grid xs={12}><Alert severity='error'>{error.message}</Alert></Grid>}
  </Grid>
}

function useLoadItems() {
  const [index, setIndex] = useState(0);

  const async = useAsync(async () => {
    const rsp = await fetch('https://pkgx.dev/index.json')
    if (!rsp.ok) throw new Error(rsp.statusText)
    const data = await rsp.json() as FeedItem[]
    setIndex(Math.min(data.length, 25))
    return data
  });

  return {
    loading: async.loading,
    items: (async.value ?? []).slice(0, index),
    hasNextPage: async.value ? index < async.value.length : false,
    error: async.error,
    loadMore: () => setIndex(index => Math.min(index + 25, async.value?.length ?? 0))
  }
}

function FeedItemBox(item: FeedItem) {
  const { url, title, image, description, type } = item
  const text_style: CSSProperties = {whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}

  if (type == 'blog') {
    console.log(item)
  }

  return (
    <Card sx={{m: 0.75, height: '100%'}}>
      <CardActionArea href={url}>
        <CardMedia
          height={300}
          component={Box}
          image={image}
          textAlign='right'
        >
          {type !== 'pkg' && <Chip sx={{m: 1}} label={type} color='primary' variant='filled' size='small' />}
        </CardMedia>
        <CardContent>
          <div>
            <Typography variant='overline' component="h2" style={text_style} display='inline'>
              {title}
            </Typography>
          </div>
          <Typography variant='caption' component="h3" style={text_style}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}