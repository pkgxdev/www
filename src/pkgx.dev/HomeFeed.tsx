import Grid from '@mui/material/Grid2';
import { useTheme, Stack, Typography, useMediaQuery, Alert, Card, CardActionArea, CardMedia, Box, Chip, CardContent, Skeleton } from '@mui/material';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import HeroTypography from '../components/HeroTypography';
import { useState, CSSProperties } from 'react';
import FeedItem from '../utils/FeedItem';
import { useAsync } from 'react-use';
import img_pkgx from "../assets/pkgx.webp";
import img_mash from "../assets/mash.webp";
import img_teaBASE from "../assets/teaBASE.webp";
import img_unpkg from "../assets/unpkg.webp";
import img_pkgm from "../assets/pkgm.webp";
import img_dev from "../assets/dev.webp";

export default function HomeFeed() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return <>
    <Stack textAlign='center' sx={{pb: 6}}>
      <Typography variant='overline'>We are Crafters of Fine</Typography>
      <HeroTypography>
        Open Source
      </HeroTypography>
    </Stack>

    <Grid container spacing={{xs: 1, md: 2}}>
      <Grid size={{xs: 6, md: 4}}>
        <Card raised={true} sx={{ height: '100%' }}>
          <CardActionArea href='https://github.com/pkgxdev/pkgx' sx={{ height: '100%' }}>
            <CardContent sx={isxs ? {p: 0.75} : undefined}>
              <Typography variant='h3' component="h2" style={{fontFamily: 'shader', textTransform: 'uppercase'}}>
                pkgx
              </Typography>
              <Typography variant='caption' component="h3" style={{fontSize: "1em"}}>
                Fast, small, package runner.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid size={{xs: 6, md: 4}}>
        <Card raised={true} sx={{ height: '100%' }}>
          <CardActionArea href='https://github.com/pkgxdev/pkgm' sx={{ height: '100%' }}>
            <CardContent sx={isxs ? {p: 0.75} : undefined}>
              <Typography variant='h3' component="h2" style={{fontFamily: 'shader', textTransform: 'uppercase'}}>
                pkgm
              </Typography>
              <Typography variant='caption' component="h3" style={{fontSize: "1em"}}>
                Install <code>pkgx</code> packages to <code>/usr/local</code>.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid size={{xs: 6, md: 4}}>
        <Card raised={true} sx={{ height: '100%' }}>
          <CardActionArea href='https://github.com/pkgxdev/dev' sx={{ height: '100%' }}>
            <CardContent sx={isxs ? {p: 0.75} : undefined}>
            <Typography variant='h3' component="h2" style={{fontFamily: 'shader', textTransform: 'uppercase'}}>
                dev
              </Typography>
              <Typography variant='caption' component="h3" style={{fontSize: "1em"}}>
                Isolated, reproducible development environments.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid size={{xs: 6, md: 4}}>
        <Card raised={true} sx={{ height: '100%' }}>
          <CardActionArea href='https://github.com/pkgxdev/mash' sx={{ height: '100%' }}>
            <CardContent sx={isxs ? {p: 0.75} : undefined}>
              <Typography variant='h3' component="h2" style={{fontFamily: 'shader', textTransform: 'uppercase'}}>
                mash
              </Typography>
              <Typography variant='caption' component="h3" style={{fontSize: "1em"}}>
                The package manager for scripts.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid size={{xs: 6, md: 4}}>
        <Card raised={true}>
          <CardActionArea href='https://github.com/pkgxdev/pkgo' sx={{ height: '100%' }}>
            <CardContent sx={isxs ? {p: 0.75} : undefined}>
              <Typography variant='h3' component="h2" style={{fontFamily: 'shader', textTransform: 'uppercase'}}>
                pkgo
              </Typography>
              <Typography variant='caption' component="h3" style={{fontSize: "1em"}}>
                Package…GO! Run typically unpackagable OSS in sandboxes.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid size={{xs: 6, md: 4}}>
        <Card raised={true} sx={{ height: '100%' }}>
          <CardActionArea href='https://github.com/pkgxdev/mcp' sx={{ height: '100%' }}>
            <CardContent sx={isxs ? {p: 0.75} : undefined}>
              <Typography variant='h3' component="h2" style={{fontFamily: 'shader', fontVariant: 'small-caps'}}>
                pkgxMCP
              </Typography>
              <Typography variant='caption' component="h3" style={{fontSize: "1em"}}>
                Can your LLM run anything? Now it can.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid size={{xs: 6, md: 4}}>
        <Card raised={true}>
          <CardActionArea href='https://github.com/teaxyz/teaBASE' sx={{ height: '100%' }}>
            <CardContent sx={isxs ? {p: 0.75} : undefined}>
              <Typography variant='h3' component="h2" style={{fontFamily: 'shader', fontVariant: 'small-caps'}}>
                teaBASE
              </Typography>
              <Typography variant='caption' component="h3" style={{fontSize: "1em"}}>
                The Developer Cockpit.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>

    <Typography variant='h4' sx={{"&&": {mt: 12}}} component='h1'>
      What’s New?
    </Typography>

    <Feed />
  </>
}

function Feed() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

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

  return <Grid container spacing={isxs ? 1 : 2}>
    {items.map(item => <Grid size={{xs: 6, md: 3}}>
      <FeedItemBox {...item} />
    </Grid>)}
    {(loading || hasNextPage) && <Grid size={12} ref={sentryRef}><Skeleton /></Grid>}
    {error && <Grid size={12}><Alert severity='error'>{error.message}</Alert></Grid>}
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
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  const { url, title, description, type, image } = item
  const text_style: CSSProperties = {whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}

  const color = (() => {
    switch (type) {
      case 'blog': return 'secondary'
      case 'mash': return 'primary'
    }
  })()

  const borderColor = color ? `${color}.main` : undefined
  const borderWidth = color ? 2 : undefined

  const chip = color && <Chip
    label={type} color={color} variant='filled' size='small'
    sx={{
      m: isxs ? 0.5 : 1,
      color: color == 'secondary' ? 'background.default' : undefined,
      fontVariant: 'small-caps'
    }} />

  return (
    <Card
      variant={color ? 'outlined' : undefined}
      raised={!!color}
      sx={{ borderColor, borderWidth, height: '100%' }}
    >
      <CardActionArea href={url} sx={{ height: '100%' }}>
        <CardMedia
          height={isxs ? 150 : undefined}
          sx={{aspectRatio: isxs ? undefined : '1/1'}}
          component={Box}
          image={image}
          textAlign='right'
        >
          {chip}
        </CardMedia>
        <CardContent sx={isxs ? {p: 0.75} : undefined}>
          <div>
            <Typography variant='overline' component="h2" style={text_style}>
              {title}
            </Typography>
          </div>
          <Typography variant='caption' component="h3">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
