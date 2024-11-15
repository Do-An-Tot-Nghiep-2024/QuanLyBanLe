import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import colors from "../../constants/color";
import { useState } from "react";
import getCustomersService from "../../services/customer.service";
import Customer from "../../types/customer/customerResponse";
export default function UnitPage() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const getCustomers = async (page: number, limit: number) => {
    try {
      const response = await getCustomersService(page, limit);
      console.log(response);
      if (response.message !== "success") {
        throw new Error("Error fetching units");
      }
      return response.data as any;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["customers", page, limit],
    queryFn: () => getCustomers(page, limit),
    refetchOnWindowFocus: false,
  });
  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };
  const columns = ["Họ và tên", "Email", "Số điện thoại"];
  return (
    <Box sx={{ width: "80%" }}>
      <Typography variant="h4" align="center" px={3} gutterBottom>
        Danh sách khách hàng
      </Typography>
      <TableContainer component={Paper} sx={{ minWidth: 500 }}>
        <Table aria-label="custom pagination table" size="small">
          <TableHead
            sx={{
              backgroundColor: colors.secondaryColor,
            }}
          >
            <TableRow>
              {columns.map((column: string) => (
                <TableCell
                  key={column}
                //   align={column === "Tên đơn vị tính" ? "left" : "center"}
                  sx={{
                    fontWeight: "bold",
                    color: "text.primary",
                    fontSize: 16,
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data !== undefined && data.responseList.length > 0 ? (
              data.responseList.map((row: Customer) => (
                <TableRow hover key={row.id}>
                  {/* <TableCell align={"center"}>{row.id}</TableCell> */}
                  <TableCell align={"left"}>{row.name}</TableCell>
                  <TableCell align={"left"}>{row.email}</TableCell>
                  <TableCell align={"left"}>{row.phone}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={3}
                count={data !== undefined ? data.totalElements : 0}
                rowsPerPage={limit}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}
