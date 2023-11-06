import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Alert, Avatar, Button, Card, CardActionArea, CardContent, Skeleton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Terminal, { Prompt, Orange, Dim } from '../components/Terminal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAsync } from 'react-use';
import Markdown from '../components/Markdown';

interface Script {
  fullname: string
  birthtime: string
  description?: string
  avatar: string
  url: string
}

export default function Landing() {
  const data = useAsync(async () => {
    const rsp = await fetch('https://pkgxdev.github.io/scripthub/index.json')
    const data = await rsp.json()
    return data.scripts as Script[]
  })

  return <Stack spacing={2}>
    {body()}
  </Stack>

  function body() {
    if (data.loading) {
      return <>
        <Skeleton animation='wave' />
        <Skeleton animation='wave' />
        <Skeleton animation='wave' />
      </>
    } else if (data.error) {
      return <Alert severity='error'>{data.error.message}</Alert>
    } else {
      return data.value!.map(script => <Script key={script.fullname} {...script}></Script>)
    }
  }
}

function Script({fullname, birthtime, description, avatar, url}: Script) {
  const {loading, error, value: content} = useAsync(async () => {
    const rsp = await fetch(`https://pkgxdev.github.io/scripthub/${fullname}`)
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
