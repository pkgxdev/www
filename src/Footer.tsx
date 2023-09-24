import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Link, LinkProps, Typography, useTheme, useMediaQuery } from "@mui/material";
import ArrowOutwardIcon from '@mui/icons-material/CallMade';
import logo from "./assets/pkgx.svg";


export default function Footer() {
  const year = new Date().getFullYear()
  const theme = useTheme();
  const isxs = useMediaQuery(theme.breakpoints.down('md'));

  const ul_style = {
    listStyleType: 'none',
    paddingLeft: 0,
    marginLeft: 0,
    fontSize: 14,
    marginTop: 10
  }
  const link_props: LinkProps = {
    color: 'text.secondary',
    underline: 'none',
  }
  const c = <Typography variant="subtitle1" color='text.secondary' fontSize={14} mt={0.75}>
    ©{year} PKGX INC. All Rights Reserved
  </Typography>;

  const icon = <ArrowOutwardIcon fontSize="inherit" style={{transform: 'translateY(3px)'}} />

  return <Grid container spacing={2} columns={isxs ? 12 : 11} width='100%'>
           <Grid xs={12} md={5}>
             <img src={logo} height={18} />
             {!isxs && c}
           </Grid>
           <Grid xs={4} md={2}>
             <Typography variant="h5" fontWeight='bold' fontSize={14}>
               Product
             </Typography>
             <ul style={ul_style}>
               <Li><Link href='https://pkgx.sh' {...link_props}>pkgx</Link></Li>
               <Li><Link href='https://pkgx.app' {...link_props}>oss.app</Link></Li>
               <Li><Link href='https://docs.pkgx.sh' {...link_props}>docs</Link></Li>
               <Li><Link href='https://dist.pkgx.dev' {...link_props}>pkgs</Link></Li>
             </ul>
           </Grid>
           <Grid xs={4} md={2}>
             <Typography variant="h5" fontWeight='bold' fontSize={14}>
               Company
             </Typography>
             <ul style={ul_style}>
               <Li><Link href='https://pkgx.dev' {...link_props}>Home</Link></Li>
               <Li><Link href='https://pkgx.dev/privacy-policy' {...link_props}>Privacy Policy</Link></Li>
               <Li><Link href='https://pkgx.dev/terms-of-use' {...link_props}>Terms of Use</Link></Li>
               <Li><Link href='https://blog.pkgx.dev' {...link_props}>Blog</Link></Li>
               <Li><Link href='mailto:hi@pkgx.dev' {...link_props}>Contact{icon}</Link></Li>
             </ul>
           </Grid>
           <Grid xs={4} md={2}>
             <Typography variant="h5" fontWeight='bold' fontSize={14}>
               Community
             </Typography>
             <ul style={ul_style}>
               <Li><Link href='https://github.com/pkgXdev' {...link_props}>GitHub{icon}</Link></Li>
               <Li><Link href='https://x.com/pkgxdev' {...link_props}>𝕏{icon}</Link></Li>
               <Li><Link href='https://www.irccloud.com/irc/libera.chat/channel/pkgx' {...link_props}>irc:#pkgx{icon}</Link></Li>
             </ul>
           </Grid>
           {isxs && <Grid xs={12}>
             {c}
           </Grid>}
         </Grid>
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={{marginBottom: 2}}>{children}</li>
}
