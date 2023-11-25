import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Alert, Box, Button, Card, CardContent, ImageList, ImageListItem, Stack, Typography, styled, useMediaQuery, useTheme } from "@mui/material"
import Terminal, { Dim, Orange, Prompt, Purple } from '../components/Terminal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React from "react"

import charm from "../assets/wordmarks/charm.png"
import node from "../assets/wordmarks/node.png"
import openai from "../assets/wordmarks/OpenAI.svg"
import python from "../assets/wordmarks/python.png"
import rust from "../assets/wordmarks/rust.svg"
import deno from "../assets/wordmarks/deno.svg"
import go from "../assets/wordmarks/go.png"
import php from "../assets/wordmarks/php.svg"

function H3({ children, ...props }: React.ComponentProps<typeof Typography>) {
  const StyledTypography = styled(Typography)(({ theme }) => ({
    textAlign: "center",
    fontWeight: 'bold',
  }));

  return <StyledTypography variant='h3' {...props}>
    {children}
  </StyledTypography>
}

export function RunAnything() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return <Stack spacing={3} p={0}>
    <H3 sx={{"&&": { mb: 3}}}>
      It’s <code style={{marginRight: 1}}>npx</code> for <Typography display='inline' variant='h3' fontSize='inherit' color='primary' fontWeight='bold' component='span'>everything else</Typography>
    </H3>

    <Terminal>
      <Prompt/> bun run<br/>
      command not found: bun<br/>
      <br/>
      <Prompt/> <Orange>pkgx</Orange> bun run<br/>
      <Dim>running `</Dim>bun run<Dim>`…</Dim><br/>
      <br/>
      Bun: a fast JavaScript runtime, package manager, bundler and test runner.<br/>
      <Dim># …</Dim>
    </Terminal>

    <div>{/* required to work around https://github.com/mui/material-ui/issues/29221 */}
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                Run Any Version
              </Typography>
              <Typography my={1.5} color="text.secondary">
                node 16? python 2? postgres 12? <b>nps</b>.
              </Typography>

              <Terminal width='100%' mb={0} mt={2}>
                <Prompt/> <Orange>pkgx</Orange> node@16<br/>
                Node.js v16.20.1<br/>
                <Dim>&gt;</Dim>
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

              <Terminal width='100%' mb={0} mt={2}>
                <Prompt/> <Orange>pkgx</Orange> rustc --version<br/>
                rustc 1.72.1<br/><br/>
                <Prompt /> which rustc<br />
                command not found: rustc<br />
                <Dim># ^^ <i>still</i> not installed!</Dim>
              </Terminal>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">
                Whatever you want to run<br/><i>Just type it</i>
              </Typography>
              <Typography my={1.5} color="text.secondary">
                <code>pkgx</code> can <i>optionally</i> integrate with your shell giving it <b>pkging powers</b>.
              </Typography>
              <Typography my={1.5} color="text.secondary">
                When our investors ask why this is cool we just shrug and say “do you even dev?”.
              </Typography>

              <Terminal width='100%' mb={2} mt={2}>
                <Prompt/> deno<br/>
                command not found: deno<br/>
                <Dim>^^ type `</Dim>x<Dim>` to run that</Dim><br/>
                <br/>
                <Prompt/> <Orange>x</Orange><br/>
                <Purple>env</Purple> +deno <Dim>&&</Dim> deno<br/>
                <br/>
                Deno 1.37.1<br/>
                <Dim>&gt;</Dim>
              </Terminal>
              <Alert severity="info">
                <code>deno</code>’s not installed, <code>pkgx</code> just added it to your shell session. It’ll be gone when you <code>exit</code> 🥹
              </Alert>
            </CardContent>
          </Card>
          <Card sx={{mt: 2}}>
            <CardContent>
              <Typography variant="h5">
                Or Just Install Stuff
              </Typography>
              <Terminal width='100%' mb={2} mt={2}>
                <Prompt/> <Orange>pkgx</Orange> install gh<br/>
                installed ~/.local/bin/gh<br/>
              </Terminal>
              <Alert severity="info">
                Some tools you need at the system level, but generally we feel you should
                use our shell integration and our <Orange>dev</Orange> tool which makes tools
                available on a per project basis.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>

    <Typography align='center'>
      <Button color='inherit' href='https://docs.pkgx.sh' endIcon={<ArrowForwardIcon />}>
        Explore the docs
      </Button>
    </Typography>
  </Stack>
}

export function Quote() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return <Typography variant="h5" color='text.secondary' textAlign='center' px={isxs ? 1 : 11} sx={{"&&": { mt: 16 }}}>
    “Max Howell, the mind behind Homebrew, is shaking up the foundation of development once again with his new creation, <code>pkgx</code>”
  </Typography>
}

