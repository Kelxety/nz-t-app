export interface ResType<T> {
  statusCode: number;
  message: string;
  data: T;
  total: number;
}
