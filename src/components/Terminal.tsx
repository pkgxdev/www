import { useMediaQuery, Box, Card, Typography, useTheme } from "@mui/material";

export default function Terminal({ children, width, mb, mt }: { children: React.ReactNode, width?: string, mb?: number, mt?: number }) {
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  const stoplights = width === undefined ? true : undefined
  const sx = {p: isxs ? 2 : 4} as any
  if (stoplights) sx.pt = 6

  return <Box
    sx={{
      fontFamily: 'monospace',
      width: width ?? '100%',
      typography: 'code',
      whiteSpace: 'pre',
      overflowX: 'auto',
      display: 'block',
      mx: 'auto',
      mb: mb ?? 4,
      mt: mt ?? 4,
      overflow: 'visible',
      fontSize: isxs ? 14 : undefined
  }}>
    <Card variant="outlined" sx={sx} data-terminal={stoplights}>
      {children}
    </Card>
  </Box>
}

export function Dim({ children }: { children: React.ReactNode }) {
  return <span style={{opacity: 0.6}}>{children}</span>
}

export function Purple({ children }: { children: React.ReactNode }) {
  return <Typography component="span" color='primary' fontFamily='inherit'>{children}</Typography>
}

export function Orange({children}: {children: React.ReactNode}) {
  return <Typography component='span' color='secondary' fontFamily='inherit'>
    {children}
  </Typography>
}

export function Prompt() {
  return <Dim>$</Dim>
}
