import { useState } from "react";
import { getImportInvoicesService } from "../../services/inventory.service";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router-dom";
import { formatMoneyThousand } from "../../utils/formatMoney";
import ImportInvoice from "../../types/inventory/importInvoice";
import colors from "../../constants/color";
export default function InventoryPage() {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const getImportInvoices = async (pageNumber: number, pageSize: number) => {
    try {
      const response = await getImportInvoicesService(pageNumber, pageSize);
      console.log(response);
      if (response.message !== "success") {
        throw new Error("Error fetching employees");
      }
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["inventory/stock", pageNumber, pageSize],
    queryFn: () => getImportInvoices(pageNumber, pageSize),
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

  const columns = [
    "Mã hóa đơn",
    "Tên nhà cung cấp",
    "Ngày tạo",
    "Tổng tiền",
    "Chi tiết",
  ];

  return (
    <Box
      sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/inventory/create-inventory")}
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": { backgroundColor: "#155a8a" },
          }}
        >
          Tạo phiếu nhập hàng
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ width: "100%", backgroundColor: "white" }}
      >
        <Table aria-label="custom pagination table" size="small">
          <TableHead
            sx={{ backgroundColor: colors.secondaryColor, fontSize: 18 }}
          >
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
            {data?.responseList?.length > 0 ? (
              data.responseList.map((row: ImportInvoice) => (
                <TableRow hover key={row.numberInvoice}>
                  <TableCell align={"center"}>{row.numberInvoice}</TableCell>
                  <TableCell align={"center"}>{row.name}</TableCell>
                  <TableCell align={"center"}>{row.createdAt}</TableCell>
                  <TableCell align={"center"}>
                    {formatMoneyThousand(row.total)}
                  </TableCell>
                  <TableCell align={"center"}>
                    <IconButton
                      onClick={() =>
                        navigate(`/inventory/${row.numberInvoice}`)
                      }
                    >
                      <RemoveRedEyeIcon color="success" />
                    </IconButton>
                  </TableCell>
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
                count={data?.totalElements || 0}
                rowsPerPage={pageSize}
                page={pageNumber}
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
