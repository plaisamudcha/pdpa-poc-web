import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import Login from '@/pages/Auth/Login';
import UserTable from '@/pages/Admin/User/UserTable';
import AuthGuard from './route-guard/AuthGuard';
import GuestGuard from './route-guard/GuestGuard';

// ==============================|| ROUTES RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
      )
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        { index: true, element: <Navigate to="/admin/users" replace /> },
        { path: 'admin/users', element: <UserTable /> }
      ]
    },
    { path: '*', element: <Navigate to="/" replace /> }
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
