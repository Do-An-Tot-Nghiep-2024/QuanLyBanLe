
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './authentication/Login';
import Register from './authentication/Register';
import { Tabs, useNavigation } from 'expo-router';
import React from 'react';
import MyTabs from './MyTabs';
import { colors } from './style';
import ProductList from './component/Product/ProductList';
import Product from './component/Product/DetailProduct';
import Promotion from './component/Promotion/DetailPromotion';
import Cart from './component/Cart/Cart';
import { Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DetailPayment from './component/Cart/DetailPayment';
import OrderList from './component/Order/OrderList';
import DetailOrder from './component/Order/DetailOrder';
import { removeItem } from './AsyncStorage';

const Stack = createNativeStackNavigator();


export default function App() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName='authentication/Login' screenOptions={{
      headerStyle: {
        backgroundColor: colors.primaryColor, 
      },
      headerTintColor: '#fff', 
      headerTitleStyle: {
        fontWeight: 'bold', 
      },
      title: 'Retail Shop',
    }

    }>
        <Stack.Screen name="authentication/Login" component={Login} options={{
          headerShown: false
        }} />
        <Stack.Screen name="authentication/Register" component={Register} options={{
          headerShown: false
        }} />
        <Stack.Screen name="MyTabs" component={MyTabs} options={{
          headerShown: false
        }} />
        <Stack.Screen name='component/Product/ProductList' component={ProductList} options={{
          title: 'Danh sách sản phẩm',
        }} />
        <Stack.Screen name='component/Promotion/DetailPromotion' component={Promotion} options={{
          title: 'Chi tiết khuyến mãi',

        }} />
        <Stack.Screen
          name='component/Product/DetailProduct'
          component={Product}
          options={{
            title: 'Chi tiết sản phẩm',
          }}
        />

        <Stack.Screen name='component/Cart/Cart' component={Cart} options={{
          title: 'Giỏ hàng',
        }} />
        <Stack.Screen name='component/Cart/DetailPayment' component={DetailPayment} options={{
          title: "Chi tiết đơn hàng"
        }} />
        <Stack.Screen name='component/Order/OrderList' component={OrderList} options={{
          title: '',
          headerLeft: (props) => (
            <Pressable
              style={{
                flexDirection: 'row',
                gap: 25
              }}
              onPress={() => {
                navigation.navigate('cart');
              }}
            >
              <MaterialCommunityIcons name='arrow-left' size={26} color={"white"} />
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Danh sách đơn hàng</Text>
            </Pressable>

          )

        }}
        />
        <Stack.Screen name='component/Order/DetailOrder' component={DetailOrder} options={{
          title: 'Chi tiết đơn hàng',

        }} />
    </Stack.Navigator>
   
  );

 
}



