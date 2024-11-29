import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text, ScrollView, FlatList, Pressable, TouchableHighlight, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import stylessheet from '@/app/style';
import { colors } from '@/app/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge } from 'react-native-paper';
import { getProductsByIdService } from '@/app/services/product.service';
import { addToCart, getCart } from '@/app/AsyncStorage';
import { showToastWithGravityAndOffset } from '@/app/ToastAndroid';

export default function Product({ route, navigation }) {
    const { productId } = route.params || {};
    const [product, setProduct] = useState({});
    const [cart, setCart] = useState([]);
    const [badge, setBadge] = useState();
    const [loading, setLoading] = useState(true); // Track loading state


    const getCartStore = async () => {
        const cart = await getCart();
        setCart(cart);
        setBadge(cart?.length);
    }
    const getProductsById = async () => {
        setLoading(true);
        try {
            const response = await getProductsByIdService(productId);
            if (response) {
                setProduct(response.data);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false); // Set loading to false once the request is complete
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    style={{ marginRight: 10, flexDirection: 'row' }}
                    onPress={() => {
                        navigation.navigate('component/Cart/Cart');
                    }}
                >
                    <MaterialCommunityIcons name='cart' size={28} color={"white"} />
                    <Badge style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'red',
                    }}>{badge}</Badge>
                </Pressable>
            )
        });
    }, [badge]);

    const handleAddToCart = async () => {
        try {
            addToCart(product);
            showToastWithGravityAndOffset("Thêm vào giỏ hàng thành công");

        } catch (error) {
            showToastWithGravityAndOffset("Có lỗi xảy ra, vui lòng thử lại");
            console.error('Error adding product to cart:', error);
        }
    };

    useEffect(() => {
        getProductsById();
        getCartStore();
    }, []);

    useEffect(() => {
        getCartStore();
    }, [cart]);

    return (
        <View style={styles.mainContainer}>
            {loading ? (
                // Show loading indicator while the data is being fetched
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primaryColor} />
                    <Text style={styles.loadingText}>Đang tải thông tin sản phẩm...</Text>
                </View>
            ) : (
                // Show the product details once data is loaded
                <ScrollView contentContainerStyle={styles.container}>
                    <Image source={{ uri: product.image }} style={styles.image} />
                    <Text style={styles.title}>{product.name}</Text>

                    <View style={styles.detailContainer}>
                        <Text style={styles.subtitle}>Chi tiết sản phẩm</Text>
                        <Text style={styles.label}>Mô tả:</Text>
                        <Text style={styles.description}>{product.description}</Text>

                        <Text style={styles.label}>Đơn vị tính:</Text>
                        <Text style={styles.description}>{product.unit}</Text>

                        <Text style={styles.label}>Giá:</Text>
                        <Text style={styles.price}>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Text>
                    </View>
                </ScrollView>
            )}

            <View style={styles.buttonContainer}>
                <TouchableHighlight underlayColor={"grey"} style={styles.button} onPress={() => {
                    handleAddToCart();
                }}>
                    <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    container: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: colors.primaryColor,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'left',
    },
    detailContainer: {
        paddingHorizontal: 15,
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 5,
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primaryColor,
        marginTop: 5,
    },
    buttonContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    button: {
        backgroundColor: colors.primaryColor,
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
});
