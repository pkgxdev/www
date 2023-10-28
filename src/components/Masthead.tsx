import { Stack, Link, Box, useTheme, useMediaQuery } from "@mui/material"
import logo from "../assets/wordmarks/pkgx.svg"
import Search from "./Search"

export default function Masthead({ children }: { children?: React.ReactNode }) {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return <Stack spacing={1} direction="row" alignItems="center">
    <Link href="https://pkgx.dev">
      <Box component='img' src={logo} height={isxs ? 20 : 28} display='block' />
    </Link>
    <Box flexGrow={1} />
    {children}
    {/*TODO isxs ? undefined : <Search />*/}
  </Stack>
}
