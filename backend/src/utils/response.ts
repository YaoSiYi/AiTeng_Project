export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export const success = <T>(data: T, message = '成功'): ApiResponse<T> => ({
  code: 200,
  message,
  data,
});

export const error = (message = '失败', code = 500): ApiResponse => ({
  code,
  message,
  data: null,
});

export const paginate = <T>(
  list: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResponse<T> => ({
  code: 200,
  message: '成功',
  data: {
    list,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  },
});
