import apiClient from '../axios';
import { TypeCreateUser, TypeResUserData, TypeResUserList, TypeUpdateUser, TypeUserExport } from '@/types/products/user';

async function listUser({ search, page, pageSize }: { search?: string; page?: number; pageSize?: number }): Promise<IReturnResponse<TypeResUserList>> {
  const params = new URLSearchParams();

  if (search) params.append('search', search);
  if (page !== undefined) params.append('page', page.toString());
  if (pageSize !== undefined) params.append('pageSize', pageSize.toString());

  const res = await apiClient({
    method: 'GET',
    url: `/user?${params.toString()}`
  });

  return res.data;
}

async function getUserById({ id, reveal, reason }: { id: string; reveal?: boolean; reason?: string }): Promise<IReturnResponse<TypeResUserData>> {
  const params = new URLSearchParams();

  if (reveal) params.append('reveal', 'true');
  if (reason) params.append('reason', reason);

  const res = await apiClient({
    method: 'GET',
    url: `/user/${id}?${params.toString()}`
  });

  return res.data;
}

async function createUser({ data }: { data: TypeCreateUser }): Promise<IReturnResponse<{ id: string }>> {
  const res = await apiClient({
    method: 'POST',
    url: '/user',
    data
  });

  return res.data;
}

async function updateUser({ id, data }: { id: string; data: TypeUpdateUser }): Promise<IReturnResponse<{ id: string }>> {
  const res = await apiClient({
    method: 'PUT',
    url: `/user/${id}`,
    data
  });

  return res.data;
}

async function deleteUser({ id, reason }: { id: string; reason: string }): Promise<IReturnResponse<{ id: string }>> {
  const res = await apiClient({
    method: 'DELETE',
    url: `/user/${id}`,
    data: { reason }
  });

  return res.data;
}

async function exportUser({ id }: { id: string }): Promise<IReturnResponse<TypeUserExport>> {
  const res = await apiClient({
    method: 'GET',
    url: `/user/${id}/export`
  });

  return res.data;
}

export { listUser, getUserById, createUser, updateUser, deleteUser, exportUser };
