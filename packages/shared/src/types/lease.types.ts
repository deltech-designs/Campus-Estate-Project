// ─── Lease Types ──────────────────────────────────────────────────────────────

export type LeaseStatus = 'active' | 'expired' | 'terminated' | 'renewed';

export interface ILease {
  _id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: LeaseStatus;
  renewalNotified: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateLeasePayload {
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
}

export type IUpdateLeasePayload = Partial<ICreateLeasePayload> & {
  status?: LeaseStatus;
  renewalNotified?: boolean;
};
