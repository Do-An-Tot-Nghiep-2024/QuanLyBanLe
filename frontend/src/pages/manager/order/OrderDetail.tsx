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

// Define the type for order items
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  amount: number;
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

  const auth = useAppSelector(state => state.auth);
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
  const columns = ["Tên sản phẩm", "Số lượng", "Đơn giá", "Thành tiền"];

  return (
    <Container sx={{ pt: 5, mt: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Chi tiết đơn hàng #{data?.orderId}
      </Typography>

      <Box>
        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Nhân viên: </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
            {data?.employee}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Trạng thái đơn hàng: </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
            {data?.orderStatus}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Phương thức thanh toán: </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
            {data?.paymentType}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Ngày tạo đơn hàng: </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
            {formatDateTime(data?.createdAt as string)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Khách hàng thanh toán: </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
            {formatMoney(Number(data?.customerPayment))}
          </Typography>
        </Stack>
      </Box>

      {/* Display order items in a table */}
      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead sx={{}}>
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
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="center">{formatMoney(item.price)}</TableCell>
                <TableCell align="center">{formatMoney(item.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Total and Discount Section */}
      <Box sx={{ mt: 4 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Tổng tiền: </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
            {formatMoney(Number(data?.total))}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Giảm giá: </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: "500" }}>
            {formatMoney(Number(data?.totalDiscount))}
          </Typography>
        </Stack>
      </Box>

      {/* Button to print the invoice or order details */}
      <Button
        onClick={() => {
          const state = data;
          if(auth.role === "EMPLOYEE"){
            navigate("/staff/print/order-invoice", {
              state: state, // Pass the order data to the print page
            });
          }else{
            navigate("/print/order-invoice", {
              state: state, // Pass the order data to the print page
            });
          }
        
        }}
        variant="contained"
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
