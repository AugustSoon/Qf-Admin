export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  list: T[];
  total: number;
}

export interface BasicParams {
  [propName: string]: any;
}