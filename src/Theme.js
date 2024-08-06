// src/Theme.js

import { createTheme } from '@mui/material/styles';

// Määrittele mukautettu teema
const theme = createTheme({
  palette: {
    primary: {
      main:'#000000', // Määritä pääväri
    },
    secondary: {
      main: '#000000', // Määritä toissijainen väri
    },
  },
  typography: {
    h1: {
      fontSize: '2.2rem',
    },
    h2: {
      fontSize: '2rem',
    },
  },
});

export default theme;
