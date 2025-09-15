export interface PaginatedResponse<T> {
  data: Array<T>
  meta: {
    total: number
    page: number
    pageSize: number
    pageCount: number
  }
}
