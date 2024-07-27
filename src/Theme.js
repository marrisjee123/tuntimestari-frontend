// src/Theme.js

import { createTheme } from '@mui/material/styles';

// Määrittele mukautettu teema
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Määritä pääväri
    },
    secondary: {
      main: '#dc004e', // Määritä toissijainen väri
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
