import { InputAdornment, TextField, useMediaQuery, useTheme } from "@mui/material";

export default function() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return <>
    <TextField
      type="search"
      id="search"
      label="Search"
      size='small'
      InputProps={{
        endAdornment: <InputAdornment position="end">⌘K</InputAdornment>,
      }}
    />
  </>
}
