// ─── Staff Types ──────────────────────────────────────────────────────────────

export type StaffRole = 'security' | 'cleaner' | 'facility_manager' | 'maintenance_supervisor';
export type StaffStatus = 'active' | 'on_leave' | 'terminated';

export interface IStaff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  estateZone?: string;
  hireDate: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  estateZone?: string;
  hireDate: string;
}

export type IUpdateStaffPayload = Partial<ICreateStaffPayload> & {
  status?: StaffStatus;
};
