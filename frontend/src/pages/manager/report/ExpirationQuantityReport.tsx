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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { getExpirationQuantityReportService } from "../../../services/statistic.service";
import { useQuery } from "@tanstack/react-query";
import SnackbarMessage from "../../../components/SnackbarMessage";
import colors from "../../../constants/color";
import DiscountIcon from "@mui/icons-material/Discount";
import { updateDiscountProductService } from "../../../services/inventory.service";
import UpdateDiscountProduct from "../../../types/inventory/updateDiscountProduct";
type Response = {
  product: number;
  name: string;
  exp: string;
  shipment: number;
  avb: number;
  discount: number;
};

export default function ExpirationQuantityReport() {
  const date = new Date();
  const [open, setOpen] = useState(false);
  const currentYear = date.getFullYear();
  const [month, setMonth] = useState(date.getMonth() + 1 + "");
  const [year, setYear] = useState(date.getFullYear() + "");
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const[fail, setFail] = useState(true);
  const [updateDiscount, setUpdateDiscount] =
    useState<UpdateDiscountProduct>({
      productId: 0,
      shipmentId: 0,
      discount: 0,
    });

  const updateErrorMessage = (message: string) => {
    setMessage(message);
    setSnackbarOpen(true);
    setFail(true);
  };
  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value);
  };
  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeDiscount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = event.target.value;
    const number = Number(rawInput);
    if (isNaN(number)) {
      setUpdateDiscount({...updateDiscount, discount: 0});
      return;
    }
    if (number < 0 || number > 100) {
      setUpdateDiscount({...updateDiscount, discount: 0});
      return;
    }
    setUpdateDiscount({...updateDiscount, discount: number});
  };
  const columns: string[] = [
    "Tên sản phẩm",
    "Ngày hết hạn",
    "Lô hàng",
    "Số lượng còn lại",
    "Tỉ lệ giảm giá",
    "Tạo giảm giá",
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
        return;
      }
      
      return response.data as Response[];
    } catch (error: any) {
      updateErrorMessage(error.message);
      return;
    }
  };

  const { data, isLoading, isFetching, isError, error,refetch } = useQuery({
    queryKey: ["dashboardExpirationQuantity", month, year],
    queryFn: () => getExpirationQuantity(month, year),
    refetchOnWindowFocus: false,
  });

  const handleUpateDiscount = async (request: UpdateDiscountProduct) => {
    try {
      const response = await updateDiscountProductService(request);
      if (response.message !== "success") {
        updateErrorMessage(response.message);
        return;
      }
      setSnackbarOpen(true);
      setFail(false);
      setMessage("Tạo giảm giá thành công")
      refetch();
      setOpen(false);
      return response.data;
    } catch (error: any) {
      updateErrorMessage(error.message);
      return;
    }
  };
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
            <TableRow sx={{ backgroundColor: colors.secondaryColor }}>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column === "Tên sản phẩm" ? "left" : "center"}
                  sx={{ fontSize: 16, fontWeight: "bold" }}
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
                  <TableCell align="center" sx={{ fontSize: 16 }}>
                    {row.discount * 100 + "%"}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: 16 }}>
                    <Tooltip title="Tạo giảm giá" onClick={() => {
                      setOpen(true);
                      setUpdateDiscount({
                        productId: row.product,
                        shipmentId: row.shipment,
                        discount: 0,
                      });
                    }}>
                      <IconButton color="error" size="small">
                        <DiscountIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            fontWeight={"bold"}
            align="center"
          >
            TẠO GIẢM GIÁ CHO SẢN PHẨM
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <TextField
              fullWidth
              value={updateDiscount.discount ?? 0}
              onChange={handleChangeDiscount}
              id="standard-number"
              label="Tỉ lệ giảm giá % (Nhập từ 0 - 100)"
              variant="standard"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
                input: {
                  inputMode: "numeric",
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Đóng</Button>
            <Button
              onClick={() =>
                handleUpateDiscount(updateDiscount)
              }
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
      <SnackbarMessage
        isError={fail}
        alertMessage={message}
        setSnackbarOpen={setSnackbarOpen}
        snackbarOpen={snackbarOpen}
      />
    </Box>
  );
}
