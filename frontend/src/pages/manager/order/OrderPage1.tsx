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
  SelectChangeEvent,
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
import { formatMoneyThousand } from "../../../utils/formatMoney";
import SnackbarMessage from "../../../components/SnackbarMessage";

interface Shipment {
  id: number;
  discount: number;
}

interface OrderItem {
  product: GetProductSchema;
  quantity: number;
  price: number;
  selectedShipment?: Shipment;
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
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatStringThousand = (amount: string) => {
    // format 1.000 -> 1000
    return amount.replace(/\./g, "");
  };
  /**
   *
   *  Fetching data
   */
  const handleGetLatestPromotion = async () => {
    try {
      const response = await getLatestPromotionService();
      if (response.message !== "success") {
        setLatestPromotion(undefined);
      }
      setLatestPromotion(response.data as GetPromotion);
    } catch (error) {
      setMessage("Có lỗi khi tải thông tin khuyến mãi");
      setSnackbarOpen(true);
      return;
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

  useEffect(() => {
    handleGetLatestPromotion();
  }, []);

  const getPromotionCurrent = () => {
    if (latestPromotion !== undefined && latestPromotion !== null) {
      if (total >= latestPromotion?.minOrderValue) {
        return total * latestPromotion?.percentage;
      }
    }
    return 0;
  };

  useEffect(() => {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
    handleUpdateTotal(orderItems);
    handleUpdateDiscount(orderItems);
  }, [orderItems]);

  useEffect(() => {
    if (!searchTerm) {
      refetch();
    }
  }, [searchTerm, refetch]);

  const handleDeleteClose = () => {
    setConfirmOpen(false);
  };

  const handleUpdateTotal = (orderItems: OrderItem[]) => {
    let sum = 0;
    orderItems.forEach((item) => {
      const total =
        item.price && item.quantity
          ? (item.price - (item.selectedShipment?.discount ?? 0) * item.price) *
            item.quantity
          : 0;
      sum += total;
    });
    setTotal(sum);
  };

  const handleUpdateDiscount = (orderItems: OrderItem[]) => {
    let discountSum = 0;
    orderItems.forEach((item) => {
      if (item.selectedShipment) {
        discountSum +=
          item.selectedShipment.discount * item.price * item.quantity;
      }
    });
    discountSum += latestPromotion?.percentage ?? 0 * total;
    setDiscount(discountSum);
  };

  const handleAddToOrder = (product: GetProductSchema) => {
    // console.log(product);
    const missingShipment = orderItems.some((item) => !item.selectedShipment);

    if (missingShipment) {
      alert(
        "Vui lòng chọn mã lô hàng cho tất cả sản phẩm trước khi thêm sản phẩm mới."
      );
      return;
    }
    let totalOrder = 0;
    setOrderItems((prev) => {
      // Create the updated list of items
      const updatedItems = [
        ...prev,
        {
          product,
          quantity: 1,
          price: Number(product.price),
          selectedShipment: undefined,
        },
      ];
      // Calculate the total directly in this function
      totalOrder = updatedItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      return updatedItems; // Return the updated state
    });

    orderItems.forEach((item) => {
      console.log("item discount", item);
    });

    handleUpdateTotal(orderItems);

    if (customerPayment === 0) {
      setCustomerChange(0);
    } else {
      setCustomerChange(customerPayment - totalOrder - getPromotionCurrent());
    }
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
    let totalOrder = 0;
    // let discountSum = 0;
    setOrderItems((prev) => {
      const updatedItems = prev.map((item) => {
        // Check if the item matches the product and shipment
        if (
          item.product.id === product.product.id &&
          item.selectedShipment?.id === product.selectedShipment?.id
        ) {
          // Update the quantity
          const updatedItem = { ...item, quantity };

          // Add to the total order
          const total =
            updatedItem.price && updatedItem.quantity
              ? (updatedItem.price -
                  (updatedItem.selectedShipment?.discount ?? 0) *
                    updatedItem.price) *
                updatedItem.quantity
              : 0;
          // const discount = updatedItem.selectedShipment?.discount ?? 0 * updatedItem.price * updatedItem.quantity;
          // discountSum += discount;
          totalOrder += total;
          return updatedItem;
        } else {
          // Add the current item's total to the totalOrder
          const total =
            item.price && item.quantity
              ? (item.price -
                  (item.selectedShipment?.discount ?? 0) * item.price) *
                item.quantity
              : 0;
          // const discount = item.selectedShipment?.discount ?? 0 * item.price * item.quantity;
          // discountSum += discount;
          totalOrder += total;
          return item;
        }
      });
      return updatedItems; // Return the updated state
    });

    // setDiscount(discountSum);
    if (customerPayment === 0) {
      setCustomerChange(0);
    } else {
      setCustomerChange(
        customerPayment -
          (isNaN(totalOrder) ? 0 : totalOrder - getPromotionCurrent())
      );
    }
  };

  const isShipmentSelected = () => {
    return orderItems.every((item) => item.selectedShipment);
  };

  const handleCreateBill = async () => {
    // const totalPayment = orderItems.reduce(
    //   (sum, item) => sum + item.price * item.quantity,
    //   0
    // );
    if (orderItems.length === 0) {
      setMessage("Vui lòng chọn sản phẩm trước khi tạo đơn hàng");
      setSnackbarOpen(true);
      return;
    }
    if (!isShipmentSelected()) {
      setMessage("Vui lòng chọn mã lô hàng cho tất cả sản phẩm");
      setSnackbarOpen(true);
      return;
    }

    const formattedOrderItems = orderItems
      .map((item) => {
        if (item.quantity === 0 || !item.quantity) {
          setMessage("Số lượng sản phẩm không hợp lệ");
          setSnackbarOpen(true);
          return null; // Return null for invalid items
        }
        return {
          productId: item.product.id,
          quantity: item.quantity,
          shipmentId: item.selectedShipment?.id,
        };
      })
      .filter((item) => item !== null);

    if (formattedOrderItems.length === 0) {
      return;
    }

    try {
      if (
        customerPayment === 0 ||
        customerPayment < total - (getPromotionCurrent() + discount) ||
        !isCustomerPaymentValid(customerPayment)
      ) {
        setMessage("Số tiền khách trả không đủ");
        setSnackbarOpen(true);
        return;
      }

      // console.log(totalDiscount);
      const response = await createOrderService(
        formattedOrderItems,
        customerPayment,
        discount + getPromotionCurrent()
      );
      // console.log("Order created:", response);
      if (response.message === "success") {
        const data = response.data as { orderId: number };
        if (auth.role === "MANAGER") {
          navigate(`/orders/${data.orderId}`);
        } else {
          navigate(`/staff/orders/${data.orderId}`);
        }
        setOrderItems([]);
        setCustomerChange(0);
        setCustomerPayment(0);
        localStorage.removeItem("orderItems");
      } else {
        setMessage(response.message);
        setSnackbarOpen(true);
        return;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setMessage("Có lỗi khi tạo order");
      setSnackbarOpen(true);
      return;
    }
  };

  const handleUpdateShipment = async (
    productId: number,
    selectedShipment: Shipment
  ) => {
    const existingItemIndex = orderItems.findIndex(
      (item) =>
        item.product.id === productId &&
        item.selectedShipment?.id === selectedShipment.id
    );
    if (existingItemIndex != -1) {
      console.log("existed");
      setOrderItems((prev) =>
        prev
          .map((orderItem, index) =>
            index === existingItemIndex
              ? {
                  ...orderItem,
                  quantity: orderItem.quantity + 1,
                  selectedShipment,
                }
              : { ...orderItem }
          )
          .filter((itm) => itm.selectedShipment !== undefined)
      );
      // setOrderItems((prevItems) =>
      //   prevItems.filter((itm) => itm.selectedShipment !== undefined)
      // );
    } else {
      console.log("new item");
      setOrderItems((orderItems) =>
        orderItems.map((itm) => {
          if (
            Number(itm.product.id) === Number(productId) &&
            itm.selectedShipment === undefined
          ) {
            // console.log("duplicate");

            return { ...itm, selectedShipment };
          }
          return itm;
        })
      );
    }
    let discountSum = 0;
    orderItems.forEach((item) => {
      if (item.selectedShipment) {
        discountSum +=
          item.selectedShipment.discount * item.price * item.quantity;
      }
    });
    setDiscount(discountSum);
    console.log("discount value is", discount);
  };

  const isCustomerPaymentValid = (payment: number) => {
    const regex = /^[1-9][0-9]{0,7}|^$$/;
    return regex.test(String(payment));
  };

  const updateCustomerPayment = (customerPayment: string) => {
    const paymentCustomer = Number(formatStringThousand(customerPayment));

    // console.log(pay);
    if (isNaN(paymentCustomer)) {
      setCustomerPayment(0);
      setCustomerChange(0);
      return;
    }

    if (paymentCustomer === 0) {
      setCustomerPayment(0);
      setCustomerChange(0);
      return;
    }

    // if (isCustomerPaymentValid(pay)) {
    setCustomerPayment(paymentCustomer);
    const totalRequired = total - getPromotionCurrent();
    setCustomerChange(paymentCustomer - totalRequired);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const totalPayment = orderItems.reduce(
    (sum, item) =>
      sum +
      (item.price - (item.selectedShipment?.discount ?? 0) * item.price) *
        item.quantity,
    0
  );

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
    if (customerPayment == 0) {
      setCustomerChange(0);
    } else {
      setCustomerChange(customerPayment - total - getPromotionCurrent());
    }
    setConfirmOpen(false);
    handleUpdateTotal(orderItems);
  };

  const handleOpenDelete = (id: number) => {
    setConfirmOpen(true);
    setDeleteItem(id);
  };

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
            mt: 1,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
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
                  size="medium"
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
            <Table sx={{ minWidth: 650 }} size="small">
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
                    Giảm giá
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
                    hover
                    key={`${item.product.id}-${item.selectedShipment}`}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                      height: 80,
                    }}
                  >
                    <TableCell sx={{ textAlign: "left", padding: "16px 8px" }}>
                      {item.product.name}
                    </TableCell>
                    <TableCell sx={{ textAlign: "left", padding: "16px 8px" }}>
                      <Select
                        value={item.selectedShipment?.id as any}
                        onChange={(e: SelectChangeEvent) => {
                          const id = Number(e.target.value);
                          const selectedShipment =
                            item.product.shipmentIds?.find(
                              (shipment) => shipment.id === id
                            );
                          handleUpdateShipment(Number(item.product.id), {
                            id: id,
                            discount: selectedShipment?.discount || 0,
                          });
                        }}
                        sx={{ width: "100%", textAlign: "left" }}
                      >
                        {/* <MenuItem value="">Chọn mã lô hàng</MenuItem> */}
                        {item.product.shipmentIds?.map((shipment) => (
                          <MenuItem key={shipment.id} value={shipment.id}>
                            {shipment.id}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", padding: "16px 8px" }}
                    >
                      <TextField
                        type="number"
                        defaultValue={1}
                        value={item.quantity}
                        onChange={(e) => {
                          handleUpdateQuantity(item, parseInt(e.target.value));
                        }}
                        sx={{ width: "50%" }}
                        inputProps={{ style: { textAlign: "center" } }}
                      />
                    </TableCell>

                    <TableCell
                      sx={{ textAlign: "center", padding: "16px 8px" }}
                    >
                      {formatMoneyThousand(Number(item.price))}
                    </TableCell>

                    <TableCell
                      sx={{ textAlign: "center", padding: "16px 8px" }}
                    >
                      {"-" +
                        formatMoneyThousand(
                          (item.selectedShipment?.discount ?? 0) * item.price
                        )}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", padding: "16px 8px" }}
                    >
                      {formatMoneyThousand(
                        item.price && item.quantity
                          ? (item.price -
                              (item.selectedShipment?.discount ?? 0) *
                                item.price) *
                              item.quantity
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
            <Stack
              width={"100%"}
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              pb={2}
            >
              <Box>
                <Typography sx={{ fontWeight: "bold", fontSize: 21 }}>
                  Tổng tiền hàng:{" "}
                  {isNaN(total) ? 0 : formatCurrency(total as number)}
                </Typography>
                <Typography
                  sx={{ fontStyle: "normal", fontWeight: "bold", fontSize: 21 }}
                >
                  Số tiền khách cần trả:{" "}
                  {isNaN(total)
                    ? 0
                    : formatCurrency(total - getPromotionCurrent())}
                </Typography>
              </Box>
              <TextField
                label="Tiền khách đưa"
                variant="outlined"
                type="text"
                slotProps={{
                  input: {
                    style: {
                      fontSize: 21,
                      fontFamily: "Roboto",
                      fontWeight: "bolder",
                    },
                  },
                }}
                value={
                  orderItems.length < 0
                    ? formatMoneyThousand(0)
                    : formatMoneyThousand(customerPayment)
                }
                onChange={(e) => {
                  updateCustomerPayment(e.target.value);
                }}
                // sx={{ mb: 2, width: "30%" }}
              />
            </Stack>

            <Typography sx={{ mb: 2, fontWeight: "bold", fontStyle: "italic" }}>
              Tổng tiền giảm giá khuyến mãi:{" "}
              {isNaN(discount)
                ? 0
                : formatCurrency(discount + getPromotionCurrent())}
            </Typography>
           
            <Typography sx={{ fontStyle: "italic", fontSize: 20 }}>
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
      {/* error message */}
      <SnackbarMessage
        isError={true}
        alertMessage={message}
        setSnackbarOpen={setSnackbarOpen}
        snackbarOpen={snackbarOpen}
      />

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
