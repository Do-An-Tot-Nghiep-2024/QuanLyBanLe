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
} from "@mui/material";
import { getCategoriesService } from "../../services/category.service";
import { getAllProductsService } from "../../services/product.service";
import { GetProductSchema } from "../../types/getProductSchema";
import { Text } from "recharts";

interface OrderItem {
  product: GetProductSchema;
  quantity: number;
  productionDate?: string;
  expirationDate?: string;
  price: number;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleAddToOrder = (product: GetProductSchema) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedOption: "", price: Number(product.price) }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleUpdateProductionDate = (productId: number, date: string) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, productionDate: date } : item
      )
    );
  };

  const handleUpdateExpirationDate = (productId: number, date: string) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, expirationDate: date } : item
      )
    );
  };

  const handleUpdatePrice = (productId: number, price: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, price } : item
      )
    );
  };

  const handleCreateBill = () => {
    // Bill creation logic
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

  const filteredProducts =
    Array.isArray(products)
      ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedCategory ? product.category === selectedCategory : true)
      )
      : [];

  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + limit
  );

  // const fetchShipment = ()

  return (
    <Box
      display="flex"
      p={3}
      sx={{
        backgroundColor: "#f5f5f5", height: "100vh"
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
                  variant: 'body2'
                }}
              />
              <Button
                variant="contained"
                onClick={() => handleAddToOrder(product)}
              >
                Thêm
              </Button>
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
                  <TableCell sx={{textAlign:"center", fontWeight: 'bold' }}>Mã lô hàng</TableCell>
                  <TableCell sx={{ textAlign: "center", fontWeight: 'bold' }}>Giá</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={Number(item.product.id)}>
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
                    <TableCell>
                      

                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Text
                        type="number"
                      >
                        {Number(item.product.price)}

                      </Text>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="h6" fontWeight="bold">
              Tổng cộng
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {formatCurrency(
                orderItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )
              )}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleCreateBill}
            sx={{ mt: 2 }}
          >
            Tạo hóa đơn
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default OrderPage;
