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
  InputLabel,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
} from "@mui/material";
import { getCategoriesService } from "../../services/category.service";
import { getAllProductsService } from "../../services/product.service";
import { GetProductSchema } from "../../types/getProductSchema";
import { createOrderService } from "../../services/order.service";
import AddBoxIcon from "@mui/icons-material/AddBox";

interface OrderItem {
  product: GetProductSchema;
  quantity: number;
  price: number;
  selectedShipment?: string;
}

interface Category {
  name: string;
}

const OrderPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<GetProductSchema[]>([]);
  const [page] = useState(1);
  const [limit] = useState(10);
  const [customerPayment, setCustomerPayment] = useState(0);
  const [customerChange, setCustomerChange] = useState(0);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleAddToOrder = (product: GetProductSchema) => {
    setOrderItems((prev) => {
      console.log(prev);
      return [
        ...prev,
        { product, quantity: 1, price: Number(product.price), selectedShipment: "" },
      ];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const isShipmentSelected = () => {
    return orderItems.every(item => item.selectedShipment);
  };

  const isCustomerPaymentValid = (payment: number) => {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(String(payment));
  };

  const handleCreateBill = async () => {
    const totalPayment = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (orderItems.length === 0) {
      alert("Chưa thêm sản phẩm nào");
      return;
    }
    if (!isShipmentSelected()) {
      alert("Vui lòng chọn mã lô hàng cho tất cả sản phẩm");
      return;
    }

    if (customerPayment === 0 || customerPayment < totalPayment || !isCustomerPaymentValid(customerPayment)) {
      alert("Vui lòng nhập số tiền hợp lệ");
      return;
    }



    const formattedOrderItems = orderItems.map(item => {
      if (item.quantity === 0 || !item.quantity) {
        alert("Số lượng sản phẩm không hợp lệ")
        return;
      }
      return {
        productId: item.product.id,
        quantity: item.quantity,
        shipmentId: item.selectedShipment,
      }

    }).filter(item => item !== null);

    if (formattedOrderItems.length === 0) {
      return;
    }

    try {
      const response = await createOrderService(formattedOrderItems, customerPayment);
      console.log("Order created:", response);
      if (response.message === 'success') {
        setOrderItems([]);
        setCustomerChange(0);
        setCustomerPayment(0);
      }

    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred while creating the order.");
    }
  };

  const fetchCategories = async () => {
    const response = await getCategoriesService();
    setCategories(response.data);
  };

  const fetchProducts = async () => {
    const response = await getAllProductsService();
    if (response.data) {
      setProducts(response.data.responseList);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const normalizeString = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const filteredProducts =
    Array.isArray(products)
      ? products.filter(
        (product) =>
          normalizeString(String(product.name)).includes(normalizeString(searchTerm)) &&
          (selectedCategory ? product.category === selectedCategory : true)
      )
      : [];

  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + limit
  );
  const handleUpdateShipment = async (productId: number, selectedShipment: string) => {
    console.log(selectedShipment);
    const existingItemIndex = orderItems.findIndex(
      (item) => item.product.id === productId && item.selectedShipment === selectedShipment
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


    }

    else {
      console.log("new item");


      setOrderItems((orderItems) =>
        orderItems.map((itm) => {
          if (Number(itm.product.id) === Number(productId) && itm.selectedShipment === "") {
            console.log("duplicate");

            return { ...itm, selectedShipment }
          }
          return itm
        })
      )
    }
    console.log("Updated order items:", orderItems);
  };

  const updateCustomerPayment = (customerPayment: number) => {
    const totalPayment = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCustomerPayment(customerPayment);
    setCustomerChange(customerPayment - totalPayment);
  };

  return (
    <Box
      display="flex"
      p={3}
      sx={{
        backgroundColor: "#f5f5f5",
        height: "100vh",
      }}
    >
      <Box flexBasis="30%" mr={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as string)}
            label="Danh mục"
            sx={{ textAlign: "left" }}
          >
            <MenuItem value="">Tất cả danh mục</MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <List
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",
            bgcolor: "white",
            borderRadius: 2,
          }}
        >
          {paginatedProducts.map((product) => (
            <ListItem key={Number(product.id)} divider>
              <ListItemText
                primary={`${product.name} - ${formatCurrency(Number(product.price))}`}
                primaryTypographyProps={{
                  style: { whiteSpace: 'normal', overflowWrap: 'break-word' },
                  variant: 'body2',
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "left", fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
                  <TableCell sx={{ textAlign: "left", fontWeight: 'bold' }}>Số lượng</TableCell>
                  <TableCell sx={{ textAlign: "left", fontWeight: 'bold' }}>Mã lô hàng</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: 'bold' }}>Giá</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={`${item.product.id}-${item.selectedShipment}`}>
                    <TableCell sx={{ textAlign: "left" }}>{item.product.name}</TableCell>
                    <TableCell sx={{ textAlign: "left" }}>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(Number(item.product.id), parseInt(e.target.value))
                        }
                        sx={{ width: "50%" }}
                      />
                    </TableCell>
                    <TableCell sx={{ flex: 1 }}>
                      <Select
                        value={item.selectedShipment || ""}
                        onChange={(e) => handleUpdateShipment(Number(item.product.id), e.target.value).then(() => {
                          console.log(orderItems);
                          console.log(item.selectedShipment);
                        })}
                        sx={{ width: "100%", textAlign: 'left' }}
                      >
                        <MenuItem value="">Chọn mã lô hàng</MenuItem>
                        {item.product.shipmentIds?.map((shipment) => (
                          <MenuItem key={shipment} value={shipment}>
                            {shipment}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", width: "30%" }}>
                      {formatCurrency(Number(item.price))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" flexDirection="column" mt={2} alignItems='flex-end' width='100%'>
            <Typography sx={{ mb: 2, fontWeight: 'bold' }}>
              Tổng tiền hàng: {formatCurrency(orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Tiền khách hàng đưa"
              value={customerPayment} 
              onChange={(e) => {
                updateCustomerPayment(Number(e.target.value));
              }}
              sx={{ mb: 2, width: '30%' }}
            />
            <Typography sx={{ mb: 2 }}>
              Tiền thừa: {formatCurrency(customerChange)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateBill}
              sx={{ width: '100%' }}
            >
              Tạo đơn hàng
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default OrderPage;
