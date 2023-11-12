import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Alert, Card, CardActionArea, CardContent, CardMedia, Chip, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { CSSProperties, useState } from "react";
import get_pkg_name from "../utils/pkg-name";
import { useAsync } from "react-use";

export default function Showcase() {
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

  return <>
    <Typography variant='h4' component='h1'>
      Available Packages
    </Typography>
    <Grid container spacing={isxs ? 1 : 2}>
      {items.map(item => <Grid xs={6} md={3}>
        <PkgCard key={item.project} {...item} />
      </Grid>)}
      {(loading || hasNextPage) && <Grid xs={12} ref={sentryRef}><Skeleton /></Grid>}
      {error && <Grid xs={12}><Alert severity='error'>{error.message}</Alert></Grid>}
    </Grid>
  </>
}

interface Package {
  name?: string
  project: string
  birthtime: string
  description?: string
  labels?: string[]
}

function useLoadItems() {
  const [index, setIndex] = useState(0);

  const async = useAsync(async () => {
    const rsp = await fetch('https://pkgx.dev/pkgs/index.json')
    if (!rsp.ok) throw new Error(rsp.statusText)
    const data = await rsp.json() as Package[]
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

function PkgCard({project, description, name, labels}: Package) {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  const text_style: CSSProperties = {whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}
  const columnCount = isxs ? 2 : 3
  const columnWidth = isxs ? (window.innerWidth - 28) / 2 : 300

  const chips = (labels ?? []).map(label => <Chip sx={{ml: 0.5}} label={label} color='secondary' variant="outlined" size='small' />)

  return (
    <Card>
      <CardActionArea href={`/pkgs/${project}/`}>
        <CardMedia
          height={columnWidth}
          component='img'
          image={`https://gui.tea.xyz/prod/${project}/512x512.webp`}
        />
        <CardContent>
          <div>
            <Typography variant='overline' component="h2" style={text_style} display='inline'>
              {name || get_pkg_name(project)}
            </Typography>
            {chips}
          </div>
          <Typography variant='caption' component="h3" style={text_style}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}