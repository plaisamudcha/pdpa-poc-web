import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ROLE_POLICY } from '@/constants/pdpa';
import useAuth from '@/hooks/useAuth';

type Permission = keyof Omit<(typeof ROLE_POLICY)[keyof typeof ROLE_POLICY], 'label' | 'reveal'>;

/** ซ่อนหน้าที่ role ไม่มีสิทธิ์ (กันพิมพ์ URL ตรง) — API ตรวจสิทธิ์ซ้ำอีกชั้นเสมอ */
export default function PermissionGuard({ permission, children }: { permission: Permission; children: ReactNode }) {
  const { user } = useAuth();

  if (!user || !ROLE_POLICY[user.role][permission]) {
    return <Navigate to="/admin/users" replace />;
  }

  return children;
}
