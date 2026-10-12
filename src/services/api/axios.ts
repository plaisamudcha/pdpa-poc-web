import axios from 'axios';
import * as conf from '@/config';

const intance = axios.create({
  baseURL: conf.API_URL,
  // ส่ง httpOnly cookie ที่เก็บ JWT ไปกับทุก request (JavaScript อ่าน token ไม่ได้)
  withCredentials: true
});

intance.interceptors.request.use(
  (request) => {
    request.headers['Content-Type'] = 'application/json;charset=UTF-8';
    return request;
  },
  (error) => Promise.reject(error)
);

intance.interceptors.response.use(
  (response) => response,
  (error) => {
    // session หมดอายุหรือถูกปิดบัญชี — แจ้ง AuthContext ให้ล้างสถานะ แล้ว AuthGuard จะพากลับหน้า login
    if (error.response?.status === 401 && !String(error.config?.url ?? '').startsWith('/auth/login')) {
      window.dispatchEvent(new Event(conf.SESSION_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

/** ดึงข้อความ error จาก response ของ API (envelope ปกติ หรือ validate error) */
export function getErrorMessage(error: unknown): string {
  const data = (error as { response?: { data?: { message?: string; errors?: unknown } } })?.response?.data;
  const errors = data?.errors as Record<string, { msg?: string; message?: string }> | { message?: string } | undefined;

  if (errors && typeof errors === 'object') {
    if ('message' in errors && typeof errors.message === 'string') return errors.message;
    const first = Object.entries(errors)[0];
    if (first) return `${first[0]}: ${(first[1] as { msg?: string })?.msg ?? 'ไม่ถูกต้อง'}`;
  }
  return data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่';
}

export default intance;
