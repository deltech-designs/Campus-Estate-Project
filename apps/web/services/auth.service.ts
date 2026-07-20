import type { IUser, ILoginPayload, IRegisterPayload, IForgotPasswordPayload, IResetPasswordPayload, IRegisterResponse, IVerifyOtpPayload } from '@ems/shared';

import { API_URL as API } from '@/lib/config';

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
    // POST to the Next.js proxy route (/api/auth/login) so it can set the
    // ems_token cookie on the Vercel domain for the middleware to read.
    const res = await fetch('/api/auth/login', {
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
    // POST to the Next.js proxy route so it clears the cookie on the Vercel domain.
    await fetch('/api/auth/logout', {
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
