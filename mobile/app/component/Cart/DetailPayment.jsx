import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/app/style';
import { Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCart } from '@/app/AsyncStorage';  // Assuming getCart is a function you have to fetch the cart data
import { getAccount, getInformationDetailService } from '@/app/services/auth.service';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const PaymentDetail = ({ navigation, route }) => {
  const [cartItems, setCartItems] = useState([]); 
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const loadCartItems = async () => {
    const storedCart = await getCart(); 
    if (storedCart) {
      setCartItems(storedCart);
    } else {
      setCartItems([]);
    }
  };

  const loadCustomerInfo = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken'); // Retrieve the accessToken from AsyncStorage
      if (accessToken) {
        const cleanedToken = accessToken.replace(/"/g, "");
        const customerInfo = await getInformationDetailService(cleanedToken);
        console.log("customer infor", customerInfo);
        
        setName(customerInfo.name); // Set name from the fetched data
        setPhone(customerInfo.phone); // Set phone from the fetched data
      }
    } catch (error) {
      console.error('Error fetching customer info:', error);
    } finally {
      setLoading(false); // Hide loading spinner after data is fetched
    }
  };
      const [isEditing, setIsEditing] = useState(false);
    
      const paymentMethods = ['Tự đến lấy'];
      const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);
      const currentDate = new Date();
      const pickupDate = new Date(currentDate);
  
      pickupDate.setHours(currentDate.getHours() + 24);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      const formattedPickupDate = pickupDate.toLocaleString('vi-VN', options);
      const fixedQuantity = 1;
  
      const totalPrice = cartItems.reduce((sum, product) => {
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
  
      useEffect(() => {
        loadCartItems();
      }, []);

      const createOrderObject = () => {
        const orderItems = cartItems.map(item => ({
          productId: item.id,
          shipmentId: item.shipmentId,
          quantity: item.quantity
        }));
      
        const order = {
          orderItems: orderItems,
          customerPhone: customerPhone,
          customerPayment: totalPrice,
          isLive: false,
          paymentType: 'CASH'
        };
      
        return order;
      };
      
      let totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const customerPhone = phone;
      
      const order = createOrderObject(cartItems, customerPhone, totalPrice);
      
      console.log(order);
      

      const handleCreateOrder = async () => {
        const order = {
          customerId: 1,
          items: cartItems,
          pickupDate: formattedPickupDate,
          status: "Hoàn tất",
          paymentMethod: selectedPaymentMethod,
          totalPrice: totalPrice,
        };
        await createOrderService(order);
        navigation.navigate('component/Order/OrderList');
    }
  
      return (
          <View style={styles.container}>
              <View style={styles.userInfo}>
                  <Text style={styles.header}>Thông tin khách hàng</Text>
                  {isEditing ? (
                      <>
                          <TextInput
                              style={styles.input}
                              value={name}
                              onChangeText={setName}
                          />
                          <TextInput
                              style={styles.input}
                              value={phone}
                              onChangeText={setPhone}
                              keyboardType="phone-pad"
                          />
                          <Pressable style={styles.button} onPress={() => setIsEditing(!isEditing)}>
                              <Text style={styles.buttonText}>Lưu</Text>
                          </Pressable>
                      </>
                  ) : (
                      <View style={styles.infoContainer}>
                          <View>
                              <Text>Họ và tên: {name}</Text>
                              <Text>Số điện thoại: {phone}</Text>
                          </View>
                          <Pressable onPress={() => setIsEditing(!isEditing)}>
                              <MaterialCommunityIcons
                                  name={isEditing ? 'check' : 'pencil'}
                                  size={20}
                                  color={colors.primaryColor}
                                  style={styles.icon}
                              />
                          </Pressable>
                      </View>
                  )}
              </View>
              <Divider style={styles.divider} />
              <Text style={styles.header2}>Thông tin đơn hàng</Text>

              <FlatList
                  decelerationRate={1}
                  data={showAll ? cartItems : cartItems.slice(0, 5)}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItem}
                  contentContainerStyle={styles.listContainer}
                  ListFooterComponent={
                      <Pressable disabled={isEditing} onPress={() => setShowAll(!showAll)} style={styles.seeMoreButton}>
                          <Text style={[styles.seeMoreText, isEditing && styles.hyperlinkDisabled]}>
                              {showAll ? 'Thu gọn' : 'Xem thêm '}
                          </Text>
                      </Pressable>
                  }
              />
              <View style={styles.paymentContainer}>
                  <View style={{ flexDirection: 'row', gap: 5 }}>
                      <MaterialCommunityIcons name='google-maps' size={22} color={colors.accentColor} />
                      <Text style={styles.paymentHeader}>Phương thức nhận hàng:</Text>
  
                  </View>
                  <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                      <Text>Vui lòng nhận hàng trước:</Text>
                      <Text style={styles.paymentText}> 20h ngày {formattedPickupDate}</Text>
  
                  </View>
                  <Text style={{ marginLeft: 5 }}>Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM</Text>
              </View>
  
              <View style={styles.totalContainer}>
                  <View style={{
                      flexDirection: 'row',
                  }}>
                      <Text style={styles.totalText}>Tổng tiền: </Text>
                      <Text style={styles.totalPrice}>
                          {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </Text>
  
                  </View>
  
                  <Pressable underlayColor={"grey"} onPress={() => handleCreateOrder()} disabled={isEditing} style={[styles.button, isEditing && styles.buttonDisabled]}>
                      <Text style={styles.buttonText}>Đặt hàng</Text>
                  </Pressable>
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
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
          height: 50
  
      },
      buttonDisabled: {
          backgroundColor: 'gray',
      },
      hyperlinkDisabled: {
          color: 'gray',
      },
      header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      header2: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
      },
      buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white'
      },
  });
  
  export default PaymentDetail;