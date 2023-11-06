import { Card, CardContent, Link, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Orange } from '../components/Terminal';

export default function Hero() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return <Stack spacing={2}>
    <Card>
      <CardContent>
        <Typography component='h1'>
        <Orange><b>ScriptHub</b></Orange> is
        a community of thousands of passinate computer users.
        </Typography>
        <Typography variant='body2' mt={1}>
          We glue together the gems of Open Source into unimaginably powerful scripts.
        </Typography>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        To submit a script, simply fork <Link href='https://github.com/pkgxdev/scripthub'>
          <code>pkgxdev/scripthub</code>
        </Link> and add push your scripts. <i>It’s that simple!</i>
      </CardContent>
    </Card>
  </Stack>
}
