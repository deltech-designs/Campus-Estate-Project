import type { IUser, ILoginPayload, IRegisterPayload } from '@ems/shared';

const API = process.env['NEXT_PUBLIC_API_URL']!;

interface AuthResponse {
  user: IUser;
}

export const authService = {
  async register(payload: IRegisterPayload): Promise<AuthResponse> {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return json.data as AuthResponse;
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
    return json.data as AuthResponse;
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
};
