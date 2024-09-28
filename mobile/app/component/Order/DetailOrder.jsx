import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import products from '@/app/component/data/products';
import orders from '../data/orders';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/app/style';
import stylesheet from '@/app/style';
import { Divider, RadioButton } from 'react-native-paper';

const DetailOrder = ({ navigation, route }) => {

    const orderId = route.params?.orderId;

    const OrderList = orderId ? orders.filter(p => p.id === orderId) : [];
    const order = OrderList[0];

    const [name, setName] = useState('Nguyễn Văn A');
    const [phone, setPhone] = useState('0987654321');
    const [showAll, setShowAll] = useState(false);
    const paymentMethods = ['Tự đến lấy'];
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);
    const currentDate = new Date();
    const pickupDate = new Date(order.pickupDate);

    // Add 24 hours to the current date for pickup time
    pickupDate.setHours(currentDate.getHours() + 24);

    // Format dates for display
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedPickupDate = pickupDate.toLocaleString('vi-VN', options);
    // Quantity is fixed for display purposes
    const fixedQuantity = 1;

    const totalPrice = order.items.reduce((sum, product) => {
        return sum + (product.price * fixedQuantity); // Total price calculation
    }, 0);

    const renderItem = ({ item }) => {
        const totalProductPrice = item.price * fixedQuantity; // Calculate total price for this product
        return (
            <View style={styles.productItem}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                    {`${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} x ${fixedQuantity}`}
                </Text>
            </View>
        );
    };




    return (
        <View style={styles.container}>
            <View style={styles.userInfo}>
                <Text style={stylesheet.h3}>Thông tin khách hàng</Text>

                <View style={styles.infoContainer}>
                    <View>
                        <Text>Họ và tên: {name}</Text>
                        <Text>Số điện thoại: {phone}</Text>
                    </View>
                </View>

            </View>
            <Divider style={styles.divider} />

            <FlatList
                decelerationRate={1}
                data={showAll ? order.items : order.items.slice(0, 5)}
                keyExtractor={(item) => item.productId.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={
                    order.items.length > 5 && (
                        <Pressable onPress={() => setShowAll(!showAll)} style={styles.seeMoreButton}>
                            <Text style={styles.seeMoreText}>
                                {showAll ? 'Thu gọn' : 'Xem thêm '}
                            </Text>
                        </Pressable>
                    )
                }
            />

            <View style={styles.paymentContainer}>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <MaterialCommunityIcons name='google-maps' size={22} color={colors.accentColor} />
                    <Text style={styles.paymentHeader}>Phương thức nhận hàng:</Text>

                </View>
                <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                    <Text>Ngày nhận hàng:</Text>
                    <Text style={styles.paymentText}> {formattedPickupDate}</Text>

                </View>
                <Text style={{ marginLeft: 5 }}>Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginLeft: 5
                }}>
                    <Text>Tình trạng đơn hàng: {order.status}</Text>
                    {order.status === "Hoàn tất" && (
                        <MaterialCommunityIcons name="check-circle" size={20} color="green" style={styles.completeIcon} />
                    )}
                </View>
            </View>

            <View style={styles.totalContainer}>
                <View style={{
                    flexDirection: 'row',
                    marginBottom: 50
                }}>
                    <Text style={styles.totalText}>Tổng tiền: </Text>
                    <Text style={styles.totalPrice}>
                        {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Text>

                </View>


            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    userInfo: {
        padding: 10,
        backgroundColor: '#fff',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        padding: 8,
        marginVertical: 5,
        fontSize: 15,
    },
    listContainer: {
        paddingBottom: 20,
        padding: 10
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    productName: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    productPrice: {
        fontSize: 16,
        color: 'green',
    },
    quantityText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    totalContainer: {
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopColor: '#ccc',
        alignItems: 'flex-end',
        padding: 10,

    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalPrice: {
        fontSize: 18,
        color: 'green',
        fontWeight: 'bold',
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 10,
    },
    divider: {
        backgroundColor: 'lightgray',
        height: 3,
        width: '100%',
    },
    seeMoreButton: {
        marginVertical: 10,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    seeMoreText: {
        color: 'black',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textDecorationLine: 'underline',

    },
    paymentContainer: {
        padding: 10,
        gap: 10
    },
    paymentHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.accentColor,
    },
    paymentText: {
        fontSize: 14,
        fontWeight: 'bold',

    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    radioButton: {
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.primaryColor, /* Default button background color */
        color: '#fff', /* Button text color */
        padding: 5,
        paddingHorizontal: 5,
        borderRadius: 15,
        borderWidth: 0,
        transition: 'background-color 0.3s', /* Add a smooth transition effect */
        cursor: 'pointer',
        width: '100%',
        height: 50,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20

    },
    buttonDisabled: {
        backgroundColor: 'gray',
    },
    hyperlinkDisabled: {
        color: 'gray',
    }
});

export default DetailOrder;
