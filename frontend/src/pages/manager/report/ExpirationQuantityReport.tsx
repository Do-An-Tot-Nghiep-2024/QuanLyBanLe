import {
  Box,
  Stack,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { getExpirationQuantityReportService } from "../../../services/statistic.service";
import { useQuery } from "@tanstack/react-query";
import SnackbarMessage from "../../../components/SnackbarMessage";

type Response = {
  name: string;
  exp: string;
  shipment: number;
  avb: number;
};

export default function ExpirationQuantityReport() {
  const date = new Date();
  const currentYear = date.getFullYear();
  const [month, setMonth] = useState(date.getMonth() + 1 + "");
  const [year, setYear] = useState(date.getFullYear() + "");
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const updateErrorMessage = (message: string) => {
    setMessage(message);
    setSnackbarOpen(true);
    return;
  };
  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value);
  };
  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value);
  };
  const columns: string[] = [
    "Tên sản phẩm",
    "Ngày hết hạn",
    "Lô hàng",
    "Số lượng còn lại",
  ];
  const years: ReadonlyArray<number> = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ];
  const getExpirationQuantity = async (month: string, year: string) => {
    try {
      const response = await getExpirationQuantityReportService(
        Number(month),
        Number(year)
      );
      if (response.message !== "success") {
        updateErrorMessage(response.message);
      }
      return response.data as Response[];
    } catch (error: any) {
      updateErrorMessage(error.message);
    }
  };

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["dashboardExpirationQuantity", month, year],
    queryFn: () => getExpirationQuantity(month, year),
    refetchOnWindowFocus: false,
  });
  return (
    <Box sx={{ width: "100%", height: "100%", marginTop: 5, px: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontSize: 24, fontWeight: "bold", textAlign: "center" }}
      >
        {"Thống kê sản phẩm hết hạn trong tháng".toUpperCase()}
      </Typography>

      <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
        <Stack flexDirection={"row"} gap={2}>
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <Select value={month} onChange={handleChangeMonth}>
              {Array.from(Array(12).keys()).map((i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <Select value={year} onChange={handleChangeYear}>
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      <TableContainer>
        {isLoading || (isFetching && <CircularProgress />)}
        {isError && <div>Error: {error.message}</div>}
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "gray" }}>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column === "Tên sản phẩm" ? "left" : "center"}
                
                  sx={{ fontSize: 16,fontWeight:"bold" }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data !== undefined &&
              data.map((row, index: number) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={{ fontSize: 16 }}>
                    {row.name}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 16 }}>
                    {row.exp}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 16 }}>
                    {row.shipment}
                  </TableCell>

                  <TableCell align="center" sx={{ fontSize: 16 }}>
                    {row.avb}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SnackbarMessage
        isError={true}
        alertMessage={message}
        setSnackbarOpen={setSnackbarOpen}
        snackbarOpen={snackbarOpen}
      />
    </Box>
  );
}
