declare interface IReturnResponse<V> {
  code: number;
  status: number;
  errors: string | null | object | number | boolean;
  payload: V;
}

declare interface IPagination<T> {
  datas: T[] | null;
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}
