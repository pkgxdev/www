import { Alert, Avatar, Button, Card, CardActionArea, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/CallMade';
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
  README?: string
}

export default function ScriptComponent({fullname, birthtime, README: description, avatar, url}: Script) {
  const {loading, error, value: content} = useAsync(async () => {
    const rsp = await fetch(`https://pkgxdev.github.io/mash/u/${fullname}`)
    return await rsp.text()
  })

  const username = fullname.split('/')[0]

  return <Card>
    <CardContent>
      <Stack spacing={2} direction='row'>
        <Avatar alt={username} title={username} src={avatar} sx={{ width: 24, height: 24 }} />
        <Typography>{fullname}</Typography>
        <Typography variant='caption'>{timeAgo(birthtime)}</Typography>
      </Stack>
      {description && <Markdown txt={description} />}
      {excerpt()}
      <Stack direction='row' spacing={2}>
        <Button variant='contained' href={url} target='github'>GitHub <ArrowOutwardIcon/></Button>
      </Stack>
    </CardContent>
  </Card>

  function excerpt() {
    if (loading) {
      return <Skeleton />
    } else if (error) {
      return <Alert severity='error'>{error.message}</Alert>
    } else {
      return <Terminal>{content}</Terminal>
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
