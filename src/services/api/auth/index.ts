import apiClient from '../axios';
import { TypeLogin, TypeStaffProfile } from '@/types/products/auth';

async function login(data: TypeLogin): Promise<IReturnResponse<TypeStaffProfile>> {
  const res = await apiClient({
    method: 'POST',
    url: '/auth/login',
    data
  });

  return res.data;
}

async function logout(): Promise<IReturnResponse<{ message: string }>> {
  const res = await apiClient({
    method: 'POST',
    url: '/auth/logout'
  });

  return res.data;
}

async function getMe(): Promise<IReturnResponse<TypeStaffProfile>> {
  const res = await apiClient({
    method: 'GET',
    url: '/auth/me'
  });

  return res.data;
}

export { login, logout, getMe };
