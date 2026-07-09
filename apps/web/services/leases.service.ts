import type { ILease, ICreateLeasePayload, IUpdateLeasePayload } from '@ems/shared';
import { API_URL as API } from '@/lib/config';
const base = `${API}/api/leases`;
const headers = { 'Content-Type': 'application/json' };
const creds = { credentials: 'include' as const };

export const leasesService = {
  async getAll(): Promise<ILease[]> { const r = await fetch(base, creds); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async getById(id: string): Promise<ILease> { const r = await fetch(`${base}/${id}`, creds); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async create(payload: ICreateLeasePayload): Promise<ILease> { const r = await fetch(base, { method: 'POST', headers, ...creds, body: JSON.stringify(payload) }); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async update(id: string, payload: IUpdateLeasePayload): Promise<ILease> { const r = await fetch(`${base}/${id}`, { method: 'PATCH', headers, ...creds, body: JSON.stringify(payload) }); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async remove(id: string): Promise<void> { const r = await fetch(`${base}/${id}`, { method: 'DELETE', ...creds }); const j = await r.json(); if (!j.success) throw new Error(j.message); },
};
