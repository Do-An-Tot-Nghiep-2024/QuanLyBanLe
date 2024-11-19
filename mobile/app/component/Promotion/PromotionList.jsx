import React, { useRef, useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    Animated,
    Easing,
    Pressable
} from 'react-native';
import { colors } from '@/app/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getLatestPromotionService } from '@/app/services/promotion.service';

export default function PromotionList({ navigation }) {
    const fireIconScale = useRef(new Animated.Value(1)).current;
    const fireIconRotate = useRef(new Animated.Value(0)).current;
    const [latestPromotion, setLatestPromotion] = useState(null);

    const getLatestPromotion = async () => {
        try {
            const response = await getLatestPromotionService();
            setLatestPromotion(response.data);
        } catch (error) {
            console.error("Error fetching latest promotion:", error);
            setLatestPromotion(null); // in case of error, set to null
        }
    };

    useEffect(() => {
        const animateFire = () => {
            Animated.parallel([
                Animated.timing(fireIconScale, {
                    toValue: 1.2,
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(fireIconRotate, {
                    toValue: 360,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                fireIconScale.setValue(1);
                fireIconRotate.setValue(0);
                animateFire();
            });
        };

        animateFire();
        getLatestPromotion();
    }, []);

    const fireIconStyle = {
        transform: [
            { scale: fireIconScale },
            {
                rotate: fireIconRotate.interpolate({
                    inputRange: [0, 0],
                    outputRange: ['0deg', '360deg'],
                })
            },
        ],
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Adds leading zero if day is less than 10
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month and add leading zero if necessary
        const year = date.getFullYear(); // Get the full year
    
        return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
    };
    
    const formattedEndDate = latestPromotion
        ? formatDate(latestPromotion.endDate)
        : '';
    

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Animated.View style={[styles.fireIcon, fireIconStyle]}>
                    <MaterialCommunityIcons name="fire" size={24} color="red" />
                </Animated.View>
                <Text style={styles.header}>Chương trình khuyến mãi đang diễn ra!!!</Text>
                <Animated.View style={[styles.fireIcon, fireIconStyle]}>
                    <MaterialCommunityIcons name="fire" size={24} color="red" />
                </Animated.View>
            </View>

            {latestPromotion ? (
                <View style={styles.detailsContainer}>
                    <View style={styles.detailCard}>
                        <Text style={styles.detailTitle}>Giá trị đơn hàng tối thiểu</Text>
                        <Text style={styles.value}>
                            {`${latestPromotion.minOrderValue.toLocaleString()}₫`}
                        </Text>
                    </View>

                    <View style={styles.detailCard}>
                        <Text style={styles.detailTitle}>Tỉ lệ giảm giá</Text>
                        <Text style={styles.value}>{latestPromotion.percentage}% Giảm</Text>
                    </View>

                    <View style={styles.detailCard}>
                        <Text style={styles.detailTitle}>Giới hạn đơn hàng</Text>
                        <Text style={styles.value}>
                            {latestPromotion.orderLimit} đơn hàng
                        </Text>
                    </View>

                    <View style={styles.detailCard}>
                        <Text style={styles.detailTitle}>Khuyến mãi kết thúc</Text>
                        <Text style={styles.value}>{formattedEndDate}</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.noPromotionText}>Chưa có chương trình khuyến mãi nào</Text>
            )}

            {/* Call-to-action Button */}
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 10,
        paddingHorizontal: 30,
        backgroundColor: '#f8f8f8',
  
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d72d9',
        marginHorizontal: 10,
        textAlign: 'center',
    },
    fireIcon: {
        marginHorizontal: 5,
    },
    detailsContainer: {
        marginTop: 20,
        border: 1,
        // // backgroundColor: 'white',
        // borderRadius: 10,
        // padding: 10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3, 
    },
    detailCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // for Android shadow
    },
    detailTitle: {
        fontSize: 18,
        color: '#444',
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d72d9',
        marginTop: 5,
    },
    noPromotionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    ctaContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    ctaButton: {
        backgroundColor: '#2d72d9',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        elevation: 2, // for Android shadow
    },
    ctaText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});
