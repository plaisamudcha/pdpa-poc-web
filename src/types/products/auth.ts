import { TypeStaffRole } from './user';

type TypeStaffProfile = {
  id: string;
  username: string;
  displayName: string;
  role: TypeStaffRole;
};

type TypeLogin = {
  username: string;
  password: string;
};

export type { TypeStaffProfile, TypeLogin };