export function RunAnywhere() {
  return <Stack spacing={2} className='editors'>
    <H3>
      Run <Typography component='span' display='inline' fontWeight='bold' variant='h3' color='primary'>Anywhere</Typography>
    </H3>

    <Typography variant="h5" color='text.secondary' sx={{"&&": {mb:4, mt: 1}}} textAlign='center'>
      Wherever you work, <code>pkgx</code> works too.
    </Typography>

    <div>{/* required to work around https://github.com/mui/material-ui/issues/29221 */}
      <Grid container spacing={2}>
        <Grid xs={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                macOS
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <ul style={{marginTop: '0.25em'}}>
                  <li>&gt;= 11</li>
                  <li>Intel and Apple Silicon</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={6} md={4}>
          <Card>
            <CardContent>
            <Typography variant="h6" component="div">
                Linux
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <ul style={{marginTop: '0.25em'}}>
                  <li>glibc &gt;=2.28</li>
                  <li><code>x86_64</code> & <code>arm64</code></li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={6} md={4}>
          <Card>
            <CardContent>
            <Typography variant="h6" component="div">
                Windows
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
              <ul style={{marginTop: '0.25em'}}>
                  <li>WSL2</li>
                  <li><i>Native coming soon!</i></li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Docker
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Sure you could memorize the weird naming conventions of <code>apt</code>.
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.primary">
                But wouldn’t you rather <i>just run?</i>
              </Typography>
              <Terminal width='100%' mb={0} mt={2}>
                <Purple>FROM</Purple> ubuntu<br/>
                <Purple>RUN</Purple> curl https://pkgx.sh | sh<br/>
                <Purple>RUN</Purple> pkgx python@3.12 -m http.server 8000
              </Terminal>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={5}>
          <Card sx={{height: '100%'}}>
            <CardContent>
              <Typography variant="h6" component="div">
                CI/CD
              </Typography>
              <Terminal width='100%' mb={0} mt={2}>
                - <Purple>uses</Purple>: pkgxdev/setup@v1<br/>
                - <Purple>run</Purple>: pkgx npm@10 start
              </Terminal>
              <Typography align='right'>
                <Button sx={{mt: 2}} size='small' color='inherit' href='https://docs.pkgx.sh/run-anywhere/ci-cd'  endIcon={<ArrowForwardIcon />}>
                  Other CI/CD Providers
                </Button>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Editors
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Just Works™ in VSCode? nps.
              </Typography>
              <Typography align='right'>
                <Button sx={{mt: 2}} size='small' color='inherit' href='https://docs.pkgx.sh/run-anywhere/editors' endIcon={<ArrowForwardIcon />}>
                  The Deets on That
                </Button>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Scripts
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Isn’t it time you had more than just Bash and POSIX in your scripts?
              </Typography>
              <Typography variant="body2">
                We got you.
              </Typography>
              <Terminal width='100%' mb={0} mt={2}>
                <Dim>#!/usr/bin/env -S pkgx +gh +gum fish</Dim><br/>
                <br/>
                <Purple>if</Purple> gum confirm <Dim>"Are you sure you want to deploy?"</Dim><br/>
                &nbsp;&nbsp;gh release create v1.0.0<br/>
                <Purple>end</Purple><br/>
              </Terminal>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>

    <Typography align='center'>
      <Button color='inherit' href='https://docs.pkgx.sh' endIcon={<ArrowForwardIcon />}>
        Explore the docs
      </Button>
    </Typography>
  </Stack>
}

export function Dev() {
  const projects = [
    { img: charm, title: 'Charm', alt: 'Charm Logo' },
    { img: node, title: 'Node.js', alt: 'Node.js Logo' },
    { img: openai, title: 'OpenAI', alt: 'OpenAI Logo' },
    { img: python, title: 'Python', alt: 'Python Logo' },
    { img: rust, title: 'Rust', alt: 'Rust Logo' },
    { img: deno, title: 'Deno', alt: 'Deno Logo' },
    { img: go, title: 'Go', alt: 'Go Logo' },
    { img: php, title: 'PHP', alt: 'PHP Logo' },
  ]

  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return <Stack spacing={isxs ? 2 : 6}>
    <Stack spacing={1}>
      <H3>
        The <Typography component='span' variant='h3' color='primary' fontWeight='bold'>Foundation</Typography> of your Toolset
      </H3>

      <Typography variant="h5" color='text.secondary' textAlign='center'>
        The tools you need for work, where and when you need them.
      </Typography>
    </Stack>

    <Terminal>
      <Prompt /> cd myproj<br/>
      <br/>
      myproj <Prompt /> <Typography component='span' color='secondary'>dev</Typography><br/>
      found cargo.toml, package.json; <Typography component='span' color='secondary'>env</Typography> +cargo +npm<br/>
      <br/>
      <Prompt /> cargo build<br/>
      Compiling myproj v0.1.0<br/>
      <Dim># …</Dim>
    </Terminal>

    <ImageList cols={isxs ? 4 : 8} gap={isxs ? 30 : 40} sx={{my: 8, px: 2}} >
      {projects.map((item) => (
        <ImageListItem key={item.img}>
          <img
            title={item.title}
            src={item.img}
            alt={item.title}
            loading="lazy"
            style={{objectFit: "contain"}}
          />
        </ImageListItem>
      ))}
    </ImageList>
    <Typography variant='subtitle1' textAlign='right' sx={{"&&": {mt: 4}}}>
      All the tools you need for work? Check.
    </Typography>

    <div>{/* required to work around https://github.com/mui/material-ui/issues/29221 */}
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Developer Environments
              </Typography>
              <Typography color='text.secondary' my={1.5}>
                Developer environments provide the tools you need when working in those directories.
                When you step away—so do they.
              </Typography>
              <Typography align='right'>
                <Button sx={{mt: 2}} size='small' color='inherit' href='https://docs.pkgx.sh/dev' endIcon={<ArrowForwardIcon />}>
                  <code>dev</code> docs
                </Button>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Reading your Keyfiles
              </Typography>
              <Typography color='text.secondary' my={1.5}>
                <code><Orange>dev</Orange></code> works by examining the <i>keyfiles</i> in your project root.
                If we see <code>cargo.toml</code> we know that means you want Rust.
                If we see <code>pyproject.toml</code> we know you want Python, but also we read the TOML to <b>determine what package manager you want</b>.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{mt: 2}}>
            <CardContent>
              <Typography variant="h6" component="div">
                Constraining Your Dependencies
              </Typography>
              <Typography color='text.secondary' my={1.5}>
                You can constrain your dependencies to a specific version, or a range of versions by adding
                YAML front matter to your project keyfiles.
              </Typography>
              <Typography align='right'>
                <Button sx={{mt: 2}} size='small' color='inherit' href='https://docs.pkgx.sh/dev'  endIcon={<ArrowForwardIcon />}>
                  Keyfile YAML Front Matter
                </Button>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
    <Typography align='center'>
      <Button color='inherit' href='https://docs.pkgx.sh/dev' endIcon={<ArrowForwardIcon />}>
        Explore the docs
      </Button>
    </Typography>
  </Stack>
}

