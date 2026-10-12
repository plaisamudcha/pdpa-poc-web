import { createUser, deleteUser, exportUser, getUserById, listUser, updateUser } from '@/services/api/user';
import { TypeStaffRole } from '@/types/products/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// role อยู่ใน queryKey — สลับ role แล้วต้องดึงข้อมูลใหม่ เพราะสิทธิ์การเห็นข้อมูลต่างกัน
function useGetUsersQuery({ role, search, page, pageSize }: { role: TypeStaffRole; search?: string; page?: number; pageSize?: number }) {
  return useQuery({
    queryFn: () => listUser({ search, page, pageSize }),
    queryKey: ['GET_LIST_USERS', role, search, page, pageSize]
  });
}

function useGetUserByIdQuery({ role, id, enable }: { role: TypeStaffRole; id: string; enable?: boolean }) {
  return useQuery({
    queryFn: () => getUserById({ id }),
    queryKey: ['GET_USER_BY_ID', role, id],
    enabled: enable
  });
}

/** เปิดดูข้อมูลเต็ม — เป็น mutation เพราะต้องระบุเหตุผลและถูกบันทึก audit log ทุกครั้ง (ไม่ cache) */
function useRevealUserMutation() {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => getUserById({ id, reveal: true, reason }),
    mutationKey: ['REVEAL_USER']
  });
}

function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    mutationKey: ['CREATE_USER'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_LIST_USERS'] });
    }
  });
}

function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    mutationKey: ['UPDATE_USER'],
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['GET_LIST_USERS'] });
      queryClient.invalidateQueries({ queryKey: ['GET_USER_BY_ID'], predicate: (q) => q.queryKey.includes(variables.id) });
    }
  });
}

function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    mutationKey: ['DELETE_USER'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['GET_LIST_USERS'] });
    }
  });
}

function useExportUserMutation() {
  return useMutation({
    mutationFn: exportUser,
    mutationKey: ['EXPORT_USER']
  });
}

export {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useRevealUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useExportUserMutation
};
