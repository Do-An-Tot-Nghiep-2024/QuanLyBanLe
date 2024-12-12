import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrderDetailService } from "../../../services/order.service"; // Assuming you have this service
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { formatMoney } from "../../../utils/formatMoney"; // Assuming you have this utility for formatting money
import { useAppSelector } from "../../../redux/hook";
import colors from "../../../constants/color";

// Define the type for order items
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  amount: number;
  shipment: number;
}

interface OrderDetailResponse {
  orderId: number;
  employee: string;
  orderStatus: string;
  paymentType: string;
  total: number;
  totalDiscount: number;
  customerPayment: number;
  createdAt: string;
  customerPhone: string;
  orderItemResponses: OrderItem[];
}

export default function OrderDetailPage() {
  const { orderId } = useParams();

  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const orderNumber = Number(orderId);

  const formatDateTime = (date: string): string => {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleString("vi-VN");
  };

  // Fetch order details using the query function
  const getOrderDetail = async (id: number) => {
    try {
      const response = await getOrderDetailService(id);
      if (response.message === "success") {
        console.log(response.data);
        return response.data as OrderDetailResponse;
      }
      throw new Error("Error fetching order details");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Query to fetch order details
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetail(orderNumber),
    refetchOnWindowFocus: false,
  });

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  // Columns for the table
  const columns = [
    "Tên sản phẩm",
    "Lô hàng",
    "Số lượng",
    "Đơn giá",
    "Thành tiền",
  ];

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
  const res = {
    status: data?.orderStatus ?? "",
    paymentType: data?.paymentType ?? "",
    total: data?.total ?? 0,
    customerPayment: data?.customerPayment ?? 0,
    createdAt: data?.createdAt ?? "",
    employee: data?.employee ?? "",
    orderId: data?.orderId ?? 0,
    totalDiscount: data?.totalDiscount ?? 0,
  };
  return (
    <Container sx={{ pt: 5, mt: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Chi tiết đơn hàng #{data?.orderId}
      </Typography>

      <Box>
        <Stack flexDirection={"row"} gap={3}>
          <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
            <Typography fontWeight="bold">Nhân viên: </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
              {data?.employee}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
            <Typography fontWeight="bold">Trạng thái đơn hàng: </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
              {translateStatus(String(data?.orderStatus))}
            </Typography>
          </Stack>
        </Stack>

        <Stack flexDirection={"row"} gap={3}>
          <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
            <Typography fontWeight="bold">Phương thức thanh toán: </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
              {translatePaymentType(String(data?.paymentType))}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
            <Typography fontWeight="bold">Ngày tạo đơn hàng: </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
              {formatDateTime(data?.createdAt as string)}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Tổng tiền: </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: "bold" }}>
            {formatMoney(Number(data?.total))}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Giảm giá: </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: "bold" }}>
            {formatMoney(Number(data?.totalDiscount))}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Tiền khách đưa: </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
            {formatMoney(Number(data?.customerPayment))}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Tiền trả lại: </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
            {formatMoney(
              Number(res.customerPayment - (res.total - res.totalDiscount))
            )}
          </Typography>
        </Stack>
      </Box>

      {/* Display order items in a table */}
      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead sx={{backgroundColor: colors.secondaryColor}}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  align={column === "Tên sản phẩm" ? "left" : "center"}
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.orderItemResponses.map((item, index) => (
              <TableRow key={index}>
                <TableCell align="left">{item.name}</TableCell>
                <TableCell align="center">{item.shipment}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="center">{formatMoney(item.price)}</TableCell>
                <TableCell align="center">{formatMoney(item.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Total and Discount Section */}

      {/* Button to print the invoice or order details */}
      <Button
        onClick={() => {
          const state = data;
          if (auth.role === "EMPLOYEE") {
            navigate("/staff/print/order-invoice", {
              state: state,
            });
          } else {
            navigate("/print/order-invoice", {
              state: state,
            });
          }
        }}
        variant="contained"
        disabled={data?.orderStatus !== "COMPLETED"}
        startIcon={<PictureAsPdfIcon />}
        sx={{
          display: "flex",
          mt: 2,
        }}
      >
        In hóa đơn
      </Button>
    </Container>
  );
}
