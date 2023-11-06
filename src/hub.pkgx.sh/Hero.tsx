import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import HeroTypography from "../components/HeroTypography"

export default function Hero() {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  return <Stack spacing={6} textAlign='center' mx='auto' alignItems='center' sx={isxs ? undefined : {"&&": {mt: 22}}}>
    <Typography my={1.5} color="text.secondary">
      Scripts are the glue that binds the gems of UNIX and open source together.
    </Typography>
    <HeroTypography>Scripting Without Limits</HeroTypography>
    <Typography variant="h5" px={1} sx={{"&&": {mt: 6.5}}}  maxWidth={isxs ? undefined : 570}>
      Create powerful scripts that can run anything.
    </Typography>
  </Stack>
}
