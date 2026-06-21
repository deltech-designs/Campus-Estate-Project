// ─── Maintenance Types ────────────────────────────────────────────────────────

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'closed';

export interface IMaintenanceRequest {
  _id: string;
  propertyId: string;
  tenantId?: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  vendorId?: string;
  scheduledDate?: string;
  completedDate?: string;
  cost?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateMaintenancePayload {
  propertyId: string;
  tenantId?: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  vendorId?: string;
  scheduledDate?: string;
}

export type IUpdateMaintenancePayload = Partial<ICreateMaintenancePayload> & {
  status?: MaintenanceStatus;
  completedDate?: string;
  cost?: number;
};
