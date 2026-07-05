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
  avatar?: string;
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

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  password?: string;
}

export interface IVerifyOtpPayload {
  email: string;
  code: string;
}

export interface IRegisterResponse {
  user?: IUser;
  token?: string;
  otpRequired?: boolean;
  otp?: string;
}
