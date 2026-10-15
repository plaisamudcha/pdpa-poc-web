import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listAuditLog } from '@/services/api/auditLog';
import { TypeAuditLogFilter } from '@/types/products/auditLog';
import { TypeStaffRole } from '@/types/products/user';

function useGetAuditLogsQuery({
  role,
  page,
  pageSize,
  filter
}: {
  role: TypeStaffRole;
  page: number;
  pageSize: number;
  filter: TypeAuditLogFilter;
}) {
  return useQuery({
    queryFn: () => listAuditLog({ ...filter, page, pageSize }),
    queryKey: ['GET_LIST_AUDIT_LOGS', role, filter, page, pageSize],
    placeholderData: keepPreviousData
  });
}

export { useGetAuditLogsQuery };
