import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';

// fonts
import '@fontsource/sarabun/400.css';
import '@fontsource/sarabun/500.css';
import '@fontsource/sarabun/600.css';

// project-imports
import App from './App';
import queryClient from './services/queries/queryClient';

const container = document.getElementById('root');
const root = createRoot(container!);

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
