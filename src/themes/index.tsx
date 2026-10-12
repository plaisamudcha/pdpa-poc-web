import { ReactNode } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#1e5bb8' },
    background: { default: '#f4f6fa' }
  },
  typography: {
    fontFamily: "'Sarabun', 'Helvetica', 'Arial', sans-serif"
  },
  shape: { borderRadius: 8 }
});

export default function ThemeCustomization({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
