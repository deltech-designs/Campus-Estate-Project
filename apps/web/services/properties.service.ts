import type { IProperty, ICreatePropertyPayload } from '@ems/shared';

const API = process.env['NEXT_PUBLIC_API_URL']!;

export const propertiesService = {
  async getAll(): Promise<IProperty[]> {
    const res = await fetch(`${API}/api/properties`, { credentials: 'include' });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return json.data as IProperty[];
  },

  async getById(id: string): Promise<IProperty> {
    const res = await fetch(`${API}/api/properties/${id}`, { credentials: 'include' });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return json.data as IProperty;
  },

  async create(payload: ICreatePropertyPayload): Promise<IProperty> {
    const res = await fetch(`${API}/api/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return json.data as IProperty;
  },

  async update(id: string, payload: Partial<ICreatePropertyPayload>): Promise<IProperty> {
    const res = await fetch(`${API}/api/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
    return json.data as IProperty;
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API}/api/properties/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message as string);
  },
};
