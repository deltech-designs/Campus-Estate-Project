// ─── Property Types ──────────────────────────────────────────────────────────

export type PropertyType = 'apartment' | 'duplex' | 'commercial' | 'land';
export type PropertyStatus = 'available' | 'occupied' | 'maintenance' | 'inactive';

export interface IProperty {
  _id: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  address: string;
  rentAmount: number;
  bedrooms: number;
  estateZone: string;
  amenities: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePropertyPayload {
  title: string;
  type: PropertyType;
  address: string;
  rentAmount: number;
  bedrooms: number;
  estateZone: string;
  amenities?: string[];
}

export type IUpdatePropertyPayload = Partial<ICreatePropertyPayload>;
