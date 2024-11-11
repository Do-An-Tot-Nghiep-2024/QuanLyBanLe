import { useState } from "react";
import { getImportInvoicesService } from "../../services/inventory.service";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  IconButton,
  Paper,
  Stack,
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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router-dom";
import { formatMoneyThousand } from "../../utils/formatMoney";
import ImportInvoice from "../../types/inventory/importInvoice";
import colors from "../../constants/color";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
export default function InventoryPage() {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const navigate = useNavigate();
  const getImportInvoices = async (pageNumber: number, pageSize: number) => {
    try {
      const response = await getImportInvoicesService(pageNumber, pageSize);
      console.log(response);
      if (response.message !== "success") {
        throw new Error("Error fetching inventory");
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
    refetchOnWindowFocus: false,
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
    <Box sx={{ width: "100%" }}>
      <Typography
        sx={{
          paddingBottom: 5,
        }}
        variant="h5"
      >
        Danh sách phiếu nhập hàng
      </Typography>
      <Stack
        direction="column"
        spacing={2}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{ mb: 2, fontSize: 14 }}
      >
        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          justifyContent={"space-around"}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày bắt đầu"
              format="DD/MM/YYYY"
              sx={{ width: "100%" }}
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày kết thúc"
              format="DD/MM/YYYY"
              sx={{ width: "100%" }}
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </LocalizationProvider>
        </Stack>
      </Stack>

      <TableContainer component={Paper} sx={{ backgroundColor: "white" }}>
        <Table aria-label="custom pagination table">
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
            {data !== undefined &&
            data.responseList !== undefined &&
            data.responseList.length > 0 ? (
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
    </Box>
  );
}
