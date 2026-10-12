import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SESSION_EXPIRED_EVENT } from '@/config';
import { getMe, login as loginApi, logout as logoutApi } from '@/services/api/auth';
import { TypeLogin, TypeStaffProfile } from '@/types/products/auth';

type AuthContextValue = {
  isInitialized: boolean;
  user: TypeStaffProfile | null;
  login: (data: TypeLogin) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * เก็บสถานะ login ของพนักงาน
 * token อยู่ใน httpOnly cookie (JavaScript อ่านไม่ได้) — ฝั่งเว็บรู้ว่า login อยู่หรือไม่จาก GET /auth/me
 */
function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<TypeStaffProfile | null>(null);

  // ล้างข้อมูลที่ cache ไว้ทุกครั้งที่เปลี่ยนคน — กันข้อมูลของ role เดิมค้างให้คนถัดไปเห็น
  const clearSession = useCallback(() => {
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.payload))
      .catch(() => setUser(null))
      .finally(() => setIsInitialized(true));
  }, []);

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, clearSession);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, clearSession);
  }, [clearSession]);

  const login = useCallback(
    async (data: TypeLogin) => {
      const res = await loginApi(data);
      queryClient.clear();
      setUser(res.payload);
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(() => ({ isInitialized, user, login, logout }), [isInitialized, user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
