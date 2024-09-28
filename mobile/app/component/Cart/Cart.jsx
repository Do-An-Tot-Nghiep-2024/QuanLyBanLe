import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { View, Text, Pressable, FlatList, StyleSheet, Image, TouchableHighlight } from "react-native";
import products from '@/app/component/data/products';
import { colors } from '@/app/style';
import { TextInput } from "react-native-paper";

export default function Cart({ navigation }) {

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


    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.detailsContainer}>
                    <Pressable style={styles.details} onPress={() => navigation.navigate('component/Product/DetailProduct', { productId: item.id })}>
                        <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
                        <Text numberOfLines={2}>{item.description}</Text>
                        <Text style={styles.price}>
                            {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Text>
                    </Pressable>
                    <View style={styles.quantityContainer}>
                        <Pressable>
                            <MaterialCommunityIcons name='minus' size={20} color={"gray"} />
                        </Pressable>
                        <TextInput
                            style={styles.textInput}
                            keyboardType="numeric"
                            value="1"
                        />
                        <Pressable>
                            <MaterialCommunityIcons name='plus' size={20} color={"gray"} />
                        </Pressable>
                    </View>
                </View>
                <Pressable>
                    <MaterialCommunityIcons name='close-circle' size={20} color={"red"} style={styles.icon} />
                </Pressable>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                decelerationRate={1}
                data={products}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
            />
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
    },
    details: {
        flex: 1,
        marginBottom: 5,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    price: {
        fontSize: 12,
        color: 'green',
    },
    icon: {
        flex: 1,
        marginHorizontal: 0,

    },
    icon2: {
        marginBottom: 5
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 5,
        gap: 5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        padding: 0,
        textAlign: 'left',
        width: 40,
        height: 30,
        backgroundColor: 'white',

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
});
