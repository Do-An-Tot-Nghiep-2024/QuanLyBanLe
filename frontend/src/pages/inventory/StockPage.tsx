import { useQuery } from "@tanstack/react-query";
import { getStocksByProductService } from "../../services/inventory.service";
import { useState } from "react";
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
} from "@mui/material";
import StockResponse from "../../types/stockResponse";

export default function StockPage() {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const getStocksByProduct = async (pageNumber: number, pageSize: number) => {
    try {
      const response = await getStocksByProductService(pageNumber, pageSize);
      console.log(response);
      if (response.message !== "success") {
        throw new Error("Error fetching employees");
      }
      return response.data;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to be handled by useQuery
    }
  };
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["inventory/stock", pageNumber, pageSize],
    queryFn: () => getStocksByProduct(pageNumber, pageSize), // No need for async/await here
  });
  if (isFetching || isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageNumber(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };
  const columns = ["Tên sản phẩm", "Số lượng đã bán", "Số lượng còn lại"];
  console.log(data);

  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            {columns.map((column: string) => (
              <TableCell
                key={column}
                align={"center"}
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                }}
              >
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data !== undefined &&
          data.responseList !== undefined &&
          data.responseList.length > 0 ? (
            data.responseList.map((row: StockResponse) => (
              <TableRow hover key={row.id}>
                <TableCell align={"center"}>{row.name}</TableCell>
                <TableCell align={"center"}>{row.soldQuantity}</TableCell>
                <TableCell align={"center"}>{row.remainingQuantity}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={3}
              count={data !== undefined ? data.totalElements : 0}
              rowsPerPage={pageSize}
              page={pageNumber}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
