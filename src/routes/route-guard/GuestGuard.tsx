import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

/** หน้าสำหรับคนที่ยังไม่ login (หน้า login) — login อยู่แล้วพาไปหน้าหลัก */
export default function GuestGuard({ children }: { children: ReactNode }) {
  const { isInitialized, user } = useAuth();

  if (isInitialized && user) {
    return <Navigate to="/admin/users" replace />;
  }

  return children;
}
