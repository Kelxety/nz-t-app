import { NzTableFilterFn, NzTableFilterList, NzTableQueryParams, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface QueryParams<T> extends NzTableQueryParams {
  page: number | null;
  pageSize: number | null;
  sort: Array<{
    key: string;
    value: NzTableSortOrder;
  }> | null;
  filteredObject: string | null;
  orderBy?: Array<{
    key: string;
    value: NzTableSortOrder;
  }>;
  pagination: boolean | null;
}

export interface SearchParams<T, K> {
  page?: number;
  pageSize?: number;
  pagination?: boolean;
  orderBy?: K[] | K;
  filteredObject?: T;
  hasNext?: boolean;
  totalPage?: number;
  q?: string;
}

export interface ColumnItem<T> {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<T> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<T> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}
