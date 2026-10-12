import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import useAuth from '@/hooks/useAuth';

/** ต้อง login ก่อน — ยังไม่ login พาไปหน้า /login และจำหน้าที่จะกลับมา */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isInitialized, user } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
