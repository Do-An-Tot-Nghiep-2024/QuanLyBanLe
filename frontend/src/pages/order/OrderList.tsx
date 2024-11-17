import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Stack,
    Box,
    TextField,
    TablePagination,
    Button
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getAllOrdersService } from '../../services/order.service';
import ResponsePagination from '../../types/responsePagination';
import colors from '../../constants/color';
import { OrderSchema } from '../../types/orderSchema';

const OrderList: React.FC = () => {
    const [sortField, setSortField] = useState<keyof OrderSchema | null>('orderId');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [orders, setOrders] = useState<OrderSchema[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [selectedStatuses] = useState<string[]>([]);
    const [selectedPayments] = useState<string[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderSchema[]>([]);

    const columns: Array<{ label: string; field?: keyof OrderSchema; width?: string; maxWidth?: string }> = [
        { label: 'Mã Đơn Hàng', field: 'orderId', width: '10%', maxWidth: '150px' },
        { label: 'Nhân Viên', field: 'employee', width: '30%', maxWidth: '150px' },
        { label: 'Trạng Thái', field: 'orderStatus', width: '15%', maxWidth: '200px' },
        { label: 'Ngày Tạo', field: 'createdAt', width: '15%', maxWidth: '200px' },
        { label: 'Phương Thức Thanh Toán', field: 'paymentType', width: '15%', maxWidth: '150px' },
        { label: 'Tổng Cộng', field: 'total', width: '30%', maxWidth: '100px' },
    ];

    const fetchOrders = async (page: number, limit: number, sortField: string, sortOrder: string) => {
        const response = await getAllOrdersService(page, limit, sortField, sortOrder);
        return response as ResponsePagination<OrderSchema>;
    };

    const { data, isLoading } = useQuery({
        queryKey: ['orders', page, rowsPerPage, sortField, sortOrder],
        queryFn: () => fetchOrders(page, rowsPerPage, sortField ?? 'orderId', sortOrder ?? 'asc'),  
    });

    useEffect(() => {
        if (data) {
            setOrders(data.responseList);
        }
    }, [data]);

    useEffect(() => {
        const newFilteredOrders = orders.filter(order => {
            const createdAt = new Date(order.createdAt);
            const statusMatch = selectedStatuses.length > 0 ? selectedStatuses.includes(order.orderStatus) : true;
            const paymentMatch = selectedPayments.length > 0 ? selectedPayments.includes(order.paymentType) : true;

            if(filterModalOpen){

            }
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                return createdAt >= start && createdAt <= end && statusMatch && paymentMatch;
            }

            return statusMatch && paymentMatch;
        });

        setFilteredOrders(newFilteredOrders);
    }, [orders, startDate, endDate, selectedStatuses, selectedPayments]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterOpen = () => {
        setFilterModalOpen(true);
    };

    // const handleFilterClose = () => {
    //     setFilterModalOpen(false);
    // };

    // const handleStatusChange = (status: string) => {
    //     setSelectedStatuses(prev =>
    //         prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    //     );
    // };

    // const handlePaymentChange = (payment: string) => {
    //     setSelectedPayments(prev =>
    //         prev.includes(payment) ? prev.filter(p => p !== payment) : [...prev, payment]
    //     );
    // };

    return (
        <Box width={'90%'}>
            <Typography variant="h5" component="h2" style={{ margin: '16px' }}>
                Danh sách đơn hàng
            </Typography>
            <Stack direction="row" justifyContent="flex-end" spacing={3} sx={{ marginBottom: '16px' }}>
                <TextField
                    type="date"
                    label="Ngày bắt đầu"
                    variant="outlined"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: 150 }}
                />
                <TextField
                    type="date"
                    label="Ngày kết thúc"
                    variant="outlined"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: 150 }}
                />
            </Stack>

            <Box sx={{ gap: 1, display: 'flex', flexDirection: 'row', mb: 2, justifyContent: 'flex-end' }}>
                <Button sx={{ textDecoration: 'underline' }} onClick={handleFilterOpen}>
                    Bộ Lọc
                </Button>
                <Box sx={{ borderRadius: 10, padding: 1, marginRight: 2, backgroundColor: colors.primaryColor }}>
                    <Typography color="white" variant="body2">
                        Trạng Thái: {selectedStatuses.length > 0 ? selectedStatuses.join(', ') : 'Tất cả'}
                    </Typography>
                </Box>
                <Box sx={{ borderRadius: 10, padding: 1, backgroundColor: colors.primaryColor }}>
                    <Typography variant="body2" color="white">
                        Phương Thức Thanh Toán: {selectedPayments.length > 0 ? selectedPayments.join(', ') : 'Tất cả'}
                    </Typography>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ width: '100%', margin: 'auto', backgroundColor: 'white', maxHeight: '700px', overflowY: 'auto' }}>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Table>
                            <TableHead sx={{ backgroundColor: colors.secondaryColor }}>
                                <TableRow>
                                    {columns.map((column, index) => (
                                        <TableCell
                                            key={index}
                                            align="center"
                                            sx={{ padding: '16px', fontWeight: 'bold', cursor: 'pointer', width: column.width, maxWidth: column.maxWidth }}
                                            onClick={() => {
                                                if (column.field) {
                                                    setSortField(column.field);
                                                    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
                                                }
                                            }}
                                        >
                                            {column.label}
                                            {sortField === column.field && (
                                                <span style={{ marginLeft: '5px' }}>
                                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.orderId} hover>
                                        {columns.map((column, index) => (
                                            <TableCell key={index} align="center">
                                                {column.field ? (
                                                    column.field === 'total' ? (
                                                        `${order.total.toLocaleString()} VND`
                                                    ) : column.field === 'createdAt' ? (
                                                        new Date(order.createdAt).toLocaleDateString('vi-VN')
                                                    ) : (
                                                        order[column.field]
                                                    )
                                                ) : (
                                                    ''
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredOrders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
};

export default OrderList;
