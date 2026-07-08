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
  landlordId?: IPopulatedLandlord | string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPopulatedLandlord {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ICreatePropertyPayload {
  title: string;
  type: PropertyType;
  address: string;
  rentAmount: number;
  bedrooms: number;
  estateZone: string;
  amenities?: string[];
  landlordId?: string;
}

export type IUpdatePropertyPayload = Partial<ICreatePropertyPayload>;
