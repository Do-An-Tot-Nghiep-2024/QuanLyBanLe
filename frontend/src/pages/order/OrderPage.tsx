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
  Grid,
} from "@mui/material";
import { getCategoriesService } from "../../services/category.service";
import { getAllProductsService } from "../../services/product.service";
import { GetProductSchema } from "../../types/getProductSchema";



interface OrderItem {
  product: GetProductSchema;
  quantity: number;
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
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    removeItem();
  };

  const removeItem = () => {
    orderItems.map((item) => {
      if (item.quantity === 0) {
        const index = orderItems.indexOf(item);
        setOrderItems((prev) => prev.filter((_, i) => i !== index));
      }
    });
  };

  const handleCreateBill = () => {
    console.log("Hóa đơn đã được tạo:", orderItems);
  };

  const fetchCategories = async () => {
    const response = await getCategoriesService();
    setCategories(response.data);
  };

  const fetchProducts = async () => {
    const response = await getAllProductsService();
    if(response.data){
      setProducts(response!.data);

    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? product.category === selectedCategory : true)
  );

  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + limit
  );

  return (
    <Box
      display="flex"
      p={3}
      sx={{ backgroundColor: "#f5f5f5", height: "100vh" }}
    >
      <Box flex={1} mr={2}>
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
            <MenuItem value="">
              Tất cả danh mục
            </MenuItem>
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
                primary={`${product.name} - ${product.price.toFixed(2)}`}
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

          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ flex: 1, textAlign: "left" }}
              >
                Tên sản phẩm
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ width: "80px", flex: 1, textAlign: "center" }}
              >
                Số lượng
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ width: "80px", textAlign: "right" }}
              >
                Giá
              </Typography>
            </Box>
            {orderItems.map((item) => (
              <Grid
                container
                key={item.product.id as number}
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Grid item xs={6} sx={{ textAlign: "left" }}>
                  <Typography>{item.product.name}</Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: "left", flex: 1 }}>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateQuantity(
                        item.product.id as number,
                        parseInt(e.target.value)
                      )
                    }
                    inputProps={{ min: 1 }}
                    sx={{ width: "100%", flex: 1, textAlign: "right" }}
                  />
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "right" }}>
                  <Typography>
                    {(item.product.price as number * item.quantity).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            ))}
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography variant="h6" fontWeight="bold">
                Tổng cộng
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {orderItems
                  .reduce(
                    (sum, item) => sum + Number(item.product.price) * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleCreateBill}
              sx={{ mt: 2 }}
            >
              Tạo hóa đơn
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default OrderPage;
