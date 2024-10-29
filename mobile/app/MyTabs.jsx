import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styles, { colors } from './style';
import Product from './component/Product/ProductList';
import Promotion from './component/Promotion/PromotionList';
import Category from './component/Product/Category';
import Cart from './component/Cart/Cart';
import { Pressable, Text } from 'react-native';
import { removeItem } from './AsyncStorage';
import { useNavigation } from 'expo-router';
const Tab = createBottomTabNavigator();
const { MaterialCommunityIcons } = require('@expo/vector-icons');

const logout = async (navigation) => {
  await removeItem('accessToken');
  navigation.navigate('authentication/Login');
}
export default function MyTabs() {
  const navigation = useNavigation();
  return (
    <Tab.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: colors.primaryColor, 
      },
      headerTintColor: '#fff', 
      headerTitleStyle: {
        fontWeight: 'bold', 
      },
      title: 'Retail Shop',
      headerRight: () => (
        <Pressable
          onPress={() => {
            logout(navigation)
          }}
        >
          <MaterialCommunityIcons name='logout-variant'style={{
            marginRight: 10
          }} color={"white"} size={25} />
        </Pressable>
      ),
    }
    }>
      <Tab.Screen name="promotion" component={Promotion} options={{
        headerTitle: 'Retail Shop',
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontWeight: 'bold', fontSize: 13, color: focused ? colors.primaryColor : 'gray' }}>
            Khuyến mãi
          </Text>
        ),
        tabBarIcon: ({ }) => <MaterialCommunityIcons name="package" size={24} color={colors.primaryColor} />
      }} />
      <Tab.Screen name="category" component={Category} options={{
        headerTitle: 'Retail Shop',
        title: 'Danh mục',
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontWeight: 'bold', fontSize: 13, color: focused ? colors.primaryColor : 'gray' }}>
            Danh mục
          </Text>
        ),
        tabBarIcon: ({ }) => <MaterialCommunityIcons name="view-grid" size={24} color={colors.primaryColor} />,
      }} />

      <Tab.Screen name="cart" component={Cart} options={{
        headerTitle: 'Retail Shop',
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