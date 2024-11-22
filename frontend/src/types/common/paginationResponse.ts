interface PaginationResponse<T> {
  responseList: T[];
  pageNumber:number;
  totalPages: number;
  totalElements: number;
  lastPage: boolean;
}
export default PaginationResponse;