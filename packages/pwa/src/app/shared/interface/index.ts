import { Prisma } from '@prisma/client';
import { NzTableFilterValue, NzTableQueryParams, NzTableSortOrder } from 'ng-zorro-antd/table';

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

export interface SearchParams<T> {
  page?: number;
  pageSize: number;
  pagination?: boolean;
  orderBy?: string;
  filteredObject?: string;
}
