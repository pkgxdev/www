import { InputAdornment, Link, TextField } from '@mui/material';
import { useCallback } from 'react';
import { useHits, useSearchBox } from 'react-instantsearch';
import { Link as RouterLink } from 'react-router-dom'

export default function Search() {
  const memoizedSearch = useCallback((query, search) => {
    search(query);
  }, []);
  const { refine } = useSearchBox({
    queryHook: memoizedSearch,
  });

  return <TextField
    type="search"
    id="search"
    label="Search"
    size='small'
    onChange={(e) => refine(e.target.value)}
    InputProps={{
      endAdornment: <InputAdornment position="end">⌘K</InputAdornment>,
    }}
  />
}

interface Hit {
  project: string
}

export function SearchResults() {
  const { hits } = useHits()
  console.log(hits)
  return <ul>
    {hits.map(fu)}
  </ul>

  function fu(input: any) {
    const {project} = input
    return <li key={project}><Link component={RouterLink} to={`/pkgs/${project}/`}>{project}</Link></li>
  }
}