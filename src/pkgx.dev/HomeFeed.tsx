import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useTheme, ButtonBase, Paper, Stack, Typography, useMediaQuery, Alert, Card, CardActionArea, CardMedia, Box, Chip, CardContent, Skeleton } from '@mui/material';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import HeroTypography from '../components/HeroTypography';
import pkgxsh_txt from "../assets/pkgxsh.text.svg";
import ossapp_txt from "../assets/ossapp.text.svg";
import { useState, CSSProperties } from 'react';
import mash_txt from "../assets/mash.text.svg";
import pkgxsh from "../assets/pkgxsh.svg";
import ossapp from "../assets/ossapp.svg";
import FeedItem from '../utils/FeedItem';
import mash from "../assets/mash.svg";
import { useAsync } from 'react-use';

export default function HomeFeed() {
  return <>
    <Stack textAlign='center'>
      <Typography variant='overline'>We are Crafters of Fine</Typography>
      <HeroTypography>
        Open Source
      </HeroTypography>
    </Stack>

    <Grid container spacing={{xs: 1, md: 2}} textAlign='center'>
      <Grid xs={12} md={4}>
        <ButtonBase href='https://pkgx.sh'>
          <Paper variant='outlined' sx={{p: 4, width: '348px', height: '183px', py: '34px'}}>
            <Stack direction='column' spacing={2}>
              <img src={pkgxsh} height='33px' />
              <img src={pkgxsh_txt} height='34px' />
              <Typography variant='subtitle1' style={{marginTop: 5}}>
                Blazingly Fast Package Runner
              </Typography>
            </Stack>
          </Paper>
        </ButtonBase>
      </Grid>
      <Grid xs={12} md={4}>
        <ButtonBase href='https://mash.pkgx.sh'>
          <Paper variant='outlined' sx={{p: 4, width: '348px', height: '183px', py: '34px'}}>
            <Stack direction='column' spacing={2}>
              <img src={mash} height='33px' />
              <img src={mash_txt} height='17px' style={{marginTop: 23}} />
              <Typography variant='subtitle1' style={{marginTop: 12}}>
                The Package Manager for Scripts
              </Typography>
            </Stack>
          </Paper>
        </ButtonBase>
      </Grid>
      <Grid xs={12} md={4}>
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
    {items.map(item => <Grid xs={6} md={3}>
      <FeedItemBox {...item} />
    </Grid>)}
    {(loading || hasNextPage) && <Grid xs={12} ref={sentryRef}><Skeleton /></Grid>}
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
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  const { url, title, image, description, type } = item
  const text_style: CSSProperties = {whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}

  if (type == 'pkg') return

  const color = (() => {
    switch (type) {
      case 'blog': return 'secondary'
      case 'script': return 'primary'
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

  // the author of rye is strangely hostile to our project
  const imgsrc = title == 'rye' ? undefined : image


  return (
    <Card
      variant={color ? 'outlined' : undefined}
      raised={!!color}
      sx={{ borderColor, borderWidth }}
    >
      <CardActionArea href={url}>
        <CardMedia
          height={isxs ? 150 : 300}
          component={Box}
          image={imgsrc}
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
          <Typography variant='caption' component="h3" style={text_style}>
            {/* {description} */}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
