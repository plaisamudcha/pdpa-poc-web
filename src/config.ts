export const API_URL = import.meta.env.VITE_APP_API_URL ?? 'http://localhost:3041/api/v1';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

/** event ที่ axios ยิงเมื่อ API ตอบ 401 — AuthContext ฟังแล้วล้างสถานะ login */
export const SESSION_EXPIRED_EVENT = 'pdpa-poc:session-expired';
