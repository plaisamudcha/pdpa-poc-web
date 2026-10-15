import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as conf from '@/config';
import useAuth from '@/hooks/useAuth';
import { getErrorMessage } from '@/services/api/axios';
import { useGetAuditLogsQuery } from '@/services/queries/auditLog';
import { TypeAuditLogFilter } from '@/types/products/auditLog';
import { AuditLogFilterForm } from './type';

const OBJECT_ID = /^[a-f0-9]{24}$/i;

const EMPTY_FORM: AuditLogFilterForm = { action: '', result: '', username: '', subjectId: '', from: '', to: '' };

/** แปลงฟอร์มเป็นตัวกรองที่ส่งให้ API — วันที่ใช้เวลาท้องถิ่น ต้นวัน/ท้ายวัน */
function toFilter(form: AuditLogFilterForm): TypeAuditLogFilter {
  return {
    action: form.action || undefined,
    result: form.result || undefined,
    username: form.username.trim() || undefined,
    subjectId: form.subjectId.trim() || undefined,
    from: form.from ? new Date(`${form.from}T00:00:00`).toISOString() : undefined,
    to: form.to ? new Date(`${form.to}T23:59:59.999`).toISOString() : undefined
  };
}

function validate(form: AuditLogFilterForm): string | null {
  if (form.subjectId.trim() && !OBJECT_ID.test(form.subjectId.trim())) return 'รหัสผู้ใช้ต้องเป็นตัวอักษร 0-9, a-f จำนวน 24 ตัว';
  if (form.from && form.to && form.from > form.to) return 'วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด';
  return null;
}

const useListAuditLogTable = () => {
  const role = useAuth().user!.role;
  const [searchParams] = useSearchParams();

  // เปิดจากหน้ารายละเอียดผู้ใช้ด้วย ?subjectId=... → กรองประวัติของผู้ใช้คนนั้นทันที
  const initialSubjectId = searchParams.get('subjectId') ?? '';
  const initialForm: AuditLogFilterForm = { ...EMPTY_FORM, subjectId: OBJECT_ID.test(initialSubjectId) ? initialSubjectId : '' };

  const [form, setForm] = useState<AuditLogFilterForm>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TypeAuditLogFilter>(toFilter(initialForm));
  const [page, setPage] = useState(conf.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(25);

  const { data: logsData, isLoading, isFetching, error } = useGetAuditLogsQuery({ role, page, pageSize, filter });

  const data = logsData?.payload?.datas ?? [];
  const total = logsData?.payload?.total ?? 0;

  const setField = <K extends keyof AuditLogFilterForm>(key: K, value: AuditLogFilterForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const applyForm = (next: AuditLogFilterForm) => {
    const message = validate(next);
    setFormError(message);
    if (message) return;
    setFilter(toFilter(next));
    setPage(conf.DEFAULT_PAGE);
  };

  const handleSearch = () => applyForm(form);

  const handleReset = () => {
    setForm(EMPTY_FORM);
    applyForm(EMPTY_FORM);
  };

  /** คลิกรหัสผู้ใช้ในตาราง → ดูประวัติทั้งหมดของผู้ใช้คนนั้น */
  const handleFilterSubject = (subjectId: string) => {
    const next = { ...EMPTY_FORM, subjectId };
    setForm(next);
    applyForm(next);
  };

  /** คลิก username ในตาราง → ดูทุกอย่างที่พนักงานคนนั้นทำ */
  const handleFilterActor = (username: string) => {
    const next = { ...EMPTY_FORM, username };
    setForm(next);
    applyForm(next);
  };

  const handleChangePage = (next: number) => setPage(next);

  const handleChangePageSize = (next: number) => {
    setPageSize(next);
    setPage(conf.DEFAULT_PAGE);
  };

  const hasFilter = Object.values(filter).some(Boolean);

  return {
    data,
    total,
    page,
    pageSize,
    isLoading: isLoading || isFetching,
    errorMessage: error ? getErrorMessage(error) : null,
    form,
    formError,
    hasFilter,
    setField,
    handleSearch,
    handleReset,
    handleFilterSubject,
    handleFilterActor,
    handleChangePage,
    handleChangePageSize
  };
};

export default useListAuditLogTable;
