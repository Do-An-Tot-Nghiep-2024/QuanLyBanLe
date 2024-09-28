import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styles, { colors } from './style';
import Product from './component/Product/ProductList';
import Promotion from './component/Promotion/PromotionList';
import Category from './component/Product/Category';
import Cart from './component/Cart/Cart';
import { Text } from 'react-native';
const Tab = createBottomTabNavigator();
const { MaterialCommunityIcons } = require('@expo/vector-icons');


export default function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: colors.primaryColor, // Set your header color here
      },
      headerTintColor: '#fff', // Set the color of the header text
      headerTitleStyle: {
        fontWeight: 'bold', // Optional: set the header title style
      },
      title: 'LaLa shop',
    }
    }>
      <Tab.Screen name="promotion" component={Promotion} options={{
        headerTitle: 'LaLa Shop',
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontWeight: 'bold', fontSize: 13, color: focused ? colors.primaryColor : 'gray' }}>
            Khuyến mãi
          </Text>
        ),
        tabBarIcon: ({ }) => <MaterialCommunityIcons name="package" size={24} color={colors.primaryColor} />
      }} />
      <Tab.Screen name="category" component={Category} options={{
        headerTitle: 'LaLa shop',
        title: 'Danh mục',
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontWeight: 'bold', fontSize: 13, color: focused ? colors.primaryColor : 'gray' }}>
            Danh mục
          </Text>
        ),
        tabBarIcon: ({ }) => <MaterialCommunityIcons name="view-grid" size={24} color={colors.primaryColor} />,
      }} />

      <Tab.Screen name="cart" component={Cart} options={{
        headerTitle: 'LaLa shop',
        title: 'Giỏ hàng',
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontWeight: 'bold', fontSize: 13, color: focused ? colors.primaryColor : 'gray' }}>
            Giỏ hàng
          </Text>
        ),
        tabBarIcon: ({ }) => <MaterialCommunityIcons name="cart" size={24} color={colors.primaryColor} />,
      }} />

    </Tab.Navigator>
  );
}