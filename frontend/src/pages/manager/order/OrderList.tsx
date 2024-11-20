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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAllOrdersService } from "../../../services/order.service"; // Import service function
import ResponsePagination from "../../../types/responsePagination";
import { OrderSchema } from "../../../types/orderSchema";
import colors from "../../../constants/color";
import { useNavigate } from "react-router-dom";

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [orderBy, setOrderBy] = useState<string>("total");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);

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
    { label: "Số Điện Thoại Khách Hàng", field: "customerPhone", width: "10%" },
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
      return false;
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      alert("Ngày kết thúc phải sau ngày bắt đầu.");
      return false;
    }

    if (endDate && new Date(endDate) > currentDate) {
      alert("Không thể chọn ngày kết thúc ở tương lai.");
      return false;
    }

    return true;
  };

  const fetchOrders = async () => {
    if (endDate && startDate) {
      if (!validateDates()) {
        return;
      }
    }
    const response = await getAllOrdersService(
      page,
      rowsPerPage,
      orderBy,
      order,
      startDate,
      endDate,
      selectedStatuses.join(","),
      selectedPayments.join(","),
      searchTerm
    );

    return response as ResponsePagination<OrderSchema>;
  };

  const { data, isLoading, error } = useQuery({
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

  // Handle status checkbox change
  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Handle payment type checkbox change
  const handlePaymentChange = (payment: string) => {
    setSelectedPayments((prev) =>
      prev.includes(payment)
        ? prev.filter((p) => p !== payment)
        : [...prev, payment]
    );
  };

  // Open filter modal
  const handleFilterOpen = () => setFilterModalOpen(true);

  // Close filter modal
  const handleFilterClose = () => setFilterModalOpen(false);

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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          />
          {/* End Date */}
          <TextField
            type="date"
            label="Ngày kết thúc"
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <Box
              sx={{
                borderRadius: 10,
                padding: 1.5,
                marginRight: 2,
                backgroundColor: colors.primaryColor,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography color="white" variant="body2">
                Trạng Thái:{" "}
                {selectedStatuses.length > 0
                  ? selectedStatuses.join(", ")
                  : "Tất cả"}
              </Typography>
            </Box>

            {/* Payment Method Display */}
            <Box
              sx={{
                borderRadius: 10,
                padding: 1.5,
                backgroundColor: colors.primaryColor,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="white">
                Phương Thức Thanh Toán:{" "}
                {selectedPayments.length > 0
                  ? selectedPayments.join(", ")
                  : "Tất cả"}
              </Typography>
            </Box>

            <Button
              sx={{
                textDecoration: "underline",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                border: 1,
              }}
              onClick={handleFilterOpen}
            >
              Bộ Lọc
            </Button>
          </Box>
        </Box>
      </Stack>

      {/* Filter Modal */}
      <Dialog open={filterModalOpen} onClose={handleFilterClose}>
        <DialogTitle textAlign={"center"} fontWeight={"bold"}>
          Bộ Lọc Đơn Hàng
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "white" }}>
          {/* Status filter */}
          <Typography variant="subtitle1" fontWeight={"bold"}>
            Trạng Thái:
          </Typography>
          {["PENDING", "COMPLETED", "CANCELLED"].map((status) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                />
              }
              label={status}
              key={status}
            />
          ))}
          {/* Payment filter */}
          <Typography variant="subtitle1" fontWeight={"bold"} mt={2}>
            Phương Thức Thanh Toán:
          </Typography>
          {["CASH", "VNPAY", "MOMO"].map((payment) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedPayments.includes(payment)}
                  onChange={() => handlePaymentChange(payment)}
                />
              }
              label={payment}
              key={payment}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

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
                    key={order.orderId}
                    hover
                    onClick={() => handleRowClick(order)}
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
                              ? new Date(order.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )
                              : column.field === "customerPhone"
                                ? order.customerPhone
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
