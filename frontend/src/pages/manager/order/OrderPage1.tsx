import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Avatar,
  Modal,
  Stack,
} from "@mui/material";
import { getAllProductsByNameService } from "../../../services/product.service";
import { GetProductSchema } from "../../../types/getProductSchema";
import { createOrderService } from "../../../services/order.service";
import AddBoxIcon from "@mui/icons-material/AddBox";
import TextSearch from "../../../components/TextSeatch";
import { useQuery } from "@tanstack/react-query";
import { GetPromotion } from "../../../types/getPromotion";
import { getLatestPromotionService } from "../../../services/promotion.service";
import colors from "../../../constants/color";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hook";

interface OrderItem {
  product: GetProductSchema;
  quantity: number;
  price: number;
  selectedShipment?: string;
}

const OrderPage: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>(() => {
    // Load saved order items from localStorage during initialization
    const savedOrderItems = localStorage.getItem("orderItems");
    return savedOrderItems ? JSON.parse(savedOrderItems) : [];
  });
  const [customerPayment, setCustomerPayment] = useState(0);
  const [customerChange, setCustomerChange] = useState(0);
  const [latestPromotion, setLatestPromotion] = useState<GetPromotion>();
  const [deleteConfirmOpen, setConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(0);
  // const [totalDiscount, setTotalDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleUpdateTotal = (orderItems: OrderItem[]) => {
    setTotal(
      orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
  };

  const handleAddToOrder = (product: GetProductSchema) => {
    const missingShipment = orderItems.some((item) => !item.selectedShipment);

    if (missingShipment) {
      alert(
        "Vui lòng chọn mã lô hàng cho tất cả sản phẩm trước khi thêm sản phẩm mới."
      );
      return;
    }

    setOrderItems((prev) => [
      ...prev,
      {
        product,
        quantity: 1,
        price: Number(product.price),
        selectedShipment: "",
      },
    ]);
    handleUpdateTotal(orderItems);
  };

  const handleUpdateQuantity = (product: OrderItem, quantity: number) => {
    if (!product.selectedShipment) {
      alert("Chưa chọn lô hàng");
      return;
    }
    if (quantity <= 0 || quantity > 100) {
      alert("Số lượng sản phẩm cho mỗi đơn hàng phải ít hơn 100 và lớn hơn 0");
      return;
    }
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product.id === product.product.id &&
        item.selectedShipment === product.selectedShipment
          ? { ...item, quantity }
          : item
      )
    );
    handleUpdateTotal(orderItems);
    // const currTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // if(!isNaN(total)){
    //   console.log(total);

    //   setCustomerChange(customerPayment - total - getPromotionCurrent());
    // }

    // setCustomerChange(customerPayment - total - getPromotionCurrent());
  };

  const isShipmentSelected = () => {
    return orderItems.every((item) => item.selectedShipment);
  };

  const handleCreateBill = async () => {
    const totalPayment = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (orderItems.length === 0) {
      alert("Chưa thêm sản phẩm nào");
      return;
    }
    if (!isShipmentSelected()) {
      alert("Vui lòng chọn mã lô hàng cho tất cả sản phẩm");
      return;
    }

    if (
      customerPayment === 0 ||
      customerPayment < totalPayment - getPromotionCurrent() ||
      !isCustomerPaymentValid(customerPayment)
    ) {
      alert("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    const formattedOrderItems = orderItems
      .map((item) => {
        if (item.quantity === 0 || !item.quantity) {
          alert("Số lượng sản phẩm không hợp lệ");
          return null; // Return null for invalid items
        }
        return {
          productId: item.product.id,
          quantity: item.quantity,
          shipmentId: item.selectedShipment,
        };
      })
      .filter((item) => item !== null);

    if (formattedOrderItems.length === 0) {
      return;
    }

    try {
      let totalDiscount = 0;
      if (latestPromotion) {
        if (totalPayment >= latestPromotion?.minOrderValue) {
          totalDiscount = Number(totalPayment * latestPromotion?.percentage);
        }
      }
      console.log(totalDiscount);
      const response = await createOrderService(
        formattedOrderItems,
        customerPayment,
        totalDiscount
      );
      // console.log("Order created:", response);
      if (response.message === "success") {
        const data = response.data as { orderId: number };
        if (auth.role === "ADMIN") {
          navigate(`/orders/${data.orderId}`);
        } else {
          navigate(`/staff/orders/${data.orderId}`);
        }
        setOrderItems([]);
        setCustomerChange(0);
        setCustomerPayment(0);
        localStorage.removeItem("orderItems");
      } else {
        alert(response.message);
        return;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Có lỗi khi tạo order");
    }
  };

  const fetchProducts = async () => {
    const response = await getAllProductsByNameService(searchTerm);
    if (!response) {
      throw new Error("Error fetching products");
    }

    return response as unknown as GetProductSchema[];
  };

  const { data, refetch } = useQuery({
    queryKey: ["products", searchTerm],
    queryFn: fetchProducts,
  });

  const handleUpdateShipment = async (
    productId: number,
    selectedShipment: string
  ) => {
    console.log(selectedShipment);
    const existingItemIndex = orderItems.findIndex(
      (item) =>
        item.product.id === productId &&
        item.selectedShipment === selectedShipment
    );
    if (existingItemIndex != -1) {
      console.log("existed");
      setOrderItems((prev) =>
        prev.map((orderItem, index) =>
          index === existingItemIndex
            ? {
                ...orderItem,
                quantity: orderItem.quantity + 1,
                selectedShipment,
              }
            : { ...orderItem }
        )
      );
      setOrderItems((prevItems) =>
        prevItems.filter((itm) => itm.selectedShipment !== "")
      );
    } else {
      console.log("new item");
      setOrderItems((orderItems) =>
        orderItems.map((itm) => {
          if (
            Number(itm.product.id) === Number(productId) &&
            itm.selectedShipment === ""
          ) {
            console.log("duplicate");

            return { ...itm, selectedShipment };
          }
          return itm;
        })
      );
    }
    console.log("Updated order items:", orderItems);
  };

  const isCustomerPaymentValid = (payment: number) => {
    const regex = /^[1-9][0-9]{0,7}|^$$/;
    return regex.test(String(payment));
  };

  const updateCustomerPayment = (customerPayment: number) => {
    if (customerPayment === 0) {
      setCustomerPayment(0);
      setCustomerChange(0);
      return;
    }

    if (isCustomerPaymentValid(customerPayment)) {
      setCustomerPayment(customerPayment);
      const totalRequired = total - getPromotionCurrent();
      // console.log(totalRequired);
      setCustomerChange(customerPayment - totalRequired);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (!searchTerm) {
      refetch();
    }
  }, [searchTerm, refetch]);

  const handleGetLatestPromotion = async () => {
    const response = await getLatestPromotionService();
    if (response.message !== "success") {
      setLatestPromotion(undefined);
    }

    setLatestPromotion(response.data as GetPromotion);
  };

  const totalPayment = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    handleGetLatestPromotion();
  }, [total]);

  const handleDeleteClose = () => {
    setConfirmOpen(false);
  };

  const getPromotionCurrent = () => {
    if (latestPromotion !== undefined && latestPromotion !== null) {
      if (total >= latestPromotion?.minOrderValue) {
        return total * latestPromotion?.percentage;
      }
    }
    return 0;
  };

  const handleDeleteOrderItem = () => {
    let total = 0;
    setOrderItems((prevOrderItems) =>
      prevOrderItems.filter((item) => {
        if (item.product.id !== deleteItem) {
          total += item.price * item.quantity;
          return item;
        }
        // item.product.id !== deleteItem;
      })
    );

    // update in localStorage
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    setCustomerChange(customerPayment - total - getPromotionCurrent());
    setConfirmOpen(false);
    handleUpdateTotal(orderItems);
  };

  const handleOpenDelete = (id: number) => {
    setConfirmOpen(true);
    setDeleteItem(id);
  };
  useEffect(() => {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    handleUpdateTotal(orderItems);
  }, [orderItems]);

  return (
    <Box display="flex" p={1} sx={{ height: "100%", width: "100%" }}>
      <Box flexBasis="30%" mr={2} sx={{ backgroundColor: "", height: "100%" }}>
        <Box display={"flex"} flexDirection={"row"} gap={1}>
          <TextSearch
            props={{
              placeholder: "Nhập tên sản phẩm...",
              state: searchTerm,
              setState: handleSearchChange,
            }}
          />
          {/* <Button
            onClick={() => handleSearchClick()}
            color="primary"
            variant="contained"
          >
            Tìm
          </Button> */}
        </Box>
        <List
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",
            borderRadius: 2,
            mt: 1,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {data?.map((product) => (
            <ListItem
              key={Number(product.id)}
              divider
              sx={{
                backgroundColor: "white",
                border: 1,
                borderRadius: 5,
                boxShadow: 4,
                borderColor: "#FBFBFB",
                height: 80,
                mx: 3,
              }}
            >
              <Avatar src={String(product.image)} style={{ marginRight: 16 }} />
              <ListItemText
                primary={`${product.name} - ${formatCurrency(Number(product.price))}`}
                primaryTypographyProps={{
                  style: { whiteSpace: "normal", overflowWrap: "break-word" },
                }}
              />
              <Tooltip title="Thêm sản phẩm" arrow>
                <IconButton
                  onClick={() => handleAddToOrder(product)}
                  size="large"
                  color="success"
                >
                  <AddBoxIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box flex={1}>
        <Paper
          elevation={3}
          sx={{ padding: 2, borderRadius: 2, backgroundColor: "#fff" }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Chi tiết đơn hàng
          </Typography>

          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow
                  sx={{ backgroundColor: "#f5f5f5", textAlign: "center" }}
                >
                  <TableCell sx={{ textAlign: "left", fontWeight: "bold" }}>
                    Tên sản phẩm
                  </TableCell>
                  <TableCell sx={{ textAlign: "left", fontWeight: "bold" }}>
                    Mã lô hàng
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                    Số lượng
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                    Giá
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                    Thành tiền
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item, index) => (
                  <TableRow
                    key={`${item.product.id}-${item.selectedShipment}`}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    }}
                  >
                    <TableCell sx={{ textAlign: "left", padding: "16px 8px" }}>
                      {item.product.name}
                    </TableCell>
                    <TableCell sx={{ textAlign: "left", padding: "16px 8px" }}>
                      <Select
                        value={item.selectedShipment || ""}
                        onChange={(e) =>
                          handleUpdateShipment(
                            Number(item.product.id),
                            e.target.value
                          )
                        }
                        sx={{ width: "100%", textAlign: "left" }}
                      >
                        <MenuItem value="">Chọn mã lô hàng</MenuItem>
                        {item.product.shipmentIds?.map((shipment) => (
                          <MenuItem key={shipment} value={shipment}>
                            {shipment}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", padding: "16px 8px" }}
                    >
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(item, parseInt(e.target.value))
                        }
                        sx={{ width: "50%" }}
                        inputProps={{ style: { textAlign: "center" } }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", padding: "16px 8px" }}
                    >
                      {formatCurrency(Number(item.price))}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", padding: "16px 8px" }}
                    >
                      {formatCurrency(
                        item.price && item.quantity
                          ? item.price * item.quantity
                          : 0
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          handleOpenDelete(Number(item.product.id))
                        }
                        sx={{ color: "red" }}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            display="flex"
            flexDirection="column"
            mt={2}
            alignItems="flex-end"
            width="100%"
          >
            <Typography sx={{ mb: 2, fontWeight: "bold" }}>
              Tổng tiền hàng: {formatCurrency(total as number)}
            </Typography>

            <Box>
              {latestPromotion != null && latestPromotion != undefined ? (
                totalPayment >= latestPromotion?.minOrderValue ? (
                  <Typography
                    variant="body1"
                    sx={{ color: "green", fontWeight: "bold", mb: 2 }}
                  >
                    Chúc mừng! Bạn đã đủ điều kiện nhận ưu đãi{" "}
                    {latestPromotion.percentage * 100}% cho đơn hàng từ{" "}
                    {formatCurrency(latestPromotion.minOrderValue)}
                  </Typography>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ color: "green", fontWeight: "bold", mb: 2 }}
                  >
                    Bạn chưa đủ điều kiện nhận ưu đãi{" "}
                    {latestPromotion?.percentage * 100}% cho đơn hàng từ{" "}
                    {formatCurrency(Number(latestPromotion?.minOrderValue))}.
                  </Typography>
                )
              ) : null}
            </Box>

            <TextField
              label="Tiền khách hàng đưa"
              variant="outlined"
              type="number"
              value={customerPayment}
              onChange={(e) => {
                updateCustomerPayment(Number(e.target.value));
              }}
              sx={{ mb: 2, width: "30%" }}
            />

            {latestPromotion != null &&
            latestPromotion != undefined &&
            totalPayment >= latestPromotion?.minOrderValue ? (
              <Typography
                sx={{ mb: 2, fontWeight: "bold", fontStyle: "italic" }}
              >
                Tổng tiền giảm giá khuyến mãi:{" "}
                {formatCurrency(
                  Number(totalPayment * latestPromotion?.percentage)
                )}
              </Typography>
            ) : (
              <Typography
                sx={{ mb: 2, fontWeight: "bold", fontStyle: "italic" }}
              >
                Tổng tiền giảm giá khuyến mãi: 0
              </Typography>
            )}

            <Typography sx={{ mb: 2, fontStyle: "italic" }}>
              Số tiền khách cần trả:{" "}
              {formatCurrency(total - getPromotionCurrent())}
            </Typography>
            <Typography sx={{ mb: 2, fontStyle: "italic" }}>
              Tiền thừa: {formatCurrency(customerChange)}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateBill}
              sx={{ width: "100%" }}
            >
              Tạo đơn hàng
            </Button>
          </Box>
        </Paper>
      </Box>
      <Modal
        open={deleteConfirmOpen}
        onClose={handleDeleteClose}
        aria-labelledby="delete-category-modal"
        aria-describedby="delete-category-modal-description"
        sx={styles.modal}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "8px",
            height: "30vh",
            width: "30vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <h3 id="delete-category-modal">Xác nhận xóa</h3>
          <Typography
            sx={{
              fontSize: "16px",
            }}
          >
            Bạn có chắc chắn muốn xóa sản phẩm này không?
          </Typography>
          <Stack direction="row" gap={2} spacing={2} pb={2}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteClose}
              sx={{ fontWeight: "bold" }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleDeleteOrderItem()}
              sx={{ fontWeight: "bold" }}
            >
              Xóa
            </Button>
          </Stack>
        </div>
      </Modal>
    </Box>
  );
};
const styles = {
  searchField: {
    display: { xs: "none", md: "inline-block", sm: "flex" },
    mr: 1,
    width: "100%",
    mt: 2,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
  closeButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    width: "30%",
  },
  addButton: {
    backgroundColor: colors.primaryColor,
    borderRadius: "8px",
    width: "30%",
    color: "white",
  },
};

export default OrderPage;
