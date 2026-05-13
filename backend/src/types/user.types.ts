export interface UserListQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  isDelete?: number;
}

export interface UpdateUserRequest {
  nickname?: string;
  email?: string;
  mobile?: string;
  sex?: number;
  birthday?: number;
}
