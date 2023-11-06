import React from "react";
import { ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Button, Card, CardContent, CssBaseline, Dialog, DialogTitle, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import HeroTypography from './components/HeroTypography';
import * as ReactDOM from 'react-dom/client';
import gui from "./assets/gui.png";
import theme from './utils/theme';
import Masthead from './components/Masthead';
import Footer from "./components/Footer";
import './assets/main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Body />
    </ThemeProvider>
  </React.StrictMode>,
);


function Body() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  const imgsz = {width: '100%', height: '100%'}

  return <Stack direction="column" maxWidth='md' sx={{p: isxs ? 1 : 4}} mx='auto' spacing={isxs ? 4 : 8}>
    <Masthead />

    <Stack spacing={4} textAlign='center'>
      <HeroTypography>
      Open Source is a Treasure Trove
      </HeroTypography>
      <Typography variant="h5" my={1}>
        What jewel will you discover today?
      </Typography>
    </Stack>

    <Box textAlign='center'>
      <img src={gui} style={imgsz} />
    </Box>

    <Download />

    <Grid container spacing={4}>
      <Grid xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              One Click Installs
            </Typography>
            <Typography color='text.secondary' my={2}>
              Say goodbye to the days of scavenging through cluttered docs. <code>oss.app</code> enables you to query our expansive pkgdb and install your desired version of any package with one click. OpenAI, deno, youtube-dl, and hundreds more… all available to you within seconds.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12} md={6}>
        <Card sx={{height: '100%'}}>
          <CardContent>
            <Typography variant="h6" component="div">
              Complementing <code>pkgx</code>
            </Typography>
            <Typography color='text.secondary' my={2}>
              We believe command line interfaces and graphical user interfaces are <i>complements</i> and should not necessarily share the same features.
            </Typography>
            <Typography color='text.secondary' my={2}>
              Our cli is precise and powerful where our gui is optimized for discovery and batch operations.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    <Footer />
  </Stack>
}

function Download() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box textAlign='center'>
      <Button variant='contained' size='large' onClick={handleOpen}>
        Download&nbsp;<code>oss.app</code>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Which Platform?</DialogTitle>
        <Stack direction='row' spacing={2} p={4} pt={0}>
          <Button variant='contained' size='large' href='https://gui.pkgx.dev/release/ossapp-latest-arm64.dmg'>
            Apple Silicon
          </Button>
          <Button variant='contained' size='large' href='https://gui.pkgx.dev/release/ossapp-latest.dmg'>
            macOS Intel
          </Button>
        </Stack>
      </Dialog>
    </Box>
  );
}
