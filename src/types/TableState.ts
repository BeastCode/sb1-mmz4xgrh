export interface TableState {
  filters: Record<string, any>;
  sortField: string | null;
  sortOrder: number | null;
  globalFilter: string;
  visibleColumns: string[];
  size: string;
  rows: number;
}