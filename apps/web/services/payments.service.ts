import type { IPayment, ICreatePaymentPayload, IUpdatePaymentPayload } from '@ems/shared';
const API = process.env['NEXT_PUBLIC_API_URL'] || '';
const base = `${API}/api/payments`;
const headers = { 'Content-Type': 'application/json' };
const creds = { credentials: 'include' as const };

export const paymentsService = {
  async getAll(): Promise<IPayment[]> { const r = await fetch(base, creds); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async getById(id: string): Promise<IPayment> { const r = await fetch(`${base}/${id}`, creds); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async create(payload: ICreatePaymentPayload): Promise<IPayment> { const r = await fetch(base, { method: 'POST', headers, ...creds, body: JSON.stringify(payload) }); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async update(id: string, payload: IUpdatePaymentPayload): Promise<IPayment> { const r = await fetch(`${base}/${id}`, { method: 'PATCH', headers, ...creds, body: JSON.stringify(payload) }); const j = await r.json(); if (!j.success) throw new Error(j.message); return j.data; },
  async remove(id: string): Promise<void> { const r = await fetch(`${base}/${id}`, { method: 'DELETE', ...creds }); const j = await r.json(); if (!j.success) throw new Error(j.message); },
};
