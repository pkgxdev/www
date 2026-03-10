import { Fade, Grow, InputAdornment, List, ListItem, ListItemButton, ListItemText, Paper, Popper, TextField, Typography, useMediaQuery, useTheme, Divider, Box, Chip, Stack } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

const RECENT_SEARCHES_KEY = 'pkgx_recent_searches';
const MAX_RECENT = 5;
const MAX_RESULTS = 15;

interface PkgEntry {
  project: string;
  name?: string;
  description?: string;
  labels?: string[];
}

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  try {
    const existing = getRecentSearches().filter(s => s !== query);
    existing.unshift(query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(existing.slice(0, MAX_RECENT)));
  } catch {
    // localStorage unavailable
  }
}

let pkgCache: PkgEntry[] | null = null;

async function loadPkgIndex(): Promise<PkgEntry[]> {
  if (pkgCache) return pkgCache;
  const rsp = await fetch('https://pkgx.dev/pkgs/index.json');
  if (!rsp.ok) throw new Error(rsp.statusText);
  pkgCache = await rsp.json() as PkgEntry[];
  return pkgCache;
}

function searchPackages(query: string, packages: PkgEntry[]): PkgEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  // Score-based matching for relevance ranking
  const scored = packages.map(pkg => {
    const project = pkg.project.toLowerCase();
    const name = (pkg.name || '').toLowerCase();
    const desc = (pkg.description || '').toLowerCase();

    let score = 0;

    // Exact match on project or name
    if (project === q || name === q) score += 100;
    // Starts with query
    else if (project.startsWith(q) || name.startsWith(q)) score += 50;
    // Last segment of project matches (e.g., "yarn" matches "classic.yarnpkg.com")
    else if (project.split('/').pop()?.startsWith(q) || project.split('.').some(seg => seg.startsWith(q))) score += 30;
    // Contains query
    else if (project.includes(q) || name.includes(q)) score += 20;
    // Description contains query
    else if (desc.includes(q)) score += 5;
    // No match
    else return null;

    return { pkg, score };
  }).filter(Boolean) as { pkg: PkgEntry; score: number }[];

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_RESULTS).map(s => s.pkg);
}

export default function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isopen, setopen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PkgEntry[]>([]);
  const [packages, setPackages] = useState<PkgEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches());

  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcut_txt = isMac ? '⌘K' : 'Ctrl+K';

  // Load package index on mount
  useEffect(() => {
    loadPkgIndex().then(setPackages).catch(() => {});
  }, []);

  // Cmd+K handler
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (document.activeElement !== inputRef.current) {
          inputRef.current?.focus();
        } else {
          inputRef.current?.blur();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!isopen) return;

      const items = query ? results : [];

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, items.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, -1));
      } else if (event.key === 'Enter' && selectedIndex >= 0 && selectedIndex < items.length) {
        event.preventDefault();
        const pkg = items[selectedIndex];
        saveRecentSearch(query);
        window.location.href = `/pkgs/${pkg.project}/`;
      } else if (event.key === 'Escape') {
        inputRef.current?.blur();
        setopen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isopen, query, results, selectedIndex]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    if (value.trim()) {
      setResults(searchPackages(value, packages));
    } else {
      setResults([]);
    }
  }, [packages]);

  const handleResultClick = (project: string) => {
    if (query) saveRecentSearch(query);
    setRecentSearches(getRecentSearches());
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    handleSearch(term);
    inputRef.current?.focus();
  };

  return <>
    <TextField
      type="search"
      id="search"
      label="Search packages"
      size='small'
      value={query}
      onFocus={() => setopen(true)}
      onChange={e => handleSearch(e.target.value)}
      inputRef={inputRef}
      InputProps={isxs ? undefined : {
        endAdornment: <InputAdornment position="end">{shortcut_txt}</InputAdornment>,
      }}
    />
    <Popper open={true} anchorEl={inputRef.current} placement='bottom-end' style={{ zIndex: 1300 }}>
      <Grow timeout={200} in={isopen}>
        <Paper elevation={8} sx={{ maxHeight: 400, overflow: 'auto', minWidth: 320 }}>
          {query.trim() ? (
            <SearchResults
              results={results}
              selectedIndex={selectedIndex}
              onClick={handleResultClick}
            />
          ) : isopen && recentSearches.length > 0 ? (
            <RecentSearches
              searches={recentSearches}
              onSelect={handleRecentClick}
            />
          ) : null}
        </Paper>
      </Grow>
    </Popper>
  </>;
}

function SearchResults({ results, selectedIndex, onClick }: {
  results: PkgEntry[];
  selectedIndex: number;
  onClick: (project: string) => void;
}) {
  if (results.length === 0) {
    return (
      <Box p={2}>
        <Typography color="text.secondary">No packages found</Typography>
      </Box>
    );
  }

  return (
    <List dense>
      {results.map((pkg, index) => {
        const { project, name, description, labels } = pkg;
        const displayName = name || project;
        const secondary = (
          <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
            {name && name !== project && (
              <Typography variant="caption" color="text.secondary">{project}</Typography>
            )}
            {description && (
              <Typography variant="caption" color="text.secondary">
                {name && name !== project ? ' — ' : ''}{description}
              </Typography>
            )}
          </Stack>
        );

        return (
          <ListItem key={project} disableGutters disablePadding dense>
            <ListItemButton
              href={`/pkgs/${project}/`}
              dense
              selected={index === selectedIndex}
              onClick={() => onClick(project)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>{displayName}</span>
                    {(labels || []).map(l => (
                      <Chip key={l} label={l} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                    ))}
                  </Stack>
                }
                secondary={secondary}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

function RecentSearches({ searches, onSelect }: { searches: string[]; onSelect: (term: string) => void }) {
  return (
    <Box p={1}>
      <Typography variant="caption" color="text.secondary" px={1}>Recent searches</Typography>
      <List dense>
        {searches.map(term => (
          <ListItem key={term} disableGutters disablePadding dense>
            <ListItemButton dense onClick={() => onSelect(term)}>
              <ListItemText primary={term} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
