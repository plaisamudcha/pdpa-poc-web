import { TypePiiField } from './user';

type TypeAuditAction = 'create' | 'list' | 'search' | 'read' | 'update' | 'export' | 'erase' | 'login' | 'logout';

type TypeAuditResult = 'ok' | 'denied' | 'not_found';

/** role ใน log มี system (job ภายใน) และ anonymous (login ไม่สำเร็จ) เพิ่มจาก role พนักงาน */
type TypeAuditActorRole = 'support' | 'admin' | 'dpo' | 'system' | 'anonymous';

type TypeResAuditLog = {
  id: string;
  actor: {
    id: string;
    role: TypeAuditActorRole;
    // API เติมจาก collection staffs — เป็น null ถ้าไม่ใช่พนักงาน (system / anonymous)
    username: string | null;
    displayName: string | null;
    isActive: boolean | null;
  };
  action: TypeAuditAction;
  subjectId: string | null;
  fields: TypePiiField[];
  reason: string | null;
  result: TypeAuditResult;
  createdAt: string;
};

type TypeResAuditLogList = IPagination<TypeResAuditLog>;

type TypeAuditLogFilter = {
  action?: TypeAuditAction;
  result?: TypeAuditResult;
  username?: string;
  subjectId?: string;
  from?: string;
  to?: string;
};

export type { TypeAuditAction, TypeAuditResult, TypeAuditActorRole, TypeResAuditLog, TypeResAuditLogList, TypeAuditLogFilter };
