/// <reference types="react-scripts" />


interface IGridState {
  loading: boolean;
  rows: any[];
  totalRows: number;
  rowsPerPageOptions: number[];
  pageSize: number;
  page: number;
  rowCount: number;
  sort: string;
  asc: boolean;
  selectedIds: string[];
  search?: string;
  filters?: { [key: string]: any };
  totalDocsUnfiltered?: number;
}

interface IProperty {
  condition: string;
  parking_details: string;
  parking_spot: number;
  _id: string;
  property_images: { link: string }[];
  area_of_interest: string;
  property_type?: string;
  floor_size: string;
  floor_size_unit: AreaUnitType;
  specific_property_features?: string[];
  contract_details?: string[];
  room_details: {
    number_of_bathrooms: string;
    number_of_bedrooms: string;
  };
  budget: {
    min_budget: number;
    max_budget: number;
  };
  flat_details: any;
  house_details: any;
  title: string;
  description: string;
  location_details: string;
  asset_rent: {
    rental_amount?: string;
  };
  id: string;
  asset_address: any;
  created_by: {
    _id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  percentage: number;
}

declare global {
  interface Window {
    FB: any;
  }
}
