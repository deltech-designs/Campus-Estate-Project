// ─── Vendor Types ─────────────────────────────────────────────────────────────

export type VendorStatus = 'active' | 'inactive' | 'suspended';
export type VendorSpecialty =
  | 'plumbing'
  | 'electrical'
  | 'carpentry'
  | 'painting'
  | 'cleaning'
  | 'security'
  | 'landscaping'
  | 'general';

export interface IVendor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialty: VendorSpecialty;
  status: VendorStatus;
  address?: string;
  rating?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateVendorPayload {
  name: string;
  email: string;
  phone: string;
  specialty: VendorSpecialty;
  address?: string;
}

export type IUpdateVendorPayload = Partial<ICreateVendorPayload> & {
  status?: VendorStatus;
  rating?: number;
};
