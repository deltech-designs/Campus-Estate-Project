import type { IStaff, ICreateStaffPayload, IUpdateStaffPayload } from '@ems/shared';
import { API_URL as API } from '@/lib/config';
const base = `${API}/api/staff`;
const headers = { 'Content-Type': 'application/json' };
const creds = { credentials: 'include' as const };

export const staffService = {
  async getAll(): Promise<IStaff[]> { const r = await fetch(base, creds); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async getById(id: string): Promise<IStaff> { const r = await fetch(`${base}/${id}`, creds); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async create(payload: ICreateStaffPayload): Promise<IStaff> { const r = await fetch(base, { method: 'POST', headers, ...creds, body: JSON.stringify(payload) }); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async update(id: string, payload: IUpdateStaffPayload): Promise<IStaff> { const r = await fetch(`${base}/${id}`, { method: 'PATCH', headers, ...creds, body: JSON.stringify(payload) }); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async remove(id: string): Promise<void> { const r = await fetch(`${base}/${id}`, { method: 'DELETE', ...creds }); const j = await r.json(); if (!j.success) throw new Error(j.message); },
};
