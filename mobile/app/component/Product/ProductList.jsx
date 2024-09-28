import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableHighlight } from 'react-native';
import products from '@/app/component/data/products';
import { colors } from '@/app/style';

const ProductList = ({ route, navigation }) => {
  const { categoryId } = route.params || {};

  const filteredProducts = categoryId
    ? products.filter(product => product.categoryId === categoryId)
    : [];

  if (filteredProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No products available for this category.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableHighlight
          onPress={() => navigation.navigate('component/Product/DetailProduct', { productId: item.id })}
          underlayColor={"#f0f0f0"}
          style={styles.itemContainer}
        >
          <View style={{
            flex: 1,
            height: 250,
            width: '100%',
          }}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              onError={() => console.log('Image failed to load')} // Debugging line
            />
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>
                {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    height: 250,
    borderWidth: 1,
    borderColor: colors.primaryColor,
    margin: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  details: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
});

export default ProductList;
