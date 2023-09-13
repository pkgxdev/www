import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main: '#444FE2',
    },
    secondary: {
      main: '#F26312',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#0D1117',
      paper: '#0D1117'
    },
    text: {
      primary: "#EDF2EF"
    }
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          ":hover": {
            textDecoration: "underline",
          },
        },
      },
    },
  },
});

export default theme;
