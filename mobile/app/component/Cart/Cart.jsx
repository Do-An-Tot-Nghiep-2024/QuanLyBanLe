import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, Pressable, FlatList, StyleSheet, Image, TouchableHighlight, Alert } from "react-native";
import { colors } from '@/app/style';
import { TextInput } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addToCart, getCart, removeFromCart, updatedCart, descreaseQuantity } from "@/app/AsyncStorage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function Cart({ navigation }) {
    const [cartItems, setCartItems] = useState([]); 

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    style={{ marginRight: 10, flexDirection: 'row' }}
                    onPress={() => navigation.navigate('component/Order/OrderList')}
                >
                    <MaterialCommunityIcons name='clipboard-list-outline' size={24} color={"white"} />
                </Pressable>
            )
        });
    }, []);

    // Fetch the cart data from AsyncStorage
    const loadCartItems = async () => {
        const storedCart = await getCart();
        if (storedCart) {
            setCartItems(storedCart); 
        } else {
            setCartItems([]); 
        }
    };
  

  
    const renderItem = ({ item }) => {
        console.log("item", item);
        
        return (
            <View style={styles.itemContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.detailsContainer}>
                    <Pressable style={styles.details} onPress={() => navigation.navigate('component/Product/DetailProduct', { productId: item.id })}>
                        <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
                        <Text style={styles.price}>
                        {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}

                        </Text>
                    </Pressable>
                    <View style={styles.quantityContainer}>
                        <Pressable onPress={() => handleDescreaseQuantity(item.id)}>
                            <MaterialCommunityIcons name='minus' size={20} color={"gray"} />
                        </Pressable>
                        <TextInput
                            textAlign="center"
                            style={styles.textInput}
                            keyboardType="numeric"
                            value={item.quantity.toString()}
                        />
                        <Pressable onPress={() => handleAddToCart(item)}>
                            <MaterialCommunityIcons name='plus' size={20} color={"gray"} />
                        </Pressable>
                    </View>
                </View>
                <Pressable onPress={() => handleRemoveFromCart(item.id)}>
                    <MaterialCommunityIcons name='close-circle' size={20} color={"red"} style={styles.icon} />
                </Pressable>
            </View>
        );
    };

    // const handleRemoveFromCart = async (productId) => {
    //     try {
    //         await removeFromCart(productId);
    //         loadCartItems();
    //     } catch (error) {
    //         console.log("error", error);
            
            
    //     }
    // }
    const handleRemoveFromCart = async (productId) => {
        // Confirmation Alert before removing item
        Alert.alert(
            "Xác nhận xóa sản phẩm",
            "Bạn có chắc chắn muốn xóa sản phẩm này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                    
                },
                {
                    text: "Xác nhận",
                    style: "default",
                    onPress: async () => {
                        try {
                            await removeFromCart(productId);  // Remove from AsyncStorage
                            loadCartItems();  // Reload cart data
                        } catch (error) {
                            console.log("error", error);
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    };

    const handleAddToCart = async (product) => {        
        try {
            await addToCart(product);
            loadCartItems();
        } catch (error) {
            console.log("error", error);
            
        }

    }
    
    const handleDescreaseQuantity = async (productId) => {
        try {
            await descreaseQuantity(productId);
            loadCartItems();
        } catch (error) {
            console.log("error", error);
            
            
        }
    }


    useEffect(() => {
        loadCartItems(); 
    }, []);

 
    return (
        <View style={styles.container}>
            {cartItems.length > 0 ? (
                <FlatList
                    data={cartItems} 
                    keyExtractor={item => item?.id?.toString()}
                    renderItem={renderItem}
                />
            ) : (
                <Text style={styles.noCartText}>Chưa có sản phẩm nào</Text>
            )}
            <TouchableHighlight underlayColor={"grey"} style={styles.checkoutButton} onPress={() => { navigation.navigate('component/Cart/DetailPayment') }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                }}>
                    <MaterialCommunityIcons name='cash' size={26} color={"white"} />
                    <Text style={styles.checkoutText}>Thanh toán</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    itemContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.primaryColor,
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
    },
    image: {
        width: '30%',
        height: 100,
        marginRight: 10,
        borderRadius: 5,
    },
    detailsContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 1
        
    },
    details: {
        flex: 1,
        gap: 10
        
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        
    },
    price: {
        fontSize: 14,
        color: 'green',
    },
    icon: {
        flex: 1,
        marginHorizontal: 0,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 5,
        gap: 5,
    },
    textInput: {
        padding: 0,
        textAlign: 'left',
        width: 40,
        height: 30,
        backgroundColor: 'white',
        textAlignVertical: 'center',
        
    },
    checkoutButton: {
        backgroundColor: colors.accentColor,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    checkoutText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    noCartText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
