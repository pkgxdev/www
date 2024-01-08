import { Typography, styled } from "@mui/material";

const StyledTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: 300,
  textTransform: 'uppercase',
  fontSize: 80,
  fontFamily: 'shader, Roboto, sans-serif',
  [theme.breakpoints.down("md")]: {
    fontSize: 40,
  },
}));

export default function HeroTypography({ children, ...props }: React.ComponentProps<typeof Typography>) {
  return <StyledTypography className='text-gradient' variant='h1' {...props}>{children}</StyledTypography>
}
