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
  TableFooter,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  // getAllOrdersService,
  getOrdersByEmployeeService,
} from "../../../services/order.service"; // Import service function
// import ResponsePagination from "../../../types/responsePagination";
import { OrderSchema } from "../../../types/orderSchema";
import colors from "../../../constants/color";
import { useNavigate } from "react-router-dom";
import OrderRequestProp from "../../../types/order/orderRequestProp";
import PaginationResponse from "../../../types/common/paginationResponse";
import {
  formatDate,
  // formatDateTime,
  generateDate,
} from "../../../utils/dateUtil";
import { formatMoney } from "../../../utils/formatMoney";
import useDebounce from "../../../hooks/useDebounce";

export default function OrderEmployeePage() {
  const navigate = useNavigate();
  const genDate = generateDate();
  //   const [searchTerm, setSearchTerm] = useState<string>("");
  //   const [startDate, setStartDate] = useState<string>("");
  //   const [endDate, setEndDate] = useState<string>("");
  //   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  //   const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  //   const [page, setPage] = useState<number>(0);
  //   const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  //   const [orderBy, setOrderBy] = useState<string>("total");
  //   const [order, setOrder] = useState<"asc" | "desc">("desc");
  //   const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);

  const [request, setRequest] = useState<OrderRequestProp>({
    pageNumber: 0,
    pageSize: 10,
    status: "",
    customerPhone: "",
    fromDate: genDate.fromDate,
    toDate: genDate.toDate,
    paymentType: "",
  });
  const debounce = useDebounce(request.customerPhone, 1000);

  const getOrdersByEmployee = async () => {
    try {
      const response = await getOrdersByEmployeeService(request);
      if (response.message !== "success") {
        alert("Error: " + response.message);
      }
      return response.data as PaginationResponse<OrderSchema>;
    } catch (error) {
      alert("Error: " + error);
      return;
    }
  };
  const { data, isLoading, error, isFetching, isError } = useQuery({
    queryKey: ["orders", request,debounce],
    queryFn: () => getOrdersByEmployee(),
    refetchOnWindowFocus: false,
  });

  if (isLoading || isFetching) {
    return <div>.....Loading....</div>;
  }
  if (isError) {
    return <div>Error is : {error.message}</div>;
  }

  const map = new Map();
  map.set("", "Tất cả");
  map.set("COMPLETED", "Hoàn Thành");
  map.set("PENDING", "Chờ đến lấy");
  map.set("CANCELLED", "Đã Hủy");

  // console.log(data);

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
    { label: "Thanh Toán", field: "paymentType", width: "15%" },
    { label: "Tổng Cộng", field: "total", width: "20%" },
    { label: "SĐT Khách Hàng", field: "customerPhone", width: "10%" },
  ];

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setRequest((prevRequest) => ({
      ...prevRequest,
      [name || "status"]: value, // Default to "status" if `name` is undefined
    }));
  };

  //   const tableCellStyles = {
  //     padding: "8px",
  //     textOverflow: "ellipsis",
  //     overflow: "hidden",
  //   };

  //   const validateDates = () => {
  //     const currentDate = new Date();

  //     if (startDate && new Date(startDate) > currentDate) {
  //       alert("Không thể chọn ngày bắt đầu ở tương lai.");
  //       return false;
  //     }

  //     if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
  //       alert("Ngày kết thúc phải sau ngày bắt đầu.");
  //       return false;
  //     }

  //     if (endDate && new Date(endDate) > currentDate) {
  //       alert("Không thể chọn ngày kết thúc ở tương lai.");
  //       return false;
  //     }

  //     return true;
  //   };

  //   const fetchOrders = async () => {
  //     if (endDate && startDate) {
  //       if (!validateDates()) {
  //         return;
  //       }
  //     }
  //     const response = await getAllOrdersService(
  //       page,
  //       rowsPerPage,
  //       orderBy,
  //       order,
  //       startDate,
  //       endDate,
  //       selectedStatuses.join(","),
  //       selectedPayments.join(","),
  //       searchTerm
  //     );

  //     return response as ResponsePagination<OrderSchema>;
  //   };

  //   const { data, isLoading, error } = useQuery({
  //     queryKey: [
  //       "orders",
  //       page,
  //       rowsPerPage,
  //       startDate,
  //       endDate,
  //       selectedStatuses,
  //       selectedPayments,
  //       searchTerm,
  //       orderBy,
  //       order,
  //     ],
  //     queryFn: fetchOrders,
  //   });

  //   const handleRowClick = (order: OrderSchema) => {
  //     navigate(`/orders/${order.orderId}`);
  //   };

  //   const handleChangePage = (_event: unknown, newPage: number) => {
  //     setPage(newPage);
  //   };

  //   const handleChangeRowsPerPage = (
  //     event: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     setRowsPerPage(parseInt(event.target.value, 10));
  //     setPage(0);
  //   };

  //   const handleColumnClick = (columnField: keyof OrderSchema) => {
  //     if (columnField === orderBy) {
  //       setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  //     } else {
  //       setOrderBy(columnField);
  //       setOrder("asc");
  //     }
  //   };

  //   // Handle status checkbox change
  //   const handleStatusChange = (status: string) => {
  //     setSelectedStatuses((prev) =>
  //       prev.includes(status)
  //         ? prev.filter((s) => s !== status)
  //         : [...prev, status]
  //     );
  //   };

  //   // Handle payment type checkbox change
  //   const handlePaymentChange = (payment: string) => {
  //     setSelectedPayments((prev) =>
  //       prev.includes(payment)
  //         ? prev.filter((p) => p !== payment)
  //         : [...prev, payment]
  //     );
  //   };

  //   // Open filter modal
  //   const handleFilterOpen = () => setFilterModalOpen(true);

  //   // Close filter modal
  //   const handleFilterClose = () => setFilterModalOpen(false);

  //   {columns.map((column, index) => (
  //     <TableCell
  //       key={index}
  //       align="center"
  //       sx={{
  //         ...tableCellStyles, // Apply common styles for all columns
  //         width: column.width,
  //         maxWidth: column.maxWidth,
  //         minWidth: column.minWidth,
  //         cursor: "pointer",
  //         fontSize: "14px",
  //         fontWeight: "bold",
  //         whiteSpace: "normal",
  //       }}
  //     //   onClick={() =>
  //     //     column.field && handleColumnClick(column.field)
  //     //   }
  //     >
  //       {/* {column.label}
  //       {column.field === orderBy && (
  //         <span style={{ marginLeft: "5px" }}>
  //           {order === "asc" ? "↑" : "↓"}
  //         </span>
  //       )} */}
  //     </TableCell>
  //   ))}
  // console.log(request.status);
  console.log("from date is ", request.fromDate);
  console.log("to date is ", request.toDate);

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
          <TextField
            type="date"
            label="Ngày bắt đầu"
            variant="outlined"
            value={request.fromDate}
            onChange={(value) =>
              setRequest({
                ...request,
                fromDate: value.target.value,
              })
            }
            // value={startDate}
            // onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          />
          {/* End Date */}
          <TextField
            type="date"
            label="Ngày kết thúc"
            variant="outlined"
            value={request.toDate}
            onChange={(value) =>
              setRequest({
                ...request,
                toDate: value.target.value,
              })
            }
            // value={endDate}
            // onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
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
            value={request.customerPhone}
            onChange={(value) =>
              setRequest({
                ...request,
                customerPhone: value.target.value,
              })
            }
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 350 }}
          />

          {/* Filter Button (Aligned Right) */}
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
                value={request.status}
                onChange={handleChange}
              >
                <MenuItem value="" selected>
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value={"PENING"}>Đang đợi</MenuItem>
                <MenuItem value={"COMPLETED"}>Hoàn thành</MenuItem>
                <MenuItem value={"CANCELLED"}>Đã hủy</MenuItem>
              </Select>
            </FormControl>

            {/* Payment Method Display */}
            {/* <Box
              sx={{
                borderRadius: 10,
                padding: 1.5,
                backgroundColor: colors.primaryColor,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="white">
                Phương Thức Thanh Toán:
              
              </Typography>
            </Box> */}
            <FormControl sx={{ minWidth: 150 }} fullWidth>
              <InputLabel id="demo-simple-select-payment">
                Thanh toán
              </InputLabel>
              <Select
                labelId="demo-simple-select-payment"
                id="demo-simple-select"
                label="Thanh toán"
                name="paymentType"
                value={request.paymentType || ""}
                onChange={handleChange}
              >
                <MenuItem value="" selected>
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value={"CASH"}>Tiền mặt</MenuItem>
                <MenuItem value={"E_WALLET"}>Chuyển khoản</MenuItem>
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
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography variant="body2" color="error">
            Error loading data
          </Typography>
        ) : (
          <>
            <Table size="small">
              <TableHead sx={{ backgroundColor: colors.secondaryColor }}>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell key={index} align="left">
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.responseList?.map((order) => (
                  <TableRow
                    onClick={() => navigate(`/staff/orders/${order.orderId}`)}
                    key={order.orderId}
                    hover

                    // onClick={() => handleRowClick(order)}
                  >
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell padding="none">{order.employee}</TableCell>
                    <TableCell>{map.get(order.orderStatus)}</TableCell>
                    <TableCell>
                      {formatDate(order.createdAt as unknown as Date)}
                    </TableCell>
                    <TableCell>
                      {order.paymentType === "CASH"
                        ? "Tiền mặt"
                        : "Chuyển khoản"}
                    </TableCell>
                    <TableCell>{formatMoney(order.total)}</TableCell>
                    <TableCell>{order.customerPhone}</TableCell>
                    {/* {columns.map((column, index) => (
                      <TableCell
                        key={index}
                        align="center"
                        // sx={tableCellStyles}
                      >
                        {column.field
                          ? column.field === "total"
                            ? `${order.total.toLocaleString()} VND`
                            : column.field === "createdAt"
                              ? new Date(order.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )
                              : column.field === "customerPhone"
                                ? order.customerPhone
                                : order[column.field]
                          : null}
                      </TableCell>
                    ))} */}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    //   colSpan={5}
                    count={data?.totalElements ? data.totalElements : 0}
                    rowsPerPage={request.pageSize}
                    page={request.pageNumber}
                    onPageChange={() => {}}
                    onRowsPerPageChange={() => {}}
                  />
                </TableRow>
              </TableFooter>
            </Table>

            {/* Pagination */}
            {/* <TablePagination

              rowsPerPageOptions={[5, 10, 25]}
            //   component="div"
              count={data ? data.totalElements : 0}
              rowsPerPage={request.pageSize}
              page={request.pageNumber}
            //   onPageChange={handleChangePage}
            //   onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
          </>
        )}
      </TableContainer>
    </Box>
  );
}
