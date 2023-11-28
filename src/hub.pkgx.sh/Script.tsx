import { Alert, Avatar, Card, CardActionArea, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import Terminal, { Dim } from '../components/Terminal';
import { useLocation } from 'react-router-dom';
import Markdown from '../components/Markdown';
import { useAsync } from 'react-use';

export interface Script {
  fullname: string
  birthtime: string
  description?: string
  avatar: string
  url: string
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
    return <ScriptComponent {...data.value} />
  }
}

export function ScriptComponent({fullname, birthtime, description, avatar, url}: Script) {
  const {loading, error, value: content} = useAsync(async () => {
    const rsp = await fetch(`https://pkgxdev.github.io/mash/${fullname}`)
    const txt = await rsp.text()
    return txt.split('\n').slice(0, 5).join('\n')
  })

  const username = fullname.split('/')[0]

  return <Card>
    <CardContent>
      <CardActionArea href={url} target={username}>
        <Stack spacing={2} direction='row'>
          <Avatar alt={username} title={username} src={avatar} sx={{ width: 24, height: 24 }} />
          <Typography>{fullname}</Typography>
          <Typography variant='caption'>{timeAgo(birthtime)}</Typography>
        </Stack>
        {description && <Markdown txt={description} />}
        {excerpt()}
      </CardActionArea>
    </CardContent>
  </Card>

  function excerpt() {
    if (loading) {
      return <Skeleton />
    } else if (error) {
      return <Alert severity='error'>{error.message}</Alert>
    } else {
      return <Terminal>{content}<br/><Dim>…</Dim></Terminal>
    }
  }
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
