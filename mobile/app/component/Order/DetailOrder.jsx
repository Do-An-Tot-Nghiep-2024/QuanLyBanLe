import { getOrderDetailService } from "@/app/services/order.service";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

// Helper function to calculate time difference in hours
const getTimeDifferenceInHours = (createdAt) => {
    const currentTime = new Date();
    const createdTime = new Date(createdAt);
    const timeDifference = currentTime - createdTime;
    return timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours
};

const OrderDetail = ({ route, navigation }) => {
    const orderId = route.params?.orderId;
    const [detailOrder, setDetailOrder] = useState({});

    useEffect(() => {   
        const fetchOrderItems = async () => {
            try {
                const response = await getOrderDetailService(orderId);
                if (!response) {
                    return;
                }
                console.log(response);
                
                setDetailOrder(response);
            } catch (error) {
                console.error('Error fetching order items:', error);
            }
        };

        fetchOrderItems();
    },[])
   
    const renderOrderItem = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{item.price.toLocaleString()}</Text>

            <Text style={styles.tableCell}>{item.amount.toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chi tiết đơn hàng</Text>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>
                    Tổng tiền: {detailOrder?.total?.toLocaleString()} VND
                </Text>
            </View>
            <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.tableCell]}>Tên món</Text>
                <Text style={[styles.tableHeaderCell, styles.tableCell]}>Số lượng</Text>
                <Text style={[styles.tableHeaderCell, styles.tableCell]}>Giá</Text>
                <Text style={[styles.tableHeaderCell, styles.tableCell]}>Thành tiền</Text>
            </View>
            <FlatList
            decelerationRate={"normal"}
                data={detailOrder.orderItems}
                renderItem={renderOrderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        flex: 1
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 2,
        borderBottomColor: "#000",
        paddingVertical: 10,
        marginBottom: 10,
    },
    tableHeaderCell: {
        fontWeight: "bold",
        textAlign: "center",
    },
    tableCell: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    totalContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 5
    },
    totalText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'right',
       

    },
    warningContainer: {
        backgroundColor: "#ffcccb",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    warningText: {
        color: "red",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default OrderDetail;
