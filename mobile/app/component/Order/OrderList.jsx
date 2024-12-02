import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAllOrdersService } from '@/app/services/order.service';

const OrderList = ({ navigation }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrdersService();
                if(!response){
                    return;
                }
                
                setOrders(response);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);
    const translateStatus = (status) => {
        const statusMapping = {
            PENDING: "Đang chờ nhận hàng",   
            CANCELLED: "Đã hủy",    
            COMPLETED: "Hoàn thành", 
        };
        
        return statusMapping[status] || "Không xác định"; 
    };

    const translatePaymentType = (paymentType) => {
        const paymentMapping = {
          CASH: "Tiền mặt",  
          E_WALLET: "Chuyển khoản", 
        
        };

        return paymentMapping[paymentType] || "Không xác định"; 
      };

    const formatDate = (dateString) => {
        const date = new Date(dateString);  
    
        const day = String(date.getDate()).padStart(2, "0"); 
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const year = date.getFullYear(); 
    
        return `${day}/${month}/${year}`; 
    };
    
    const renderItem = ({ item }) => (
        <Pressable style={styles.orderItem} onPress={() => navigation.navigate('component/Order/DetailOrder', { orderId: item.orderId })}>
        {/* <Pressable style={styles.orderItem}> */}

            <Text style={styles.orderId}>Đơn hàng ID: {item.orderIdid}</Text>
            <Text style={styles.customerName}>Khách hàng: {item.customerPhone}</Text>
            <Text style={styles.total}>Tổng tiền: {item.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
            <Text style={styles.paymentMethod}>Phương thức thanh toán: {translatePaymentType(item.paymentType)}</Text>
            <Text style={styles.pickupDate}>Ngày đặt hàng: {formatDate(item.createdAt)}</Text>
            <View style={styles.statusContainer}>
            <Text style={styles.status}>
                Trạng thái: {translateStatus(item.orderStatus)}
            </Text>
            </View> 
        </Pressable>
    );

    return (
        <View style={styles.container}>
            {orders.length > 0 ? (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.orderId.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <Text style={styles.noOrderText}>Chưa có đơn hàng nào</Text>
            )}
           
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    listContainer: {
        paddingBottom: 20,
    },
    orderItem: {
        marginBottom: 16,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    orderId: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    customerName: {
        fontSize: 14,
    },
    phone: {
        fontSize: 14,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 4,
    },
    tableHeaderText: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    itemName: {
        flex: 1,
    },
    itemPrice: {
        flex: 1,
        textAlign: 'center',
    },
    itemQuantity: {
        flex: 1,
        textAlign: 'center',
    },
    total: {
        fontWeight: 'bold',
        marginTop: 8,
    },
    paymentMethod: {
        marginTop: 4,
    },
    pickupDate: {
        marginTop: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    status: {
        marginRight: 10,
        fontWeight: 'bold',
    },
    completeIcon: {
        marginLeft: 5,
    },
    noOrderText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default OrderList;
