import { Alert, Avatar, Button, Card, CardActionArea, CardContent, Chip, Skeleton, Stack, Typography } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/CallMade';
import EastIcon from '@mui/icons-material/East';
import { useLocation } from 'react-router-dom';
import Markdown from '../components/Markdown';
import Terminal from '../components/Terminal';
import ScriptDetail from './ScriptDetail';
import { useAsync } from 'react-use';

export interface Script {
  fullname: string
  birthtime: string
  description?: string
  avatar: string
  url: string
  cmd: string
  README?: string
  category?: string
}

export default function ScriptRoute() {
  const path = useLocation().pathname

  const data = useAsync(async () => {
    const rsp = await fetch('https://pkgxdev.github.io/mash/index.json')
    const data = await rsp.json()
    return data.scripts.find((s: any) => `/${s.fullname}` === path) as Script
  })

  if (data.loading) {
    return <Skeleton />
  } else if (data.error || !data.value) {
    return <Alert severity='error'>{data.error?.message ?? 'Script not found'}</Alert>
  } else {
    return <ScriptDetail {...data.value} />
  }
}

export function ScriptComponent({fullname, birthtime, description, avatar, url, cmd, category}: Script) {
  const username = fullname.split('/')[0]

  return <Card>
    <CardContent>
      <Stack spacing={2} direction='row'>
        <Avatar alt={username} title={username} src={avatar} sx={{ width: 24, height: 24 }} />
        <Typography>{fullname}</Typography>
        <Typography variant='caption'>{timeAgo(birthtime)}</Typography>
        {category && <Chip sx={{color: 'background.default', textTransform: 'uppercase'}}
          label={category} color='secondary' variant="filled" size='small' />}
      </Stack>
      {description && <Markdown txt={description} />}
      <Terminal>{cmd}</Terminal>
      <Stack direction='row' spacing={2}>
        <Button href={`/${fullname}`} variant='outlined'>Usage <EastIcon /></Button>
        <Button href={url} target='github'>GitHub <ArrowOutwardIcon/></Button>
      </Stack>
    </CardContent>
  </Card>
}

function timeAgo(date: Date | string) {
  const now = new Date().getTime();
  const diffInSeconds = Math.round((now - new Date(date).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: 'auto' });

  // Define the time thresholds in seconds for different units
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

  // Calculate the difference and determine the unit
  if (diffInSeconds < minute) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < hour) {
    return rtf.format(-Math.round(diffInSeconds / minute), 'minute');
  } else if (diffInSeconds < day) {
    return rtf.format(-Math.round(diffInSeconds / hour), 'hour');
  } else if (diffInSeconds < week) {
    return rtf.format(-Math.round(diffInSeconds / day), 'day');
  } else {
    // For differences larger than a week, you could continue with months and years
    // or decide to show the full date.
    return rtf.format(-Math.round(diffInSeconds / week), 'week');
  }
}
