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
import { colors } from '@/app/style';
import categories from '@/app/component/data/category';
import { Shadow } from 'react-native-shadow-2';
export default function Category({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>DANH MỤC SẢN PHẨM</Text>
            </View>
            <FlatList
                decelerationRate={1}
                data={categories}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableHighlight
                        underlayColor={colors.primaryColor}
                        style={styles.itemContainer}
                        onPress={() =>
                            navigation.navigate('component/Product/ProductList', { categoryId: item.id })
                        }
                    >
                        {/* <Shadow style={styles.shadowStyle}> */}
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={styles.imageDarkOverlay} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.name}</Text>
                            </View>
                        </View>
                        {/* </Shadow> */}
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
    },
    header: {
        color: colors.primaryColor,
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 5,
        fontStyle: 'italic',
        fontWeight: 'bold',
        marginTop: 5,
    },
    fireIcon: {
        marginHorizontal: 5,
    },
});