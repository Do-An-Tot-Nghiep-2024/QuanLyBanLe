import React, { useRef, useEffect } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    Animated,
    Easing
} from 'react-native';
import promotion from '@/app/component/data/promotion';
import { colors } from '@/app/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PromotionList({ navigation }) {
    const fireIconScale = useRef(new Animated.Value(1)).current;
    const fireIconRotate = useRef(new Animated.Value(0)).current;

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
            <FlatList
                decelerationRate={1}
                data={promotion}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableHighlight
                        underlayColor={colors.primaryColor}
                        style={styles.itemContainer}
                        onPress={() =>
                            navigation.navigate('component/Promotion/DetailPromotion', { promotionId: item.id })
                        }
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={styles.imageDarkOverlay} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                                <Text style={styles.hyperlink}>Xem thêm</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        margin: 5,
        borderWidth: 1,
        height: 150,
        borderRadius: 20,
        borderColor: colors.primaryColor,
        marginTop: 20
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        borderRadius: 20,
    },
    imageDarkOverlay: {
        borderRadius: 20,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    textContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    title: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 5,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    description: {
        color: '#fff',
        textAlign: 'center',
    },
    hyperlink: {
        color: colors.accentColor,
        textAlign: 'center',
        marginTop: 20,
        textDecorationLine: 'underline',
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'white',
        padding: 5,
    },
    header: {
        color: colors.primaryColor,
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 5,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    fireIcon: {
        marginHorizontal: 5,
    },
});