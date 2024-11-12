interface ResponsePagination<T> {
    data: any;
   isLastPage: boolean;
    pageNumber: number;
    responseList: T[];
    totalElements: number;
    totalPages: number;
}
export default ResponsePagination;