import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/app/style';
import { Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCart } from '@/app/AsyncStorage';  // Assuming getCart is a function you have to fetch the cart data
import { getInformationDetailService } from '@/app/services/auth.service';
import { createOrderService } from '@/app/services/order.service';
import { getLatestPromotionService } from '@/app/services/promotion.service';

const PaymentDetail = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [promotion, setPromotion] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [originalName, setOriginalName] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');


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
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        const cleanedToken = accessToken.replace(/"/g, "");
        const customerInfo = await getInformationDetailService(cleanedToken);
        setName(customerInfo.data.name);
        setPhone(customerInfo.data.phone);
        setOriginalName(customerInfo.data.name);
        setOriginalPhone(customerInfo.data.phone);
      }
    } catch (error) {
      console.error('Error fetching customer info:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load promotion details
  useEffect(() => {
    loadCartItems();
    loadCustomerInfo();

    const loadPromotion = async () => {
      try {
        const response = await getLatestPromotionService();
        if (response && response.data) {
          setPromotion(response.data);
        }
      } catch (error) {
        console.error('Error fetching promotion:', error);
      }
    };

    loadPromotion();
  }, []);

  // Calculate total price and discount once
  const { totalPrice, totalDiscount } = useMemo(() => {
    let initialTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;

    if (promotion && initialTotal >= promotion.minOrderValue) {
      discount = initialTotal * (promotion.percentage / 100);
      initialTotal -= discount;
    }

    return { totalPrice: initialTotal, totalDiscount: discount };
  }, [cartItems, promotion]);

  const createOrderObject = () => {
    const orderItems = cartItems.map(item => ({
      productId: item.id,
      shipmentId: item.shipmentIds[0],
      quantity: item.quantity
    }));

    const order = {
      orderItems: orderItems,
      customerPhone: phone,
      customerPayment: totalPrice,
      isLive: false,
      paymentType: 'CASH',
      totalDiscount: totalDiscount
    };

    console.log(order);
    
    return order;
  };

  const handleCreateOrder = async () => {
    const order = createOrderObject();
    console.log("ORDERS: " + JSON.stringify(order));
    const response = await createOrderService(order);
    console.log("RESPONSE PAGE: " + response);
    
    if (response.status === 201) {
      navigation.navigate('OrderList');
    }
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };


  const handleSave = async () => {
    console.log('Updated customer info:', { name, phone });
    setOriginalName(name);
    setOriginalPhone(phone);
    setIsEditing(false);
  };

  
  const handleCancel = () => {
    setIsEditing(false);
    setName(originalName);
    setPhone(originalPhone);
  };

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
                          <View style={{ flexDirection: 'row', marginTop: 10, width: '100%' }}>
                          <Pressable style={styles.button} onPress={() => handleSave()}>
                              <Text style={styles.buttonText}>Lưu</Text>
                          </Pressable>
                          <Pressable style={styles.button} onPress={() => handleCancel()}>
                              <Text style={styles.buttonText}>Hủy</Text>
                          </Pressable>

                          </View>
                        
                      </>
                  ) : (
                      <View style={styles.infoContainer}>
                          <View>
                              <Text style={{ fontSize: 16}}>Họ và tên: {name}</Text>
                              <Text style={{fontSize: 16}}>Số điện thoại: {phone}</Text>
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
      <Text style={[styles.header, {marginTop: 10, padding: 10}]}>Thông tin đơn hàng</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>
              {`${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} x ${item.quantity}`}
            </Text>
          </View>
        )}
      />

      <View style={styles.paymentContainer}>
        <Text style={styles.paymentHeader}>Phương thức nhận hàng:</Text>
        <Text style={styles.paymentText}>Vui lòng nhận hàng trước: 20h ngày {new Date().toLocaleDateString()}</Text>
        <Text>Địa chỉ: 12 Nguyễn Văn Bảo, phường 4, quận Gò Vấp, TP. HCM</Text>
      </View>

      <View style={styles.totalContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.totalText}>Tổng tiền hàng: </Text>
          <Text style={styles.totalPrice}>
            {(totalPrice + totalDiscount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </Text>
        </View>

        {totalDiscount > 0 && (
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.totalText}>Giảm giá: </Text>
            <Text style={styles.totalPrice}>
              - {totalDiscount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.totalText}>Thành tiền: </Text>
          <Text style={styles.totalPrice}>
            {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </Text>
        </View>

        {promotion && (
          <View style={styles.promotionDetails}>
            <Text style={styles.promotionText}>Chi tiết khuyến mãi:</Text>
            <Text style={styles.promotionText}>
              {`- Giảm ${promotion.percentage}% cho đơn hàng từ ${promotion.minOrderValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}
            </Text>
          </View>
        )}

        <Pressable onPress={handleCreateOrder} disabled={loading} style={[styles.button, loading && styles.buttonDisabled]}>
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
    fontSize: 16,
},
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primaryColor,
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    width: '100%'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginLeft: 10,
  },
  divider: {
    backgroundColor: 'lightgray',
    height: 3,
    width: '100%',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  header2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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
  },
  paymentContainer: {
    padding: 10,
    gap: 10,
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
  promotionDetails: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  promotionText: {
    fontSize: 14,
    color: '#333',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
});

export default PaymentDetail;
