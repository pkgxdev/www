import { Typography, styled } from "@mui/material";

const StyledTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: 'bold',
  [theme.breakpoints.down("md")]: {
    fontSize: 65,
  },
}));

export default function HeroTypography({ children, ...props }: React.ComponentProps<typeof Typography>) {
  return <StyledTypography className='text-gradient' variant='h1' {...props}>{children}</StyledTypography>
}
