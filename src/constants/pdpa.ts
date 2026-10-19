import { TypeAuditAction, TypeAuditActorRole, TypeAuditResult } from '@/types/products/auditLog';
import { TypeConsentAction, TypeConsentStatus } from '@/types/products/consent';
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

/** ต้องตรงกับ ROLE_POLICY ฝั่ง API — ใช้แค่ปิดปุ่ม/ซ่อนเมนูบน UI, API เป็นคนบังคับสิทธิ์จริง */
export const ROLE_POLICY: Record<
  TypeStaffRole,
  {
    label: string;
    reveal: string;
    create: boolean;
    update: boolean;
    erase: boolean;
    export: boolean;
    audit: boolean;
    consent: boolean;
    document: boolean;
  }
> = {
  support: {
    label: 'Support',
    reveal: 'เห็นแบบ mask เท่านั้น',
    create: true,
    update: false,
    erase: false,
    export: false,
    audit: false,
    consent: true,
    document: false
  },
  admin: {
    label: 'Admin',
    reveal: 'เปิดดู PII ได้ (ยกเว้นข้อมูลอ่อนไหว)',
    create: true,
    update: true,
    erase: false,
    export: false,
    audit: false,
    consent: true,
    document: false
  },
  dpo: {
    label: 'DPO',
    reveal: 'เปิดดูได้ทั้งหมด',
    create: true,
    update: true,
    erase: true,
    export: true,
    audit: true,
    consent: true,
    document: true
  }
};

/** ต้องตรงกับ MAX_CONSENT_FILE_MB ฝั่ง API */
export const MAX_CONSENT_FILE_MB = 10;

export const CONSENT_STATUS_LABEL: Record<TypeConsentStatus, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  accepted: { label: 'ยอมรับแล้ว', color: 'success' },
  outdated: { label: 'ต้องยอมรับใหม่', color: 'warning' },
  withdrawn: { label: 'ถอนความยินยอม', color: 'error' },
  none: { label: 'ยังไม่ยอมรับ', color: 'default' }
};

export const CONSENT_ACTION_LABEL: Record<TypeConsentAction, string> = {
  accept: 'ยอมรับ',
  withdraw: 'ถอนความยินยอม'
};

export const AUDIT_ACTION_LABEL: Record<TypeAuditAction, string> = {
  login: 'เข้าสู่ระบบ',
  logout: 'ออกจากระบบ',
  list: 'ดูรายการ',
  search: 'ค้นหา',
  read: 'ดูรายละเอียด',
  create: 'เพิ่มผู้ใช้',
  update: 'แก้ไข',
  export: 'ส่งออกข้อมูล',
  erase: 'ลบข้อมูล',
  consent: 'ยอมรับ PDPA',
  withdraw_consent: 'ถอนความยินยอม',
  upload_document: 'อัปโหลดเอกสาร PDPA'
};

export const AUDIT_RESULT_LABEL: Record<TypeAuditResult, { label: string; color: 'success' | 'error' | 'warning' }> = {
  ok: { label: 'สำเร็จ', color: 'success' },
  denied: { label: 'ถูกปฏิเสธ', color: 'error' },
  not_found: { label: 'ไม่พบข้อมูล', color: 'warning' }
};

export const AUDIT_ROLE_LABEL: Record<TypeAuditActorRole, string> = {
  support: 'Support',
  admin: 'Admin',
  dpo: 'DPO',
  system: 'ระบบ',
  anonymous: 'ไม่ทราบตัวตน'
};
