import { User } from '@prisma/client';
import { Request } from 'express';

export interface Order {
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

export interface PaginateOptions<T, OrderType> {
  searchData?: string
  data: T;
  page: number;
  pageSize: number;
  order: OrderType[];
  pagination: boolean;
}

export interface QueryT {
  q?: string
  filteredObject?: string;
  page?: number;
  pageSize: number;
  pagination?: string;
  orderBy?: string;
}

export interface ResponseT<T> {
  message: string;
  data: T;
  totalItems?: number;
}

export interface CustomRequest extends Request {
  user: User;
}
