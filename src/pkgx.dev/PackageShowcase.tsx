import Grid from "@mui/material/Unstable_Grid2/Grid2";
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { CSSProperties, useState } from "react";
import get_pkg_name from "../utils/pkg-name";
import { useAsync } from "react-use";

export default function Showcase() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down("md"));

  const { loading, items, hasNextPage, error, loadMore, total } =
    useLoadItems();

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
    rootMargin: "0px 0px 800px 0px",
    delayInMs: 0,
  });

  const count = total && (
    <Typography display="inline" color="text.secondary" variant="h6">
      {new Intl.NumberFormat().format(total)}
    </Typography>
  );

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        textAlign={isxs ? "center" : undefined}
      >
        Available Packages {count}
      </Typography>
      <Grid container spacing={isxs ? 1 : 2}>
        {items.map((item) => (
          <Grid xs={6} md={3} key={item.project}>
            <PkgCard {...item} />
          </Grid>
        ))}
        {(loading || hasNextPage) &&
          Array.from({ length: isxs ? 2 : 4 }).map((_, index) => (
            <Grid
              xs={6}
              md={3}
              key={index}
              // Only the last sentry is used to determine when to trigger the next load.
              ref={index === 0 ? sentryRef : null}
            >
              <PkgCard isLoader />
            </Grid>
          ))}
        {error && (
          <Grid xs={12}>
            <Alert severity="error">{error.message}</Alert>
          </Grid>
        )}
      </Grid>
    </>
  );
}

interface Package {
  name?: string;
  project?: string;
  birthtime?: string;
  description?: string;
  labels?: string[];
  isLoader?: boolean;
}

function useLoadItems() {
  const [index, setIndex] = useState(0);

  const async = useAsync(async () => {
    const rsp = await fetch("https://pkgx.dev/pkgs/index.json");
    if (!rsp.ok) throw new Error(rsp.statusText);
    const data = (await rsp.json()) as Package[];
    setIndex(Math.min(data.length, 25));
    return data;
  });

  return {
    loading: async.loading,
    items: (async.value ?? []).slice(0, index),
    hasNextPage: async.value ? index < async.value.length : false,
    error: async.error,
    loadMore: () =>
      setIndex((index) => Math.min(index + 25, async.value?.length ?? 0)),
    total: async.value?.length,
  };
}

function PkgCard({ project, description, name, labels, isLoader }: Package) {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down("md"));

  const text_style: CSSProperties = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const chips = (labels ?? []).map((label) => (
    <Chip
      sx={{
        m: isxs ? 0.5 : 1,
        color: "background.default",
        fontVariant: "small-caps",
      }}
      label={label}
      color="secondary"
      variant="filled"
      size="small"
      key={label}
    />
  ));

  const mediaHeight = isxs ? 150 : 300;
  return (
    <Card>
      <CardActionArea href={`/pkgs/${project}/`}>
        {isLoader ? (
          <Skeleton
            sx={{ height: mediaHeight }}
            animation="wave"
            variant="rectangular"
          />
        ) : (
          <CardMedia
            height={mediaHeight}
            component={Box}
            image={`https://gui.tea.xyz/prod/${project}/512x512.webp`}
            textAlign="right"
          >
            {chips}
          </CardMedia>
        )}

        <CardContent sx={isxs ? { p: 0.75 } : undefined}>
          {isLoader ? (
            <>
              <Skeleton
                animation="wave"
                height={10}
                style={{ marginBottom: 6 }}
              />
              <Skeleton animation="wave" height={10} width="80%" />
            </>
          ) : (
            <>
              <div>
                <Typography
                  variant="overline"
                  component="h2"
                  style={text_style}
                >
                  {name || get_pkg_name(project!)}
                </Typography>
              </div>
              <Typography variant="caption" component="h3" style={text_style}>
                {description}
              </Typography>
            </>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
