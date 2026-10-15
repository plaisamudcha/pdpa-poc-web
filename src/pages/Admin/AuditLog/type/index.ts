import { TypeAuditAction, TypeAuditResult } from '@/types/products/auditLog';

/** ค่าในฟอร์มตัวกรอง (ยังไม่กดค้นหา) — ช่องว่าง = ไม่กรอง */
export type AuditLogFilterForm = {
  action: TypeAuditAction | '';
  result: TypeAuditResult | '';
  username: string;
  subjectId: string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
};
