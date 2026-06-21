// ─── Payment Types ────────────────────────────────────────────────────────────

export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'overdue';
export type PaymentMethod = 'bank_transfer' | 'card' | 'cash' | 'ussd';

export interface IPayment {
  _id: string;
  leaseId: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  receiptUrl?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePaymentPayload {
  leaseId: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  method?: PaymentMethod;
}

export type IUpdatePaymentPayload = Partial<ICreatePaymentPayload> & {
  status?: PaymentStatus;
  paidDate?: string;
  receiptUrl?: string;
};
