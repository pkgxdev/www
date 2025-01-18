import { Box, InputAdornment, Button, TextField, Typography, Stack, Snackbar, Alert, Tooltip, useMediaQuery, useTheme, Tabs, Tab } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React, { useState } from "react";
import HeroTypography from '../components/HeroTypography'
import { useSearchParams } from 'react-router-dom'

export default function Hero() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams({ via: 'brew' })

  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const text = () =>
    searchParams.get('via') === 'brew'
      ? 'brew install pkgx'
      : 'curl -Ssf https://pkgx.sh | sh'

  const click = (event: React.MouseEvent<HTMLElement>) => {
    navigator.clipboard.writeText(text())
    setOpen(true)
  }

  const style = isxs
    ? { minWidth: 'fit-content', height: 'fit-content', padding: 12 }
    : undefined

  return <Stack spacing={6} textAlign='center' mx='auto' alignItems='center' sx={isxs ? undefined : {"&&": {mt: 22}}}>
    <HeroTypography>
      Run Anything
    </HeroTypography>

    <Typography variant="h5" px={1} sx={{"&&": {mt: 6.5}}}  maxWidth={isxs ? undefined : 570}>
      <code>pkgx</code> is a blazingly fast, standalone, cross‐platform binary that <i>runs anything</i>
    </Typography>

    <Box px={isxs ? undefined : 10} width={isxs ? '90vw' : 570}>
      <Tooltip title="Click to Copy" placement='right' arrow>
        <TextField
          onClick={click}
          className="halo"
          value={text()}
          fullWidth={true}
          InputProps={{
            endAdornment: <InputAdornment position="end"><ContentCopyIcon /></InputAdornment>,
            readOnly: true,
            style: {cursor: 'default', fontFamily: 'monospace', fontSize: isxs ? 14 : undefined},
          }}
        />
      </Tooltip>

      <Snackbar open={open} autoHideDuration={1500} onClose={close} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert onClose={close} severity="success" variant='filled' color={'primary' as any}>
          Copied to Clipboard
        </Alert>
      </Snackbar>

      <Tabs
        value={searchParams.get('via')?.toLowerCase()}
        onChange={(_, val) => setSearchParams({ via: val })}
        style={{ paddingInline: '0.5em' }}
      >
        <Tab label='brew' value='brew' />
        <Tab label='cURL' value='curl' />
        <Box width='100%'>
          <Stack direction='row' justifyContent='end' mt={1}>
            <Button
              href='https://docs.pkgx.sh/installing-w/out-brew'
              sx={{ mt: 0.5 }}
              size='small'
              color='inherit'
              endIcon={<ArrowForwardIcon />}
            >
              other ways {isxs || 'to install'}
            </Button>
          </Stack>
        </Box>
      </Tabs>
    </Box>
  </Stack>
}
