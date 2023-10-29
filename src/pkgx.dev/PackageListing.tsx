import { S3Client, ListObjectsV2Command, _Object } from '@aws-sdk/client-s3';
import { Box, Button, Stack, Typography, Link, Alert } from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Masthead from '../components/Masthead';
import Footer from '../components/Footer';
import Stars from '../components/Stars';
import { useAsync } from 'react-use';
import * as yaml from 'yaml';
import { isArray } from 'is-what';

function dirname(path: string | undefined) {
  path ??= ''
  path = path.trim().replace(/\/+$/, '');
  const ii = path.lastIndexOf('/');
  return ii >= 0 ? path.slice(ii + 1) : path;
}

export default function PackageListing() {
  return <Stack direction="column" maxWidth='md' p={2} minHeight='100vh' mx='auto' spacing={4}>
    <Masthead>
      <Button href='/pkgs/' color='inherit'>pkgs</Button>
      <Stars />
    </Masthead>
    <PackageListingMeat />
    <Footer/>
  </Stack>
}

function PackageListingMeat() {
  const { "*": splat } = useParams();

  const {loading, value, error} = useAsync(async () => {
    const client = new S3Client({
      region: 'us-east-1',
      signer: { sign: async (request) => request }  // is a public bucket but the SDK barfs without this
    });
    const command = new ListObjectsV2Command({
      Bucket: "dist.tea.xyz", // required
      Delimiter: `/`,
      Prefix: splat
    });
    const data = await client.send(command)

    let ispkg = false

    const dirs = data.CommonPrefixes?.filter(({Prefix}) => {
      switch (dirname(Prefix)) {
      case 'darwin':
      case 'linux':
      case 'windows':
        ispkg = true;
        // fall through
      case '':
      case undefined:
        return false
      default:
        return true
      }
    }).map(x => x.Prefix!) ?? []

    document.title = `pkgx — ${splat || 'pkgs'}`

    return {dirs, ispkg}

  }, [splat])

  if (loading) {
    return <Typography>Loading…</Typography>
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>
  } else {
    const {dirs, ispkg} = value!
    return <Stack spacing={3}>
      {ispkg
        ? <Package project={splat!.slice(0, -1)} dirs={dirs} />
        : <Listing dirs={dirs} />
      }
    </Stack>
  }
}

function Listing({ dirs }: { dirs: string[] }) {
  return <ul>
    {dirs.map(obj => <li key={obj}>
      <Link component={RouterLink} to={`/pkgs/${obj}`}>{obj}</Link>
    </li>)}
  </ul>
}

function Package({ project, dirs }: { project: string, dirs: string[] }) {
  const { loading, error, value } = useAsync(async () => {
    const url = `https://raw.githubusercontent.com/pkgxdev/pantry/main/projects/${project}/package.yml`
    const rsp = await fetch(url)
    const txt = await rsp.text()
    const yml = yaml.parse(txt)
    return yml
  }, [project])

  return <Stack direction={{xs: "column", md: "row"}} spacing={4}>
    <img src={`https://gui.tea.xyz/prod/${project}/1024x1024.webp`} width={375} height={375} />
    <Stack spacing={2}>
      <Box>
        <Typography variant='h2'>{project}</Typography>
        <Stack direction={'row'} spacing={2}>
          <Button href={`tea://packages/${project}`}>Open in OSS.app</Button>
          <Button href={`https://github.com/pkgxdev/pantry/tree/main/projects/${project}/package.yml`}>View package.yml</Button>
        </Stack>
      </Box>

      <Box>
        {metadata()}
      </Box>

      <Box>
        <Typography variant='h5'>Versions</Typography>
        <Versions project={project} />
      </Box>

      {dirs.length > 0 && <Box>
        <Typography variant='h5'>Subprojects</Typography>
        <Listing dirs={dirs} />
      </Box> }
    </Stack>
  </Stack>

  function metadata() {
    const provides: string[] = value?.provides ?? []

    if (loading) {
      return <Typography>Loading Metadata…</Typography>
    } else if (error) {
      return <Alert severity="error">{error.message}</Alert>
    } else if (!isArray(provides)) {
      return <Alert severity="error">Unexpected error</Alert>
    } else {
      return <>
        <Typography variant='h5'>Programs</Typography>
        {body()}
      </>
      function body() {
        if (provides.length) {
          return <ul>
            {provides.map((program, i) => <li key={i}>
              <code>{program.replace(/^bin\//g, '')}</code>
            </li>)}
          </ul>
        } else {
          return <Typography>none</Typography>
        }
      }
    }
  }
}

function Versions({ project }: { project: string }) {
  const state = useAsync(async () => {
    let rsp = await fetch(`https://dist.pkgx.dev/${project}/darwin/aarch64/versions.txt`);
    if (!rsp.ok) rsp = await fetch(`https://dist.pkgx.dev/${project}/linux/x86-64/versions.txt`);
    const txt = await rsp.text()
    return txt.split("\n")
  }, [project]);

  if (state.loading) {
    return <p>Loading…</p>
  } else if (state.error) {
    return <>
      <Alert severity="error">{state.error.message}</Alert>
    </>
  } else {
    return <>
      <ul>
        {state.value!.map(version => <li key={version}>{version}</li>)}
      </ul>
      <Typography variant="subtitle2" color='textSecondary'>
        If you need a version we don’t have <Link href='https://github.com/pkgxdev/pantry/issues/new'>request it here</Link>.
      </Typography>
    </>
  }
}