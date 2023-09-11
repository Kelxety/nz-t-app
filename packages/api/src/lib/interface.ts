import { User } from '@prisma/client';
import { Request } from 'express';

export interface Order {
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

export interface PaginateOptions<T, OrderType> {
  data: T;
  page: number;
  pageSize: number;
  order: OrderType[];
  pagination: boolean;
}

export interface QueryT {
  filteredObject?: string;
  page?: number;
  pageSize: number;
  pagination?: string;
  orderBy?: string;
}

export interface ResponseT<T> {
  message: string;
  data: T;
  total: number;
}

export interface CustomRequest extends Request {
  user: User;
}
