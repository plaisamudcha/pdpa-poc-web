import { TypeAuditActorRole } from './auditLog';

/**
 * สถานะความยินยอมเทียบกับเอกสารเวอร์ชันล่าสุด
 *  - accepted: ยอมรับเวอร์ชันล่าสุดแล้ว / outdated: ยอมรับเวอร์ชันเก่า ต้องยอมรับใหม่
 *  - withdrawn: ถอนความยินยอมแล้ว / none: ยังไม่เคยยอมรับ
 */
type TypeConsentStatus = 'accepted' | 'outdated' | 'withdrawn' | 'none';

type TypeConsentAction = 'accept' | 'withdraw';

type TypeStaffRef = { id: string; role: TypeAuditActorRole; username: string | null; displayName: string | null };

type TypeConsentDocument = {
  id: string;
  version: number;
  title: string;
  note: string | null;
  fileName: string;
  fileSize: number;
  sha256: string;
  uploadedBy: TypeStaffRef;
  createdAt: string;
};

type TypeConsentSummary = { status: TypeConsentStatus; version: number | null; latestVersion: number | null };

type TypeConsentRecord = {
  id: string;
  action: TypeConsentAction;
  version: number;
  reason: string | null;
  recordedBy: TypeStaffRef;
  createdAt: string;
};

type TypeUserConsent = TypeConsentSummary & {
  userId: string;
  latestDocument: TypeConsentDocument | null;
  history: TypeConsentRecord[];
};

type TypeUploadConsentDocument = { file: File; title: string; note?: string };

type TypeRecordConsent = { action: 'accept'; version: number } | { action: 'withdraw'; reason: string };

export type {
  TypeConsentStatus,
  TypeConsentAction,
  TypeStaffRef,
  TypeConsentDocument,
  TypeConsentSummary,
  TypeConsentRecord,
  TypeUserConsent,
  TypeUploadConsentDocument,
  TypeRecordConsent
};
