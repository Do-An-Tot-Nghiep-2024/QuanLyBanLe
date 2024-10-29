import {  useParams } from "react-router-dom";
import { getShipmentItemsService } from "../../services/inventory.service";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  // Button,
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

import ShipmentItem from "../../types/inventory/shipmentItem";
import { formatMoney, formatMoneyThousand } from "../../utils/formatMoney";
import { formatDate, formatDateTime } from "../../utils/convertDate";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function InventoryDetailPage() {
  const id = useParams().id;
  // const navigate = useNavigate();
  const shipmentId = Number(id?.substring(5));
  const getShipmentItems = async (id: number) => {
    try {
      const response = await getShipmentItemsService(id);
      console.log(response);
      if (response.message !== "success") {
        throw new Error("Error fetching employees");
      }
      return response.data as ShipmentItem;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to be handled by useQuery
    }
  };
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["inventory", id],
    queryFn: () => getShipmentItems(shipmentId), // No need for async/await here
  });

  if (isFetching || isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const columns = [
    "Tên sản phẩm",
    "Số lượng",
    "Ngày sản xuất",
    "Ngày hết hạn",
    "Đơn giá",
    "Thành tiền",
  ];
  return (
    <Container>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Chi tiết hóa đơn nhập hàng
      </Typography>
      <Box>
        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Tên nhà cung cấp: </Typography>
          <Typography sx={{ fontSize: 15 }}>{data?.name}</Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Ngày tạo hóa đơn: </Typography>
          <Typography sx={{ fontSize: 15 }}>
            {formatDateTime(data?.createdAt as Date)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 2, fontSize: 14 }}>
          <Typography fontWeight="bold">Tổng thành tiền: </Typography>
          <Typography sx={{ fontSize: 15 }}>
            {formatMoney(data?.total as number)}
          </Typography>
        </Stack>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
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
          {/* Content table */}
          <TableBody>
            {data?.productItems.map((item, index: number) => (
              <TableRow key={index}>
                <TableCell align={"center"}>{item.name}</TableCell>
                <TableCell align={"center"}>{item.quantity}</TableCell>
                <TableCell align={"center"}>{formatDate(item.mxp)}</TableCell>
                <TableCell align={"center"}>{formatDate(item.exp)}</TableCell>
                <TableCell align={"center"}>
                  {formatMoneyThousand(item.price)}
                </TableCell>
                <TableCell align={"center"}>
                  {formatMoneyThousand(item.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Button
        onClick={() => {
          navigate("/print/import-invoice", {
            state: data,
          });
        }}
        variant="contained"
        startIcon={<PictureAsPdfIcon />}
        sx={{
          display: "flex",
          mt: 2,
        }}
      >
        In hóa đơn
      </Button> */}
    </Container>
  );
}
