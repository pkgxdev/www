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
        a community of thousands of passionate computer users.
        </Typography>
        <Typography variant='body2' mt={1}>
          We glue together the gems of Open Source into tools that couldn’t be made any other way.
        </Typography>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        <Typography variant='overline' component='h2'>
          Submitting Scripts
        </Typography>
        <Typography component='ol'>
          <li><Link href='https://github.com/pkgxdev/scripthub'>Fork</Link></li>
          <li>Push scripts</li>
          <li>Wait an hour</li>
        </Typography>
        <Typography variant='body2' mt={1}>
          No pull request required! <i>We index the fork graph.</i>
        </Typography>
      </CardContent>
    </Card>
  </Stack>
}
