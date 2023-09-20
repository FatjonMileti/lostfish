import { AreaUnit, Building, BuildPurpose, Furnished, OutsideSpace, Parking } from './property.constants';

export type FurnishedType = ObjectValues<typeof Furnished>;
export type OutsideSpaceType = ObjectValues<typeof OutsideSpace>;
export type AreaUnitType = ObjectValues<typeof AreaUnit>;
export type PropertyFormType = {
  title: string;
  location: {
    latitude?: number;
    longitude?: number;
  };
  minBudget: number;
  maxBudget: number;
  bedrooms: number;
  bathrooms: number;
  buildingType: BuildingType;
  flatDetails?: {
    propertyPurpose?: BuildPurposeType;
    floor?: number;
    lift?: boolean;
    security?: boolean;
  };
  furniture?: FurnishedType;
  outsideSpace: {
    [key in OutsideSpaceType]?: boolean;
  };
  area: number;
  areaUnit: AreaUnitType;
  parkingSpot: string;
  parkingType?: ParkingType;
  epcRating: string;
  description: string;
  locationDetails: string;
  areaOfInterest: string;
  propertyImages: any[];
};

declare type ObjectValues<T> = T[keyof T];

export type ParkingType = ObjectValues<typeof Parking>;

export type BuildingType = ObjectValues<typeof Building>;

export type BuildPurposeType = ObjectValues<typeof BuildPurpose>;
