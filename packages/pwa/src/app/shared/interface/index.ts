import { Prisma } from '@prisma/client';
import { NzTableFilterValue, NzTableQueryParams, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface QueryParams<T> extends NzTableQueryParams {
  page: number;
  pageSize: number;
  sort: Array<{
    key: string;
    value: NzTableSortOrder;
  }>;
  filteredObject: string;
  orderBy?: Array<{
    key: string;
    value: NzTableSortOrder;
  }>;
  pagination: boolean;
}

export interface SearchParams<T> {
  page?: number;
  pageSize: number;
  pagination?: boolean;
  orderBy?: string;
  filteredObject?: string;
}
