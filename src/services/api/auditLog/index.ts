import apiClient from '../axios';
import { TypeAuditLogFilter, TypeResAuditLogList } from '@/types/products/auditLog';

async function listAuditLog({
  page,
  pageSize,
  ...filter
}: TypeAuditLogFilter & { page?: number; pageSize?: number }): Promise<IReturnResponse<TypeResAuditLogList>> {
  const params = new URLSearchParams();

  Object.entries(filter).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  if (page !== undefined) params.append('page', page.toString());
  if (pageSize !== undefined) params.append('pageSize', pageSize.toString());

  const res = await apiClient({
    method: 'GET',
    url: `/audit-log?${params.toString()}`
  });

  return res.data;
}

export { listAuditLog };
