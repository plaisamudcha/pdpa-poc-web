import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import Login from '@/pages/Auth/Login';
import UserTable from '@/pages/Admin/User/UserTable';
import AuditLogTable from '@/pages/Admin/AuditLog/AuditLogTable';
import ConsentDocumentTable from '@/pages/Admin/ConsentDocument/ConsentDocumentTable';
import AuthGuard from './route-guard/AuthGuard';
import GuestGuard from './route-guard/GuestGuard';
import PermissionGuard from './route-guard/PermissionGuard';

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
        { path: 'admin/users', element: <UserTable /> },
        // ทุก role เปิดอ่านได้ (ใช้เปิดให้เจ้าของข้อมูลอ่าน) — อัปโหลดได้เฉพาะ dpo
        { path: 'admin/consent-documents', element: <ConsentDocumentTable /> },
        {
          path: 'admin/audit-logs',
          element: (
            <PermissionGuard permission="audit">
              <AuditLogTable />
            </PermissionGuard>
          )
        }
      ]
    },
    { path: '*', element: <Navigate to="/" replace /> }
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
