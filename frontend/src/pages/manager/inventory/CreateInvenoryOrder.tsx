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
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { getProductsBySupplierService } from "../../../services/product.service";
import { createInventoryOrderService } from "../../../services/inventory.service";
import { getSuppliersService } from "../../../services/supplier.service";
import AddBoxIcon from "@mui/icons-material/AddBox";
import dayjs, { Dayjs } from "dayjs";
import DateInput from "../../../components/DateInput";

interface OrderItem {
  product: GetProductBySupplier;
  quantity: number;
  mxp?: Date;
  exp?: Date;
  price: number;
  unit: string;
}

interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface GetProductBySupplier {
  id: number;
  productName: string;
  unit: string;
  price: number;
}

const CreateInventoryOrder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<GetProductBySupplier[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<number | "">(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [fail, setFail] = useState(true);

  const handleAddToOrder = (product: GetProductBySupplier) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      return existingItem
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...prev,
            { product, quantity: 1, price: product.price, unit: product.unit },
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

  // const handleUpdateProductionDate = (productId: number, date: string) => {
  //   setOrderItems((prev) =>
  //     prev.map((item) =>
  //       item.product.id === productId ? { ...item, mxp: new Date(date) } : item
  //     )
  //   );
  // };

  const handleUpdateMXPProduct = (productId: number, date: Dayjs | null) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, mxp: new Date(date?.format("YYYY-MM-DD") ?? "") }
          : item
      )
    );
  };

  const handleUpdateExpProduct = (productId: number, date: Dayjs | null) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, exp: new Date(date?.format("YYYY-MM-DD") ?? "") }
          : item
      )
    );
  };

  // const handleUpdateExpirationDate = (productId: number, date: string) => {
  //   setOrderItems((prev) =>
  //     prev.map((item) =>
  //       item.product.id === productId ? { ...item, exp: new Date(date) } : item
  //     )
  //   );
  // };

  const handleUpdatePrice = (productId: number, price: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, price } : item
      )
    );
  };

  const formatDate = (date: Date): string => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateTotalPrice = () => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCreateBill = async () => {
    if (orderItems.length === 0) {
      setFail(true);
      setAlertMessage("Chưa thêm sản phẩm vào phiếu nhập hàng");
      setSnackbarOpen(true);
      return;
    }

    const formattedOrderItems = orderItems
      .map((item) => {
        const quantityStr = String(item.quantity);
        const quantityRegex = /^(?:[1-9][0-9]?|100)$/;
        const price = Number(item.price);
        console.log(price);

        if (isNaN(price)) {
          setFail(true);
          setAlertMessage("Vui lòng nhập giá nhập!");
          setSnackbarOpen(true);
          return;
        }
        // Validate quantity
        if (!quantityRegex.test(quantityStr)) {
          setAlertMessage("Số lượng phải từ 1 đến 100");
          setFail(true);
          setSnackbarOpen(true);
          return;
        }

        // Validate price range
        if (price < 200 || price > 10000000) {
          // alert("Giá phải từ 200 đến 10.000.000");
          setAlertMessage("Giá phải từ 200 đến 10.000.000");
          setFail(true);
          setSnackbarOpen(true);
          return;
        }

        // Check dates
        if (!item.mxp || !item.exp) {
          alert("Điền đầy đủ thông tin ngày sản xuất/ngày hết hạn");
          return;
        }

        const mxpDate = new Date(item.mxp);
        const expDate = new Date(item.exp);

        if (expDate <= mxpDate) {
          setAlertMessage("Ngày hết hạn phải sau ngày sản xuất");
          setFail(true);
          setSnackbarOpen(true);
          return;
        }

        if (expDate < new Date() || mxpDate > new Date()) {
          alert("Ngày hết hạn/ngày sản xuất không hợp lệ");
          return;
        }

        return {
          id: item.product.id,
          quantity: item.quantity,
          price,
          mxp: formatDate(item.mxp),
          exp: formatDate(item.exp),
        };
      })
      .filter((item) => item !== null);
    console.log(formattedOrderItems);
    
    if (formattedOrderItems.length === 0 || formattedOrderItems[0] === undefined) {
      return;
    }

    try {
      const response = await createInventoryOrderService(
        formattedOrderItems,
        Number(selectedSupplier)
      );
      if (response.message === "success") {
        setOrderItems([]);
        setAlertMessage("Tạo phiếu nhập hàng thành công!");
        setFail(false);
        setSnackbarOpen(true);
      } else {
        setFail(true);
        setAlertMessage("Đã xảy ra lỗi khi tạo phiếu nhập hàng.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setFail(true);
      setAlertMessage("Đã xảy ra lỗi khi tạo phiếu nhập hàng.");
      setSnackbarOpen(true);
    }
  };

  const fetchProducts = async () => {
    const response = await getProductsBySupplierService(
      Number(selectedSupplier)
    );
    if (response.data) {
      setProducts(response.data as GetProductBySupplier[]);
    }
  };

  const fetchSuppliers = async () => {
    const response = await getSuppliersService();
    setSuppliers(response.data.responseList);
  };

  const handleSelectSupplier = (id: number) => {
    setSelectedSupplier(id);
    setOrderItems([]);
    setSearchTerm("");
  };

  const normalizeString = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        normalizeString(String(product.productName)).includes(
          normalizeString(searchTerm)
        )
      )
    : [];

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, [selectedSupplier]);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        backgroundColor: "#f5f5f5",
        height: "100vh",
        width: "100%",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          marginBottom: 2,
          backgroundColor: "white",
        }}
      >
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Nhà cung cấp</InputLabel>
          <Select
            value={selectedSupplier}
            onChange={(e) => handleSelectSupplier(Number(e.target.value))}
            label="Nhà cung cấp"
            sx={{ textAlign: "left" }}
          >
            <MenuItem value="">Chọn nhà cung cấp</MenuItem>
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          variant="outlined"
          label="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          disabled={!selectedSupplier}
        />

        <List
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            bgcolor: "white",
            borderRadius: 2,
          }}
        >
          {filteredProducts.map((product) => (
            <ListItem key={product.id} divider>
              <ListItemText primary={product.productName} />
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
      </Paper>

      <Paper
        elevation={3}
        sx={{ padding: 3, borderRadius: 2, backgroundColor: "white" }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Chi tiết phiếu nhập hàng
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "left", fontWeight: "bold" }}>
                  Tên sản phẩm
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Số lượng
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Đơn vị
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Ngày sản xuất
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Ngày hết hạn
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Giá nhập
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Thành tiền
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderItems.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.product.productName}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.product.id,
                          parseInt(e.target.value)
                        )
                      }
                      inputProps={{ min: 1, max: 100 }}
                      sx={{ width: "100%" }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.unit}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <DateInput
                      date={dayjs(item.mxp)}
                      onChange={(date) =>
                        handleUpdateMXPProduct(item.product.id, date)
                      }
                      lable=""
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <DateInput
                      date={dayjs(item.exp)}
                      onChange={(date) =>
                        handleUpdateExpProduct(item.product.id, date)
                      }
                      lable=""
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <TextField
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleUpdatePrice(
                          item.product.id,
                          Number(e.target.value)
                        )
                      }
                      placeholder="VNĐ"
                      sx={{ width: "100%" }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {formatCurrency(
                      item.price && item.quantity
                        ? item.price * item.quantity
                        : 0
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Typography variant="h6" fontWeight="bold">
            Tổng tiền hàng
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {formatCurrency(calculateTotalPrice() ? calculateTotalPrice() : 0)}
          </Typography>
        </Box>

        <Button variant="contained" onClick={handleCreateBill} sx={{ mt: 2 }}>
          Tạo phiếu nhập hàng
        </Button>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={fail ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateInventoryOrder;
