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
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  getAllOrdersService,
  updateOrderStatusService,
} from "../../../services/order.service";

import ResponsePagination from "../../../types/responsePagination";
import { OrderSchema } from "../../../types/orderSchema";
import colors from "../../../constants/color";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import {
  convertDateInput,
  generateDateDuringWeek,
} from "../../../utils/dateUtil";
import DateInput from "../../../components/DateInput";
import { useAppSelector } from "../../../redux/hook";
import { formatMoneyThousand } from "../../../utils/formatMoney";
import currentDate from "../../../constants/day";

const OrderOnlineList: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { fromDate: before, toDate: after } = generateDateDuringWeek();
  const current = new Date(after);
  current.setDate(current.getDate() - 1);
  const toDateFromat = convertDateInput(current);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(before);
  const [endDate, setEndDate] = useState<string>(toDateFromat);
  const [status, setStaus] = useState("PENDING");
  const [selectedPayments] = useState<string[]>(["CASH"]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [orderBy, setOrderBy] = useState<string>("orderId");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const columns: Array<{
    label: string;
    field?: keyof OrderSchema;
    width?: string;
    maxWidth?: string;
    minWidth?: string;
  }> = [
    { label: "Mã Đơn Hàng", field: "orderId", width: "10%" },
    { label: "Số Điện Thoại Khách Hàng", field: "customerPhone", width: "20%" },
    { label: "Trạng Thái", field: "orderStatus", width: "15%" },
    { label: "Ngày Tạo", field: "createdAt", width: "10%" },
    { label: "Phương Thức Thanh Toán", field: "paymentType", width: "15%" },
    { label: "Tổng Cộng", field: "total", width: "20%" },
    { label: "Hành động", width: "10%" },
  ];

  const tableCellStyles = {
    padding: "8px",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const compareDate = (date1: Date, date2: Date) => {
    console.table({"year 1": date1.getFullYear(), "month 1": date1.getMonth(), "date 1": date1.getDate()});
    console.table({"year 2": date2.getFullYear(), "month 2": date2.getMonth(), "date 2": date2.getDate()});
    // console.log("date1 is ", date1);
    // console.log("date2 is ", date2);
    
    return (
      date1.getFullYear() > date2.getFullYear() ||
      date1.getMonth() > date2.getMonth() ||
      date1.getDate() > date2.getDate()
    );
  };
  const validateDates = () => {
    // const currentDate = new Date();

    if (startDate && new Date(startDate) > currentDate) {
      alert("Không thể chọn ngày bắt đầu ở tương lai.");
      setStartDate("");
      return;
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      alert("Ngày kết thúc phải sau ngày bắt đầu.");
      setEndDate(toDateFromat);
      return;
    }

    if (endDate && compareDate(new Date(endDate), currentDate)) {
      alert("Không thể chọn ngày kết thúc ở tương lai.");
      setEndDate(toDateFromat);
      // return;
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
        status,
        selectedPayments[0],
        searchTerm
      );

      return response as ResponsePagination<OrderSchema>;
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Lỗi khi lấy dữ liệu đơn hàng. Vui lòng thử lại.");
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "orders",
      page,
      rowsPerPage,
      startDate,
      endDate,
      status,
      searchTerm,
      orderBy,
      order,
    ],
    queryFn: fetchOrders,
  });

  const handleRowClick = (order: OrderSchema) => {
    if (auth.role === "MANAGER") {
      navigate(`/orders/${order.orderId}`);
    } else {
      navigate(`/staff/orders/${order.orderId}`);
    }
    // navigate(`/orders/${order.orderId}`);
  };

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStaus(event.target.value);
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

  // Utility function to check if an order is older than 1 day
  const isOlderThanOneDay = (createdAt: string): boolean => {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);
    const diffInTime = currentDate.getTime() - createdDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays > 1;
  };
  const handleChangeStartDate = (value: Dayjs | null) => {
    setStartDate(value?.format("YYYY-MM-DD") ?? "");
  };
  const handleChangeEndDate = (value: Dayjs | null) => {
    setEndDate(value?.format("YYYY-MM-DD") ?? "");
  };

  const handleOrderAction = async (
    action: "cancel" | "status",
    orderId: number
  ) => {
    const response = await updateOrderStatusService(orderId, action);
    if (response?.data) {
      alert(`${response?.data}`);
    } else {
      alert(`${response?.data}`);
    }
    refetch();
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
  return (
    <Box width={"100%"}>
      <Typography
        variant="h5"
        component="h2"
        style={{ margin: "16px", textAlign: "center" }}
      >
        Danh sách đơn hàng đến lấy
      </Typography>

      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ marginBottom: 3 }}
      >
        <Stack flexDirection={"row"} gap={1}>
          <DateInput
            date={dayjs(startDate)}
            onChange={handleChangeStartDate}
            lable="Ngày bắt đầu"
          />
          <DateInput
            date={dayjs(endDate)}
            onChange={handleChangeEndDate}
            lable="Ngày kết thúc"
          />
        </Stack>

        <Stack flexDirection={"row"} gap={1}>
          <TextField
            type="text"
            label="Tìm kiếm theo số điện thoại"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 270 }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-status">Trạng thái</InputLabel>
            <Select
              labelId="demo-simple-select-status"
              id="demo-simple-select"
              name="status"
              label="Trạng thái"
              value={status}
              onChange={handleChangeStatus}
            >
              <MenuItem value={"PENDING"}>Đang đợi</MenuItem>
              <MenuItem value={"CANCELLED"}>Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </Stack>
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
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography variant="body2" color="error">
            Error loading data
          </Typography>
        ) : (
          <>
            <Table>
              <TableHead
                sx={{
                  backgroundColor: colors.secondaryColor,
                  width: "100%",
                }}
              >
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      align="center"
                      sx={{
                        ...tableCellStyles,
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
                    key={order.orderId}
                    hover
                    onClick={() => handleRowClick(order)}
                  >
                    {columns.map((column, index) => (
                      <TableCell
                        key={index}
                        align="center"
                        sx={{
                          ...tableCellStyles,
                          whiteSpace: "nowrap", // Prevent text from wrapping
                          overflow: "hidden", // Ensure overflow is hidden
                          textOverflow: "ellipsis", // Show ellipsis when content overflows
                        }}
                      >
                        {column.field
                          ? column.field === "total"
                            ? `${formatMoneyThousand(order.total)} VNĐ`
                            : column.field === "createdAt"
                              ? new Date(order.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )
                              : column.field === "customerPhone"
                                ? order.customerPhone
                                : column.field === "orderStatus"
                                  ? translateStatus(
                                      order[column.field] as string
                                    ) // Use the translateStatus function
                                  : column.field === "paymentType"
                                    ? translatePaymentType(
                                        order[column.field] as string
                                      )
                                    : order[column.field]
                          : null}

                        {/* Action Buttons - Only render in the last column (Action column) */}
                        {index === columns.length - 1 &&
                          order.orderStatus === "PENDING" && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 1,
                                flexDirection: "column",
                              }}
                            >
                              {isOlderThanOneDay(order.createdAt) ? (
                                <Button
                                  variant="contained"
                                  color="error"
                                  sx={{ marginRight: 1 }}
                                  onClick={(event) => {
                                    event.stopPropagation(); // Prevent row click
                                    handleOrderAction("cancel", order.orderId); // Directly call handleOrderAction
                                  }}
                                >
                                  Hủy Đơn
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="success"
                                  sx={{ marginRight: 1 }}
                                  onClick={(event) => {
                                    event.stopPropagation(); // Prevent row click
                                    handleOrderAction("status", order.orderId); // Directly call handleOrderAction
                                  }}
                                >
                                  Hoàn Thành
                                </Button>
                              )}
                            </Box>
                          )}
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

export default OrderOnlineList;