export function Trusted() {
  const theme = useTheme();

  return <Stack spacing={1}>
    <H3>
      Trusted by <Typography fontWeight='bold' component='span' display='inline' variant='h3' color='primary'>15k</Typography> Engineers
    </H3>

    <Typography variant="h5" color='text.secondary' textAlign='center' sx={{"&&": {mt: 1, mb: 4}}} >
      And built by them too.<br/>
      <code>pkgx</code> is open source <Typography fontWeight='inherit' component='span' color='text.primary' fontSize='inherit'>through and through</Typography>.
    </Typography>

    <Grid container spacing={2}>
      <Grid xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Packagers Who Care ❤️
            </Typography>
            <Typography sx={{ mt: 1, mb: 1.5 }} color="text.secondary">
              We go the extra mile so you don’t have to.
            </Typography>
            <Box component='ul' mb={0} color='text.secondary'>
              <li>Our <code>git</code> is configured to ignore <code>.DS_Store</code> files 😍</li>
              <li>We configure package managers to install to <code>~/.local/bin</code> (and ensure that’s in the <code>PATH</code>) unless they can write to <code>/usr/local/bin</code></li>
              <li>We codesign all our packages with both GPG and the platform code-signing engine</li>
              <li>We automatically install great git extensions like <code>git absorb</code> <i>when you type them</i></li>
              <li>We configure other version managers like <code>pyenv</code> to automatically install the Pythons you ask for</li>
              <li>We build new releases almost immediately</li>
              <li>We add everything that people want without qualms. If people want it we want it too. We love open source.</li>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12} md={6}>
        <Card sx={{mb: 2}}>
          <CardContent>
            <Typography variant="h5" component="div">
              “The UNIX Philosophy” is in our DNA
            </Typography>
            <Typography sx={{ my: 1 }} color="text.secondary">
              We study and preach it, worship and practice it.
              It’s 100% who we are and everything we believe in and <code>pkgx</code> is UNIX through and through.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Open Source is in our DNA too
            </Typography>
            <Typography sx={{ my: 1 }} color="text.secondary">
              Our founder, Max Howell, created Homebrew the package manager used by tens of millions of developers around the world.
              He understands how important community is to open source.
            </Typography>
            <Typography color="text.secondary" sx={{ my: 2 }}>
              He built it before.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              He’s building it again.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Stack>
}
