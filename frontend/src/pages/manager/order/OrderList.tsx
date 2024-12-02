import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  Box,
  TextField,
  TablePagination,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAllOrdersService } from "../../../services/order.service"; // Import service function
import ResponsePagination from "../../../types/responsePagination";
import { OrderSchema } from "../../../types/orderSchema";
import colors from "../../../constants/color";
import { useNavigate } from "react-router-dom";
import {
  convertDate,
  convertDateInput,
  generateDateDuringWeek,
} from "../../../utils/dateUtil";
import dayjs, { Dayjs } from "dayjs";
import DateInput from "../../../components/DateInput";
const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const { fromDate: before, toDate: after } = generateDateDuringWeek();
  const current = new Date(after);
  current.setDate(current.getDate() - 1);

  const toDateFromat = convertDateInput(current);
  console.log(toDateFromat);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(before);
  const [endDate, setEndDate] = useState<string>(toDateFromat);
  const [selectedStatuses, setSelectedStatuses] = useState<string>();
  const [selectedPayments, setSelectedPayments] = useState<string>();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [orderBy, setOrderBy] = useState<string>("orderId");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const handleChangeStartDate = (value: Dayjs | null) => {
    setStartDate(value?.format("YYYY-MM-DD") ?? "");
  };

  const handleChangeEndDate = (value: Dayjs | null) => {
    setEndDate(value?.format("YYYY-MM-DD") ?? "");
  };

  const columns: Array<{
    label: string;
    field?: keyof OrderSchema;
    width?: string;
    maxWidth?: string;
    minWidth?: string;
  }> = [
    { label: "Mã Đơn Hàng", field: "orderId", width: "10%" },
    { label: "Nhân Viên", field: "employee", width: "25%" },
    { label: "Trạng Thái", field: "orderStatus", width: "15%" },
    { label: "Ngày Tạo", field: "createdAt", width: "15%" },
    { label: "Phương Thức Thanh Toán", field: "paymentType", width: "15%" },
    { label: "Tổng Cộng", field: "total", width: "20%" },
    { label: "SĐT Khách Hàng", field: "customerPhone", width: "10%" },
  ];

  const tableCellStyles = {
    padding: "8px",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const validateDates = () => {
    const currentDate = new Date();

    if (startDate && new Date(startDate) > currentDate) {
      alert("Không thể chọn ngày bắt đầu ở tương lai.");
      setStartDate(before);
      return false;
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      alert("Ngày kết thúc phải sau ngày bắt đầu.");
      setEndDate(toDateFromat);
      return false;
    }

    if (endDate && new Date(endDate) > currentDate) {
      alert("Không thể chọn ngày kết thúc ở tương lai.");
      setEndDate(toDateFromat);
      return false;
    }
    return true;
  };

  const fetchOrders = async () => {
    if ((startDate && !endDate) || (!startDate && endDate)) {
      alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc");
      return;
    }

    if (startDate && endDate && !validateDates()) {
      return;
    }

    console.log("Fetching orders with dates:", startDate, endDate);

    try {
      const response = await getAllOrdersService(
        page,
        rowsPerPage,
        orderBy,
        order,
        startDate,
        endDate,
        selectedStatuses,
        selectedPayments,
        searchTerm
      );

      return response as ResponsePagination<OrderSchema>;
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Lỗi khi lấy dữ liệu đơn hàng. Vui lòng thử lại.");
    }
  };

  const { data, isLoading, error, isFetching, isError } = useQuery({
    queryKey: [
      "orders",
      page,
      rowsPerPage,
      startDate,
      endDate,
      selectedStatuses,
      selectedPayments,
      searchTerm,
      orderBy,
      order,
    ],
    queryFn: fetchOrders,
    refetchOnWindowFocus: false,
  });

  const handleRowClick = (order: OrderSchema) => {
    navigate(`/orders/${order.orderId}`);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleColumnClick = (columnField: keyof OrderSchema) => {
    if (columnField === orderBy) {
      setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(columnField);
      setOrder("asc");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: string }> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    if (name === "status") {
      setSelectedStatuses(value);
    }
    if (name === "paymentType") {
      setSelectedPayments(value);
    }
  };
  const translateStatus = (status: string) => {
    const statusMapping: { [key: string]: string } = {
      PENDING: "Đang chờ nhận hàng",
      CANCELLED: "Đã hủy",
      COMPLETED: "Hoàn thành",
      // Add more statuses if necessary
    };

    return statusMapping[status] || "Không xác định"; // Default if the status doesn't match
  };

  const translatePaymentType = (paymentType: string) => {
    const paymentMapping: { [key: string]: string } = {
      CASH: "Tiền mặt",
      E_WALLET: "Chuyển khoản",
      // Add more payment methods if necessary
    };

    return paymentMapping[paymentType] || "Không xác định"; // Default if the payment type doesn't match
  };
  console.log(data);

  return (
    <Box width={"90%"}>
      <Typography
        variant="h5"
        component="h2"
        style={{ margin: "16px", textAlign: "center" }}
      >
        Danh sách đơn hàng
      </Typography>

      <Stack
        direction="column"
        justifyContent="space-between"
        spacing={3}
        sx={{ marginBottom: "16px" }}
      >
        <Box display="flex" justifyContent="flex-end" gap={2}>
          {/* Start Date */}
          {/* <TextField
            type="date"
            label="Ngày bắt đầu"
            variant="outlined"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          /> */}
          <DateInput
            date={dayjs(startDate)}
            onChange={handleChangeStartDate}
            lable="Ngày bắt đầu"
          />
          {/* End Date */}
          {/* <TextField
            type="date"
            label="Ngày kết thúc"
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          /> */}
          <DateInput
            date={dayjs(endDate)}
            onChange={handleChangeEndDate}
            lable="Ngày kết thúc"
          />
        </Box>

        <Box
          sx={{
            gap: 2,
            display: "flex",
            flexDirection: "row",
            mb: 2,
            justifyContent: "space-between", // Align search bar left and filter button right
            alignItems: "center",
          }}
        >
          {/* Search Field (Aligned Left) */}
          <TextField
            type="text"
            label="Tìm kiếm theo số điện thoại"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 350 }}
          />

          <Box
            sx={{
              gap: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end", // Align status and payment methods to the right
              alignItems: "center",
            }}
          >
            {/* Status Display */}
            <FormControl sx={{ minWidth: 200 }} fullWidth>
              <InputLabel id="demo-simple-select-status">Trạng thái</InputLabel>
              <Select
                labelId="demo-simple-select-status"
                id="demo-simple-select"
                name="status"
                label="Trạng thái"
                value={selectedStatuses}
                onChange={handleChange}
              >
                <MenuItem value="" selected>
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value={"PENDING"}>Đang đợi</MenuItem>
                <MenuItem value={"COMPLETED"}>Hoàn thành</MenuItem>
                <MenuItem value={"CANCELLED"}>Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Stack>

      {/* Orders Table */}
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          margin: "auto",
          backgroundColor: "white",
          maxHeight: "700px",
          overflowY: "auto",
        }}
      >
        {isLoading || isFetching ? (
          <CircularProgress />
        ) : isError ? (
          <Typography variant="body2" color="error">
            {error.message}
          </Typography>
        ) : (
          <>
            <Table size="small">
              <TableHead sx={{ backgroundColor: colors.secondaryColor }}>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      align="center"
                      sx={{
                        ...tableCellStyles, // Apply common styles for all columns
                        width: column.width,
                        maxWidth: column.maxWidth,
                        minWidth: column.minWidth,
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold",
                        whiteSpace: "normal",
                      }}
                      onClick={() =>
                        column.field && handleColumnClick(column.field)
                      }
                    >
                      {column.label}
                      {column.field === orderBy && (
                        <span style={{ marginLeft: "5px" }}>
                          {order === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.responseList?.map((order) => (
                  <TableRow
                    onDoubleClick={() => handleRowClick(order)}
                    key={order.orderId}
                    hover
                    // onClick={() => handleRowClick(order)}
                  >
                    {columns.map((column, index) => (
                      <TableCell
                        key={index}
                        align="center"
                        sx={tableCellStyles}
                      >
                        {column.field
                          ? column.field === "total"
                            ? `${order.total.toLocaleString()} VND`
                            : column.field === "createdAt"
                              ? convertDate(new Date(order.createdAt))
                              : column.field === "customerPhone"
                                ? order.customerPhone
                                : column.field === "orderStatus"
                                  ? translateStatus(
                                      order[column.field] as string
                                    ) // Use the translateStatus function
                                  : column.field === "paymentType"
                                    ? translatePaymentType(
                                        order[column.field] as string
                                      ) // Use the translatePaymentType function
                                    : order[column.field]
                          : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data ? data.totalElements : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TableContainer>
    </Box>
  );
};

export default OrderList;
