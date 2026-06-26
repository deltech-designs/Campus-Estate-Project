// ─── User / Auth Types ────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'tenant';

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export interface IJwtPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
