import { Box, InputAdornment, Button, TextField, Typography, Stack, Snackbar, Alert, Tooltip, useMediaQuery, useTheme, TypographyProps, Container } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React, { useState } from "react";
import HeroTypography from "./components/HeroTypography"

export default function Hero() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const brew_install = "brew install pkgxdev/made/pkgx"

  const click = (event: React.MouseEvent<HTMLElement>) => {
    navigator.clipboard.writeText(brew_install)
    setOpen(true)
  };

  return <Stack spacing={6} textAlign='center' mx='auto' alignItems='center' sx={isxs ? undefined : {"&&": {mt: 22}}}>
    <HeroTypography>
      Run Anything
    </HeroTypography>

    <Typography variant="h5" px={1} sx={{"&&": {mt: 6.5}}}  maxWidth={isxs ? undefined : 570}>
      <code>pkgx</code> is a blazingly fast, standalone, cross‐platform binary that <i>runs anything</i>
    </Typography>

    <Box onClick={click} px={isxs ? undefined : 10} width={isxs ? undefined : 570}>
      <Tooltip title="Click to Copy" placement='right' arrow>
      <TextField
        className="halo"
        value={brew_install}
        size='medium'
        fullWidth={true}
        InputProps={{
          endAdornment: <InputAdornment position="end"><ContentCopyIcon /></InputAdornment>,
          readOnly: true,
          style: {cursor: 'default', fontFamily: 'monospace'},
        }}
      />
      </Tooltip>

      <Snackbar open={open} autoHideDuration={1500} onClose={close} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
        <Alert onClose={close} severity="success" variant='filled' color={'primary' as any}>
          Copied to Clipboard
        </Alert>
      </Snackbar>

      <Stack direction="row" justifyContent="end">
        <Button href='https://docs.pkgx.sh/installing-w/out-brew' sx={{mt: 0.5}} size='small' color='inherit' endIcon={<ArrowForwardIcon />}>
          other ways to install
        </Button>
      </Stack>
    </Box>
  </Stack>
}
