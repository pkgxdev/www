import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Button, Card, CardContent, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Terminal, { Prompt, Orange, Dim } from '../components/Terminal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Landing() {
  return <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                Bash has served its time
              </Typography>
              <Typography my={1.5} color="text.secondary">
                Script with modern shells.
              </Typography>
              <Terminal width='100%' mb={0} mt={2}>
                <Dim>#!/usr/bin/env -S pkgx fish</Dim>
              </Terminal>
            </CardContent>
          </Card>
          <Card sx={{mt: 2}}>
            <CardContent>
              <Typography variant="h5">
                Zero System Impact
              </Typography>
              <Typography my={1.5} color="text.secondary">
                We don’t install packages. <i>We cache them</i>.
                Just like <code>npx</code> caches & executes node packages, <code>pkgx</code> caches everything else (including <code>npx</code>).
              </Typography>
              <Typography align='right'>
                <Button sx={{mt: 2}} size='small' color='inherit' href='https://docs.pkgx.sh' endIcon={<ArrowForwardIcon />}>
                  The Deets on That
                </Button>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                Break Ecosystem Boundaries
              </Typography>
              <Typography my={1.5} color="text.secondary">
                Unleash the potential of scripts with using the right tool for any job.
                Origin be damned.
              </Typography>
              <Terminal width='100%' mb={0} mt={2}>
                <Dim>#!/usr/bin/env -S pkgx +gum +llama.cpp +npx zx</Dim><br/>
                <br/>
                $`gum confirm deploy?`<br/>
                const port = $`llama.cpp --prompt 'pick a random port'`<br/>
                $`npx kill-port ${'{'}port{'}'}`<br/>
              </Terminal>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
}