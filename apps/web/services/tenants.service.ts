import type { ITenant, ICreateTenantPayload, IUpdateTenantPayload } from '@ems/shared';

import { API_URL as API } from '@/lib/config';

export const tenantsService = {
  async getAll(): Promise<ITenant[]> {
    const res = await fetch(`${API}/api/tenants`, { credentials: 'include' });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return json.data as ITenant[];
  },

  async getById(id: string): Promise<ITenant> {
    const res = await fetch(`${API}/api/tenants/${id}`, { credentials: 'include' });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return json.data as ITenant;
  },

  async create(payload: ICreateTenantPayload): Promise<ITenant> {
    const res = await fetch(`${API}/api/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return json.data as ITenant;
  },

  async update(id: string, payload: IUpdateTenantPayload): Promise<ITenant> {
    const res = await fetch(`${API}/api/tenants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return json.data as ITenant;
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API}/api/tenants/${id}`, { method: 'DELETE', credentials: 'include' });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
  },
};
