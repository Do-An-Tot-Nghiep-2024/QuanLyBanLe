import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import orders from '@/app/component/data/orders'; // Adjust the path based on your file structure

const OrderList = ({ navigation }) => {
    const sortedOrders = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    const renderItem = ({ item }) => (
        <Pressable style={styles.orderItem} onPress={() => navigation.navigate('component/Order/DetailOrder', { orderId: item.id })}>
            <Text style={styles.orderId}>Đơn hàng ID: {item.id}</Text>
            <Text style={styles.customerName}>Khách hàng: {item.customerName}</Text>
            <Text style={styles.phone}>Số điện thoại: {item.phone}</Text>
            <Text style={styles.total}>Tổng tiền: {item.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
            <Text style={styles.paymentMethod}>Phương thức thanh toán: {item.paymentMethod}</Text>
            <Text style={styles.pickupDate}>Ngày nhận hàng: {item.pickupDate}</Text>
            <View style={styles.statusContainer}>
                <Text style={styles.status}>Trạng thái: {item.status}</Text>
                {item.status === "Hoàn tất" && (
                    <MaterialCommunityIcons name="check-circle" size={20} color="green" style={styles.completeIcon} />
                )}
            </View>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedOrders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
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
});

export default OrderList;
