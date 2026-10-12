type TypePiiField = 'firstName' | 'lastName' | 'email' | 'citizenId' | 'phone' | 'address' | 'healthNote';

type TypeStaffRole = 'support' | 'admin' | 'dpo';

/** ค่าของแต่ละ field อาจถูก mask หรือเป็น [REDACTED] ตามสิทธิ์ของ role */
type TypeResUserData = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  citizenId?: string;
  phone?: string;
  address?: string;
  healthNote?: string;
  revealed: TypePiiField[];
  createdAt: string;
  updatedAt: string;
  retentionUntil: string;
};

type TypeResUserList = IPagination<TypeResUserData>;

type TypeCreateUser = {
  firstName: string;
  lastName: string;
  email: string;
  citizenId?: string;
  phone?: string;
  address?: string;
  healthNote?: string;
};

type TypeUpdateUser = Partial<TypeCreateUser>;

type TypeUserExport = {
  userId: string;
  exportedAt: string;
  data: Partial<Record<TypePiiField, string>>;
  metadata: { createdAt: string; updatedAt: string; retentionUntil: string };
};

export type { TypePiiField, TypeStaffRole, TypeResUserData, TypeResUserList, TypeCreateUser, TypeUpdateUser, TypeUserExport };
