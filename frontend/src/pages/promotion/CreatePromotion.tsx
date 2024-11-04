import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    SelectChangeEvent,
    Snackbar,
    Alert,
    SnackbarCloseReason,
    Autocomplete,
} from '@mui/material';
import { createOrderPromotion } from '../../services/promotion.service';
import { getAllProductsService } from '../../services/product.service';
import { GetProductSchema } from '../../types/getProductSchema';

const promotionTypes = [
    { id: 1, label: 'Khuyến mãi theo giá trị đơn hàng' },
    { id: 2, label: 'Khuyến mãi theo số lượng sản phẩm' },
    { id: 3, label: 'Khuyến mãi tặng kèm sản phẩm' },
];

const CreatePromotion: React.FC = () => {
    const [promotionTypeId, setPromotionTypeId] = useState<number | ''>('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minOrderValue, setMinOrderValue] = useState<string>('');
    const [discountPercent, setDiscountPercent] = useState<number | ''>(0);
    const [buyQuantity, setBuyQuantity] = useState<number | ''>(0);
    const [freeQuantity, setFreeQuantity] = useState<number | ''>(0);
    const [giftQuantity, setGiftQuantity] = useState<number | ''>(1); 
    const [productId, setProductId] = useState<number | ''>(0);
    const [giftProductId, setGiftProductId] = useState<number | ''>(0); 
    const [products, setProducts] = useState<GetProductSchema[]>([]);
    const [searchTerm] = useState('');
    const [quantityOfOrder, setQuantityOfOrder] = useState<string>(); 


    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(amount);
      };
    
    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handlePromotionTypeChange = (event: SelectChangeEvent<number>) => {
        setPromotionTypeId(Number(event.target.value));
    };

    const reformatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleMinOrderValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMinOrderValue(value);
    };

    const handleDiscountPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value === '' ? '' : Number(value);
        if (numericValue === '' || (numericValue >= 0 && numericValue <= 1)) {
            setDiscountPercent(numericValue);
        }
    };

    const handleQuantityOfOrder = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setQuantityOfOrder(e.target.value);

    }

    const handleSubmit = async () => {
        const nameRegex = /^(?!\s).{1,250}$/; 
        const descriptionRegex = /^(?!\s).{1,250}$/; 

        if (!nameRegex.test(name)) {
            setSnackbarMessage("Tên khuyến mãi không được để trống và tối đa 250 ký tự!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (!descriptionRegex.test(description)) {
            setSnackbarMessage("Mô tả khuyến mãi không được để trống và tối đa 250 ký tự!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (!startDate || !endDate) {
            setSnackbarMessage("Thông tin ngày bắt đầu và ngày kết thúc không hợp lệ!!!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const reformattedStartDate = reformatDate(startDate);
        const reformattedEndDate = reformatDate(endDate);

        if (new Date(reformattedEndDate) <= new Date(reformattedStartDate)) {
            setSnackbarMessage("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        let promotionData;

        if (promotionTypeId === 1) {
            const minOrderValueNum = Number(minOrderValue);
            if (minOrderValueNum <= 1000) {
                setSnackbarMessage("Giá trị đơn hàng tối thiểu phải lớn hơn 1000!");
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            if (Number(discountPercent) < 0.1 || Number(discountPercent) > 1.0) {
                setSnackbarMessage("Phần trăm giảm giá phải trong khoảng 0.1 đến 1.0!");
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            promotionData = {
                promotionRequest: {
                    name,
                    description,
                    startDate: reformattedStartDate,
                    endDate: reformattedEndDate,
                    promotionTypeId,
                },
                minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
                discountPercent,
            };
        } else if (promotionTypeId === 2) {
            promotionData = {
                promotionRequest: {
                    name,
                    description,
                    startDate: reformattedStartDate,
                    endDate: reformattedEndDate,
                    promotionTypeId,
                },
                buyQuantity,
                freeQuantity,
                productId,
            };
        } else if (promotionTypeId === 3) {
            promotionData = {
                promotionRequest: {
                    name,
                    description,
                    startDate: reformattedStartDate,
                    endDate: reformattedEndDate,
                    promotionTypeId,
                },
                buyQuantity: 4, // Fixed quantity for promotion type 3
                freeQuantity: giftQuantity, // Use gift quantity from user input
                giftProductId,
                productId: 2, // Fixed product ID for promotion
            };
        }

        const response = await createOrderPromotion(promotionData);
        console.log(response);
        console.log('Promotion Data:', promotionData);

        if (response.message === 'success') {
            setSnackbarMessage("Tạo khuyến mãi thành công");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setName('');
            setDescription('');
            setEndDate('');
            setStartDate('');
            setMinOrderValue('');
            setDiscountPercent('');
            setGiftQuantity(1); // Reset gift quantity
            setGiftProductId(0); // Reset gift product ID
        } else {
            setSnackbarMessage(response.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const fetchProducts = async () => {
        const response = await getAllProductsService();
        if (response.data) {
            setProducts(response.data.responseList);
        }
    };

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
                    normalizeString(String(product.name)).includes(normalizeString(searchTerm))
            )
            : [];

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <Box
            p={3}
            width="70%"
            sx={{
                backgroundColor: 'white',
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h5" gutterBottom>
                Tạo Chương Trình Khuyến Mãi
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Chọn loại khuyến mãi</InputLabel>
                <Select
                    value={promotionTypeId}
                    onChange={handlePromotionTypeChange}
                    sx={{ textAlign: 'left' }}
                >
                    <MenuItem value="">
                        <em>Chọn loại khuyến mãi</em>
                    </MenuItem>
                    {promotionTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                            {type.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                fullWidth
                label="Tên khuyến mãi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                label="Mô tả khuyến mãi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Box display='flex' flexDirection='row' gap='15px'>
                <TextField
                    fullWidth
                    type="date"
                    label="Ngày bắt đầu"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    fullWidth
                    type="date"
                    label="Ngày kết thúc"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                />
            </Box>

             <TextField
                        fullWidth
                        type="number"
                        label="Số lượng đơn hàng được áp dụng khuyến mãi"
                        value={quantityOfOrder}
                        onChange={handleQuantityOfOrder}
                        sx={{ mb: 2 }}
                    />

            {promotionTypeId === 1 && (
                <>
                    <TextField
                        fullWidth
                        type="number"
                        label="Giá trị đơn hàng tối thiểu"
                        value={formatCurrency(Number(minOrderValue))}
                        onChange={handleMinOrderValueChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Phần trăm giảm giá"
                        value={discountPercent}
                        onChange={handleDiscountPercentChange}
                        sx={{ mb: 2 }}
                    />
                </>
            )}

            {promotionTypeId === 2 && (
                <>
                    <TextField
                        fullWidth
                        type="number"
                        label="Số lượng sản phẩm cần mua để áp dụng khuyến mãi"
                        value={buyQuantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            setBuyQuantity(value === '' ? '' : Number(value));
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Số lượng sản phẩm được tặng"
                        value={freeQuantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFreeQuantity(value === '' ? '' : Number(value));
                        }}
                        sx={{ mb: 2 }}
                    />

                    <Autocomplete
                        options={filteredProducts}
                        getOptionLabel={(option) => String(option.name)}
                        onChange={(_event, newValue) => {
                            setProductId(Number(newValue ? newValue.id : ''));
                        }}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <img src={String(option.image)} style={{ width: 50, height: 50, marginRight: 10 }} />
                                {option.name}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="Chọn sản phẩm" variant="outlined" fullWidth />
                        )}
                        sx={{ mb: 2 }}
                    />
                </>
            )}

            {promotionTypeId === 3 && (
                <>
                    <Autocomplete
                        options={filteredProducts}
                        getOptionLabel={(option) => String(option.name)}
                        onChange={(_event, newValue) => {
                            setProductId(Number(newValue ? newValue.id : ''));
                        }}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <img src={String(option.image)} style={{ width: 50, height: 50, marginRight: 10 }} />
                                {option.name}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="Chọn sản phẩm" variant="outlined" fullWidth />
                        )}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Số lượng mua cần đạt để nhận quà tặng"
                        value={freeQuantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFreeQuantity(value === '' ? '' : Number(value));
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="body1" sx={{ mb: 2, fontWeight:'bold' }}>
                        Chọn sản phẩm và số lượng quà tặng muốn cung cấp.
                    </Typography>
                    <Autocomplete
                        options={filteredProducts}
                        getOptionLabel={(option) => String(option.name)}
                        onChange={(_event, newValue) => {
                            setGiftProductId(Number(newValue ? newValue.id : ''));
                        }}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <img src={String(option.image)} style={{ width: 50, height: 50, marginRight: 10 }} />
                                {option.name}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="Chọn sản phẩm quà tặng" variant="outlined" fullWidth />
                        )}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Số lượng quà tặng"
                        value={giftQuantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            setGiftQuantity(value === '' ? '' : Number(value));
                        }}
                        sx={{ mb: 2 }}
                    />
                </>
            )}

            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Tạo khuyến mãi
            </Button>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreatePromotion;
