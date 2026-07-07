import type { IVendor, ICreateVendorPayload, IUpdateVendorPayload } from '@ems/shared';
const API = process.env['NEXT_PUBLIC_API_URL']!;
const base = `${API}/api/vendors`;
const headers = { 'Content-Type': 'application/json' };
const creds = { credentials: 'include' as const };

export const vendorsService = {
  async getAll(): Promise<IVendor[]> { const r = await fetch(base, creds); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async getById(id: string): Promise<IVendor> { const r = await fetch(`${base}/${id}`, creds); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async create(payload: ICreateVendorPayload): Promise<IVendor> { const r = await fetch(base, { method: 'POST', headers, ...creds, body: JSON.stringify(payload) }); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async update(id: string, payload: IUpdateVendorPayload): Promise<IVendor> { const r = await fetch(`${base}/${id}`, { method: 'PATCH', headers, ...creds, body: JSON.stringify(payload) }); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async remove(id: string): Promise<void> { const r = await fetch(`${base}/${id}`, { method: 'DELETE', ...creds }); const j = await r.json(); if (!j.success) throw new Error(j.message); },
};
