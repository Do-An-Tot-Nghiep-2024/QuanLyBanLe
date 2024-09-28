import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import promotion from '../data/promotion';
import productList from '../data/products';
import CountdownDate from './CountdownDate';
export default function Promotion({ route }) {
  const { promotionId } = route.params || {};
  console.log(promotionId);


  const filteredPromotion = promotionId
    ? promotion.filter(p => p.id === promotionId)
    : [];
  const promotionData = filteredPromotion[0];
  const productIds = promotionData.products;

  const products = productIds.map(id => productList.find(p => p.id === id));
  const { title, description, startDate, endDate, image } = promotionData;

  const renderItem = ({ item }) => (
    <View style={{
      flexDirection: 'column',
      borderWidth: 1,
      height: 200,
      margin: 5,
      width: 150,
    }}>
      <Text style={styles.price}>{item.name}</Text>
      <Text style={styles.price}>{item.description}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <View style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
      }}>
        <Text style={styles.description}>Thông tin chi tiết về chương trình khuyến mãi</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>Start Date: {startDate}</Text>
        <Text style={styles.date}>End Date: {endDate}</Text>
        <CountdownDate endDate={endDate} />
      </View>

      <View style={{
        marginTop: 10,
      }}>
        <Text style={styles.subtitle}>Các sản phẩm áp dụng</Text>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          horizontal={true}
          showsHorizontalScrollIndicator={false}

        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: 200,
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
});

