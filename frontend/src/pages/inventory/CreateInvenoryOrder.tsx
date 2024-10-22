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
import { createInventoryOrderService } from "../../services/inventory.service";

interface Product {
    id: number;
    price: number;
    name: string;
    category: string;
}

interface OrderItem {
    product: Product;
    quantity: number;
    productionDate?: string;
    expirationDate?: string;
}

interface Category {
    name: string;
}

interface GetProductSchema {
    id: number;
    name: string;
    image: string;
    category: string;
    supplier: string;
    price: number;
  }
const CreateInventoryOrder: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<GetProductSchema[]>([]);

    const handleAddToOrder = (product: Product) => {
        setOrderItems((prev) => {
            const existingItem = prev.find((item) => item.product.id === product.id);
            return existingItem
                ? prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
                : [...prev, { product, quantity: 1 }];
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

    const handleUpdatePrice = (productId: number, price: number) => {
        setOrderItems((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, product: { ...item.product, price } } : item
            )
        );
    };
    

    const removeItem = () => {
        orderItems.map((item) => {
            if (item.quantity === 0) {
                const index = orderItems.indexOf(item);
                setOrderItems((prev) => prev.filter((_, i) => i !== index));
            }
        });
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

    const handleCreateBill = async () => {
        if (orderItems.length === 0) {
            alert("Please add at least one item to the order.");
            return;
        }

        const formattedOrderItems = orderItems.map(item => ({
            id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            productionDate: item.productionDate ? formatDateToDDMMYYYY(item.productionDate) : undefined,
            expirationDate: item.expirationDate ? formatDateToDDMMYYYY(item.expirationDate) : undefined,
        }));

        try {
            
            const response = await createInventoryOrderService(formattedOrderItems);
            console.log("Hóa đơn đã được tạo:", response.data);
            setOrderItems([]); 
            alert("Order created successfully!");
        } catch (error) {
            console.error("Error creating inventory order:", error);
            alert("An error occurred while creating the order.");
        }
    };

    const fetchCategories = async () => {
        const response = await getCategoriesService();
        setCategories(response.data);
    };

    const fetchProducts = async () => {
        const response = await getAllProductsService();
        console.log(response);
        
        setProducts(response.data.responseList);
    };
    const formatDateToDDMMYYYY = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory ? product.category === selectedCategory : true)
    );

    return (
        <Box
            display="flex"
            sx={{ backgroundColor: "#f5f5f5", height: "100vh", width: "100%" }}
        >
            <Box mr={2} sx={{ width: "30%" }}>
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
                    >
                        <MenuItem value="">Tất cả danh mục</MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category.name} value={category.name}>
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
                    {filteredProducts.map((product) => (
                        <ListItem key={product.id} divider>
                            <ListItemText
                                primary={`${product.name} - ${product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`}
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
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: "#fff" }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                        Chi tiết hóa đơn nhập hàng
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{gap:1, width:'100%'}}>
                                    <TableCell sx={{ textAlign: "left", fontWeight: 'bold', width: '20%' }}>Tên sản phẩm</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontWeight: 'bold' }}>Số lượng</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontWeight: 'bold' }}>Ngày sản xuất</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontWeight: 'bold' }}>Ngày hết hạn</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontWeight: 'bold' }}>Giá nhập</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{gap: 1, justifyContent:'left'}}>
                                {orderItems.map((item) => (
                                    <TableRow key={item.product.id}>
                                        <TableCell sx={{ textAlign: "left" }}>{item.product.name}</TableCell>
                                        <TableCell sx={{ textAlign: "left", width:'20%' }}>
                                            <TextField
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleUpdateQuantity(
                                                        item.product.id,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                inputProps={{ min: 1 }}
                                                sx={{ width: "100%", flex: 1, textAlign: "right" }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "left", width:'10%' }}>
                                            <TextField
                                                type="date"
                                                value={item.productionDate || ""}
                                                onChange={(e) => handleUpdateProductionDate(item.product.id, e.target.value)}
                                                sx={{width:'90%'}}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "left" }}>
                                            <TextField
                                                type="date"
                                                value={item.expirationDate || ""}
                                                onChange={(e) => handleUpdateExpirationDate(item.product.id, e.target.value)}
                                                sx={{width:'90%'}}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "center", width: "100%" }}>
                                            <TextField
                                                type="number"
                                                value={item.product.price}
                                                onChange={(e) => {
                                                    const newPrice = parseFloat(e.target.value);
                                                    if (!isNaN(newPrice) && newPrice >= 0) {
                                                        handleUpdatePrice(item.product.id, newPrice);
                                                    }
                                                }}
                                                placeholder="VNĐ"
                            
                                            />
                                           
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Typography variant="h6" fontWeight="bold">Tổng cộng</Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {orderItems.reduce(
                                (sum, item) => sum + item.product.price * item.quantity,
                                0
                            ).toFixed(2)}₫
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={handleCreateBill}
                        sx={{ mt: 2, width: "100%", height: "50px", fontSize: "16px" }}
                    >
                        Tạo hóa đơn
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

export default CreateInventoryOrder;
