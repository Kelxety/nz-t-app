export interface ResType<T> {
  statusCode: number;
  message: string;
  data: T;
  totalItems: number;
  hasNext?: boolean;
  totalPage?: number;
  page?: number
}
