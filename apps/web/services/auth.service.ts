import type { IUser, ILoginPayload, IRegisterPayload, IForgotPasswordPayload, IResetPasswordPayload, IRegisterResponse, IVerifyOtpPayload } from '@ems/shared';

const API = process.env['NEXT_PUBLIC_API_URL'] || '';

interface AuthResponse {
  user: IUser;
  token?: string;
}

export const authService = {
  async register(payload: IRegisterPayload): Promise<IRegisterResponse> {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return json.data as IRegisterResponse;
  },

  async login(payload: ILoginPayload): Promise<AuthResponse> {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    const data = json.data as AuthResponse;
    return data;
  },

  async logout(): Promise<void> {
    await fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  async getMe(): Promise<IUser> {
    const res = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return (json.data as { user: IUser }).user;
  },

  async forgotPassword(payload: IForgotPasswordPayload): Promise<{ token: string }> {
    const res = await fetch(`${API}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return json.data as { token: string };
  },

  async resetPassword(payload: IResetPasswordPayload): Promise<void> {
    const res = await fetch(`${API}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
  },

  async verifyOtp(payload: IVerifyOtpPayload): Promise<AuthResponse> {
    const res = await fetch(`${API}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    const data = json.data as AuthResponse;
    return data;
  },
};
