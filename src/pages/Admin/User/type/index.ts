import { TypeResUserData } from '@/types/products/user';

export type UserModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; user: TypeResUserData }
  | { type: 'view'; user: TypeResUserData }
  | { type: 'delete'; user: TypeResUserData }
  | { type: 'consent'; user: TypeResUserData };

export type UserSearchState = {
  search: string;
  page: number;
  pageSize: number;
};
