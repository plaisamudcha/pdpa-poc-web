import { TypePiiField, TypeStaffRole } from '@/types/products/user';

export const PII_LABEL: Record<TypePiiField, string> = {
  firstName: 'ชื่อ',
  lastName: 'นามสกุล',
  email: 'อีเมล',
  citizenId: 'เลขบัตรประชาชน',
  phone: 'เบอร์โทร',
  address: 'ที่อยู่',
  healthNote: 'ข้อมูลสุขภาพ (อ่อนไหว)'
};

/** ต้องตรงกับ ROLE_POLICY ฝั่ง API — ใช้แค่ปิดปุ่มบน UI, API เป็นคนบังคับสิทธิ์จริง */
export const ROLE_POLICY: Record<TypeStaffRole, { label: string; reveal: string; create: boolean; update: boolean; erase: boolean; export: boolean }> =
  {
    support: { label: 'Support', reveal: 'เห็นแบบ mask เท่านั้น', create: true, update: false, erase: false, export: false },
    admin: { label: 'Admin', reveal: 'เปิดดู PII ได้ (ยกเว้นข้อมูลอ่อนไหว)', create: true, update: true, erase: false, export: false },
    dpo: { label: 'DPO', reveal: 'เปิดดูได้ทั้งหมด', create: true, update: true, erase: true, export: true }
  };


