interface ResponsePagination<T> {
   isLastPage: boolean;
    pageNumber: number;
    responseList: T[];
    totalElements: number;
    totalPages: number;
}
export default ResponsePagination;