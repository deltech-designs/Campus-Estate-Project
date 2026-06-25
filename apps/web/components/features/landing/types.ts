import type { IProperty } from '@ems/shared';

export interface IEnhancedProperty extends IProperty {
  description: string;
  distanceToCampus: string;
  landlordName: string;
  landlordRating: number;
  landlordResponse: string;
  walkMinutes: number;
  isPopular?: boolean;
}
