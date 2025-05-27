export interface ApiResponse<T> {
  isSuccessfull: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export class PaginatedListData {
  items!: any[];
  pageNumber!: number;
  pageSize!: number;
  totalCount!: number;
  sortColumn!: string;
  sortDirection!: string;
}
