import { Alert, Skeleton, Stack } from '@mui/material';
import { ScriptComponent, Script } from './Script'
import { useAsync } from 'react-use';

export default function Landing() {
  const data = useAsync(async () => {
    const rsp = await fetch('https://pkgxdev.github.io/mash/index.json')
    const data = await rsp.json()
    return (data.scripts as Script[]).filter(({description}) => description)
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
      return data.value!.map(script => <ScriptComponent key={script.fullname} {...script}></ScriptComponent>)
    }
  }
}
