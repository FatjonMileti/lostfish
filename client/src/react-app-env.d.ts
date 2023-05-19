/// <reference types="react-scripts" />

declare interface IAPIResponse {
  docs: any;
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
  message?: string;
}

declare interface IGridState {
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
}

declare global {
  interface Window {
    FB: any;
  }
}
