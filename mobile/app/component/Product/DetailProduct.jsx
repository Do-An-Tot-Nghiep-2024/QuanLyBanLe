import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text, ScrollView, FlatList, Pressable, TouchableHighlight } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import productList from '../data/products';
import stylessheet from '@/app/style';
import { colors } from '@/app/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge } from 'react-native-paper';
export default function Product({ route, navigation }) {
    const { productId } = route.params || {};
    console.log(productId);


    const filteredProducts = productId
        ? productList.filter(p => p.id === productId)
        : [];
    const product = filteredProducts[0];


    const { name, description, price, image } = product;
    const [badge, setBadge] = useState(2);

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
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 10,
        }}>
            <View style={styles.container}>
                <Image source={{ uri: image }} style={styles.image} />
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.subtitle}>Chi tiết sản phẩm</Text>
                <Text style={styles.description}>Mô tả chi tiết sản phẩm</Text>
                <Text style={styles.description}>{description}</Text>
                <Text style={styles.price}>{price}</Text>
            </View>

            <View>
                <TouchableHighlight underlayColor={"grey"} style={styles.button} onPress={() => {
                    setBadge(badge + 1);
                }}>
                    <Text style={styles.subtitle}>Thêm vào giỏ hàng</Text>
                </TouchableHighlight>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: 5,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',

    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    date: {
        fontSize: 14,
        marginBottom: 5,
    },
    button: {
        backgroundColor: colors.primaryColor,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    }
});

