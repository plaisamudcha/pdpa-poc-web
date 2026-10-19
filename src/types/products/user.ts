import { TypeConsentSummary } from './consent';

type TypePiiField ='firstName' | 'lastName' | 'email' | 'citizenId' | 'phone' | 'address' | 'healthNote';

type TypeStaffRole = 'support' | 'admin' | 'dpo';

/** ค่าของแต่ละ field อาจถูก mask หรือเป็น [REDACTED] ตามสิทธิ์ของ role */
type TypeResUserData = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  citizenId?: string;
  phone?: string;
  address?: string;
  healthNote?: string;
  revealed: TypePiiField[];
  createdAt: string;
  updatedAt: string;
  retentionUntil: string;
  // มีเฉพาะในหน้ารายการ
  consent?: TypeConsentSummary;
};

type TypeResUserList = IPagination<TypeResUserData>;

type TypeCreateUser = {
  firstName: string;
  lastName: string;
  email: string;
  citizenId?: string;
  phone?: string;
  address?: string;
  healthNote?: string;
  // เวอร์ชันเอกสาร PDPA ที่เจ้าของข้อมูลยอมรับตอนสร้าง
  consentVersion?: number;
};

type TypeUpdateUser = Partial<Omit<TypeCreateUser, 'consentVersion'>>;

type TypeUserExport = {
  userId: string;
  exportedAt: string;
  data: Partial<Record<TypePiiField, string>>;
  metadata: { createdAt: string; updatedAt: string; retentionUntil: string };
};

export type { TypePiiField, TypeStaffRole, TypeResUserData, TypeResUserList, TypeCreateUser, TypeUpdateUser, TypeUserExport };
