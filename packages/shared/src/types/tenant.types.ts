// ─── Tenant Types ─────────────────────────────────────────────────────────────

export type TenantStatus = 'active' | 'inactive' | 'blacklisted';

export interface IEmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface ITenant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nin: string;
  status: TenantStatus;
  emergencyContact: IEmergencyContact;
  documents: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTenantPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nin: string;
  emergencyContact: IEmergencyContact;
  documents?: string[];
}

export type IUpdateTenantPayload = Partial<ICreateTenantPayload>;
