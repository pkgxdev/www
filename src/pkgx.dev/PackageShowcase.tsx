import Grid from '@mui/material/Grid2';
import { Alert, Box, Card, CardActionArea, CardContent, CardMedia, Chip, FormControl, InputLabel, MenuItem, Select, Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, useTheme } from "@mui/material";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { CSSProperties, useMemo, useState } from "react";
import get_pkg_name from "../utils/pkg-name";
import { useAsync } from "react-use";

// Category definitions for filtering
const CATEGORIES: Record<string, { label: string; match: (pkg: Package) => boolean }> = {
  all: { label: 'All', match: () => true },
  node: { label: 'Node.js', match: (p) => p.labels?.includes('node') ?? false },
  python: { label: 'Python', match: (p) => p.labels?.includes('python') ?? false },
  rust: { label: 'Rust', match: (p) => p.labels?.includes('rust') ?? false },
  go: { label: 'Go', match: (p) => p.labels?.includes('go') ?? false },
  ruby: { label: 'Ruby', match: (p) => p.labels?.includes('ruby') ?? false },
};

type SortOption = 'newest' | 'oldest' | 'alphabetical';

export default function Showcase() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterText, setFilterText] = useState('');

  const { loading, allItems, error } = useLoadAllItems();

  // Filter and sort
  const processedItems = useMemo(() => {
    let items = [...allItems];

    // Category filter
    if (category !== 'all' && CATEGORIES[category]) {
      items = items.filter(CATEGORIES[category].match);
    }

    // Text filter
    if (filterText.trim()) {
      const q = filterText.toLowerCase().trim();
      items = items.filter(pkg => {
        const project = pkg.project?.toLowerCase() || '';
        const name = (pkg.name || '').toLowerCase();
        const desc = (pkg.description || pkg.brief || '').toLowerCase();
        return project.includes(q) || name.includes(q) || desc.includes(q);
      });
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        items.sort((a, b) => new Date(b.birthtime || 0).getTime() - new Date(a.birthtime || 0).getTime());
        break;
      case 'oldest':
        items.sort((a, b) => new Date(a.birthtime || 0).getTime() - new Date(b.birthtime || 0).getTime());
        break;
      case 'alphabetical':
        items.sort((a, b) => (a.name || a.project || '').localeCompare(b.name || b.project || ''));
        break;
    }

    return items;
  }, [allItems, category, sortBy, filterText]);

  // Paginate the processed results
  const [visibleCount, setVisibleCount] = useState(25);
  const visibleItems = processedItems.slice(0, visibleCount);
  const hasNextPage = visibleCount < processedItems.length;

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: () => setVisibleCount(c => Math.min(c + 25, processedItems.length)),
    disabled: !!error,
    rootMargin: '0px 0px 800px 0px',
    delayInMs: 0,
  });

  // Reset pagination when filters change
  useMemo(() => {
    setVisibleCount(25);
  }, [category, sortBy, filterText]);

  const count = <Typography
    display='inline' color='text.secondary' variant='h6'
  >{new Intl.NumberFormat().format(processedItems.length)}</Typography>;

  return <>
    <Typography variant='h4' component='h1' textAlign={isxs ? "center" : undefined}>
      Available Packages {count}
    </Typography>

    {/* Filter Controls */}
    <Stack
      direction={isxs ? 'column' : 'row'}
      spacing={2}
      alignItems={isxs ? 'stretch' : 'center'}
      mb={2}
    >
      <TextField
        size="small"
        label="Filter packages"
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        sx={{ minWidth: 200 }}
      />

      <ToggleButtonGroup
        value={category}
        exclusive
        onChange={(_, val) => val && setCategory(val)}
        size="small"
        sx={{ flexWrap: 'wrap' }}
      >
        {Object.entries(CATEGORIES).map(([key, { label }]) => (
          <ToggleButton key={key} value={key} sx={{ textTransform: 'none', px: 1.5 }}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sortBy}
          label="Sort by"
          onChange={e => setSortBy(e.target.value as SortOption)}
        >
          <MenuItem value="newest">Newest first</MenuItem>
          <MenuItem value="oldest">Oldest first</MenuItem>
          <MenuItem value="alphabetical">A to Z</MenuItem>
        </Select>
      </FormControl>
    </Stack>

    <Grid container spacing={isxs ? 1 : 2}>
      {visibleItems.map(item => <Grid size={{xs: 6, md: 3}} key={item.project}>
        <PkgCard {...item} />
      </Grid>)}
      {(loading || hasNextPage) &&
          Array.from({ length: isxs ? 2 : 4 }).map((_, index) => (
            <Grid size={{xs: 6, md: 3}} key={`loader-${index}`} ref={index === 0 ? sentryRef : null}>
              <PkgCard isLoader />
            </Grid>
          ))}
      {error && <Grid size={12}><Alert severity='error'>{error.message}</Alert></Grid>}
      {!loading && processedItems.length === 0 && !error && (
        <Grid size={12}>
          <Typography color="text.secondary" textAlign="center" py={4}>
            No packages match your filters. Try adjusting your search or category.
          </Typography>
        </Grid>
      )}
    </Grid>
  </>
}

interface Package {
  name?: string;
  project?: string;
  birthtime?: string;
  description?: string;
  brief?: string;
  labels?: string[];
  isLoader?: boolean;
}

function useLoadAllItems() {
  const async_result = useAsync(async () => {
    const rsp = await fetch('https://pkgx.dev/pkgs/index.json')
    if (!rsp.ok) throw new Error(rsp.statusText)
    return await rsp.json() as Package[]
  });

  return {
    loading: async_result.loading,
    allItems: async_result.value ?? [],
    error: async_result.error,
  };
}

function PkgCard({project, description, brief, name, labels, isLoader}: Package) {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  const text_style: CSSProperties = {whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}

  const chips = (labels ?? []).map(label =>
    <Chip sx={{m: isxs ? 0.5 : 1, color: 'background.default', fontVariant: 'small-caps'}}
      label={label} color='secondary' variant="filled" size='small' key={label} />
  )
  const mediaHeight = isxs ? 150 : undefined;
  return (
    <Card>
      <CardActionArea href={`/pkgs/${project}/`}>
        {isLoader ? (
          <Skeleton sx={{ height: mediaHeight }} animation="wave" variant="rectangular" />
        ) : (
          <CardMedia
            height={mediaHeight}
            sx={{aspectRatio: isxs ? undefined : '1/1'}}
            component={Box}
            image={`/pkgs/${project}.webp`}
            textAlign="right"
          >
            {chips}
          </CardMedia>
        )}
        {isLoader ? (
          <CardContent sx={isxs ? {p: 0.75} : undefined}>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </CardContent>
        ) : (
          <CardContent sx={isxs ? {p: 0.75} : undefined}>
            <div>
              <Typography variant='overline' component="h2" style={text_style}>
                {name || get_pkg_name(project!)}
              </Typography>
            </div>
            <Typography noWrap={false} variant='caption' component="h3">
              {brief || description}
            </Typography>
          </CardContent>
        )}
      </CardActionArea>
    </Card>
  )
}
