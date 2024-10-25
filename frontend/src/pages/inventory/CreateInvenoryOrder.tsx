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
} from "@mui/material";
import { getProductsBySupplierService } from "../../services/product.service";
import { createInventoryOrderService } from "../../services/inventory.service";
import { getSuppliersService } from "../../services/supplier.service";

interface OrderItem {
    product: GetProductBySupplier;
    quantity: number;
    mxp?: Date;
    exp?: Date;
    price: number;
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
}

const CreateInventoryOrder: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [products, setProducts] = useState<GetProductBySupplier[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<number | "">(1);

    const handleAddToOrder = (product: GetProductBySupplier) => {
        setOrderItems((prev) => {
            const existingItem = prev.find((item) => item.product.id === product.id);
            return existingItem
                ? prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
                : [...prev, { product, quantity: 1, price: 0 }];
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
        console.log(date);

        setOrderItems((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, mxp: new Date(date) } : item
            )
        );
    };

    const handleUpdateExpirationDate = (productId: number, date: string) => {
        setOrderItems((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, exp: new Date(date) } : item
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

    const formatDate = (date: Date): string => {
        if (!date) return "";
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    const handleCreateBill = async () => {
        if (orderItems.length === 0) {
            alert("Please add at least one item to the order.");
            return;
        }

        const formattedOrderItems = orderItems.map(item => ({
            id: item.product.id,
            quantity: item.quantity,
            price: item.price,
            mxp: item.mxp ? formatDate(item.mxp) : null,
            exp: item.exp ? formatDate(item.exp) : null,
        }));

        console.log(formattedOrderItems);

        try {
            const response = await createInventoryOrderService(formattedOrderItems, Number(selectedSupplier));
            console.log("Order created:", response);
            setOrderItems([]);
        } catch (error) {
            console.error("Error creating order:", error);
            alert("An error occurred while creating the order.");
        }
    };


    const fetchProducts = async () => {
        const response = await getProductsBySupplierService(Number(selectedSupplier));
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

    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
    }, [selectedSupplier]);

    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{ backgroundColor: "#f5f5f5", height: "100vh", width: "100%", padding: 2 }}
        >
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginBottom: 2 }}>
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Nhà cung cấp</InputLabel>
                    <Select
                        value={selectedSupplier}
                        onChange={(e) => handleSelectSupplier(Number(e.target.value))}
                        label="Nhà cung cấp"
                        sx={{ textAlign: 'left' }}
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

                <List sx={{ maxHeight: "300px", overflowY: "auto", bgcolor: "white", borderRadius: 2 }}>
                    {filteredProducts.map((product) => (
                        <ListItem key={product.id} divider>
                            <ListItemText primary={product.productName} />
                            <Button variant="contained" onClick={() => handleAddToOrder(product)}>
                                Thêm
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Chi tiết hóa đơn nhập hàng
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: "left", fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
                                <TableCell sx={{ textAlign: "center", fontWeight: 'bold' }}>Số lượng</TableCell>
                                <TableCell sx={{ textAlign: "center", fontWeight: 'bold' }}>Ngày sản xuất</TableCell>
                                <TableCell sx={{ textAlign: "center", fontWeight: 'bold' }}>Ngày hết hạn</TableCell>
                                <TableCell sx={{ textAlign: "center", fontWeight: 'bold' }}>Giá nhập</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderItems.map((item) => (
                                <TableRow key={item.product.id}>
                                    <TableCell sx={{ textAlign: "left" }}>{item.product.productName}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        <TextField
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleUpdateQuantity(item.product.id, parseInt(e.target.value))
                                            }
                                            inputProps={{ min: 1 }}
                                            sx={{ width: "100%" }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        <TextField
                                            type="date"
                                            value={item.mxp ? item.mxp.toISOString().split('T')[0] : ""}
                                            onChange={(e) => handleUpdateProductionDate(item.product.id, e.target.value)}
                                            sx={{ width: '90%' }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        <TextField
                                            type="date"
                                            value={item.exp ? item.exp.toISOString().split('T')[0] : ""}
                                            onChange={(e) => handleUpdateExpirationDate(item.product.id, e.target.value)}
                                            sx={{ width: '90%' }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        <TextField
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => handleUpdatePrice(item.product.id, parseFloat(e.target.value))}
                                            placeholder="VNĐ"
                                            sx={{ width: "100%" }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box display="flex" flexDirection="column" justifyContent="space-between" mt={3}>
                    <Box display="flex" flexDirection="row" justifyContent="space-between" mt={3}>
                        <Typography variant="h6" fontWeight="bold">Tổng tiền hàng</Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {formatCurrency(orderItems.reduce((total, item) => total + (item.price * item.quantity), 0))}
                        </Typography>
                    </Box>

                    <Typography textAlign="left" fontStyle={"italic"}> (Giá trên đã bao gồm VAT)</Typography>

                    <Box display="flex" flexDirection="row" justifyContent="space-between" mt={3}>
                        <Typography variant="h6" fontWeight="bold"> Thành tiền</Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {formatCurrency(orderItems.reduce((total, item) => total + (item.price * item.quantity), 0))}
                        </Typography>
                    </Box>
                </Box>

                <Button variant="contained" onClick={handleCreateBill} sx={{ mt: 2 }}>Tạo hóa đơn</Button>
            </Paper>
        </Box>
    );
};

export default CreateInventoryOrder;
