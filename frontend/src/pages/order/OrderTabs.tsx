import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import OrderPage from './OrderPage1'; // Make sure to import the correct component
import { GetProductSchema } from '../../types/getProductSchema';

interface OrderTab {
  label: string;
  value: string;
}
interface OrderItem {
  product: GetProductSchema;
  quantity: number;
  price: number;
  selectedShipment?: string;
}
const orderTabs: OrderTab[] = [
  { label: 'Đơn hàng 1', value: '1' },
  { label: 'Đơn hàng 2', value: '2' },
  { label: 'Đơn hàng 3', value: '3' },
];

export default function OrderTabs() {
  const [value, setValue] = useState<string>('1');
  
  // State to store orderItems for each tab
  const [orders, setOrders] = useState<{ [key: string]: OrderItem[] }>({
    '1': [], // Default empty state for order 1
    '2': [], // Default empty state for order 2
    '3': [], // Default empty state for order 3
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Update orderItems for a specific tab
  const updateOrderItems = (orderId: string, newOrderItems: OrderItem[]) => {
    console.log(newOrderItems);
    
    setOrders(prevOrders => ({
      ...prevOrders,
      [orderId]: newOrderItems,
    }));
  };

  const tabs: JSX.Element[] = [];
  const tabPanels: JSX.Element[] = [];

  for (let i = 0; i < orderTabs.length; i++) {
    const tab = orderTabs[i];

    tabs.push(
      <Tab key={tab.value} label={tab.label} value={tab.value} />
    );

    tabPanels.push(
      <TabPanel key={tab.value} value={tab.value}>
        <OrderPage 
          orderId={tab.value} 
          orderItems={orders[tab.value]} // Pass the orderItems for this specific tab
          updateOrderItems={updateOrderItems} // Pass the function to update orderItems
        />
      </TabPanel>
    );
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="Order tabs">
            {tabs}
          </TabList>
        </Box>
        {tabPanels}
      </TabContext>
    </Box>
  );
}
