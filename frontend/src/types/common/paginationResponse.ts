interface PaginationResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  responseList: T[];
}
export default PaginationResponse;