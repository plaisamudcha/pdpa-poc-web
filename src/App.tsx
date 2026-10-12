import { RouterProvider } from 'react-router-dom';
import router from '@/routes';
import ThemeCustomization from '@/themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { SnackbarProvider } from '@/contexts/SnackbarContext';

// ==============================|| APP - THEME, AUTH, ROUTER ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <AuthProvider>
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </AuthProvider>
    </ThemeCustomization>
  );
}
