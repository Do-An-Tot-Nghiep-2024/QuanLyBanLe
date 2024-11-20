import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import OrderPage from './OrderPage1';
import OrderOnlineList from './OrderOnlinePage';

const tabs = [
  { label: 'Đơn hàng 1', value: '1', component: <OrderPage /> },
  { label: 'Đơn hàng 2', value: '2', component: <OrderPage /> },
  { label: 'Đơn hàng tự đến lấy', value: '3', component: <OrderOnlineList /> },
];

export default function OrderTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%', typography: 'body1', mt: 2 }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="Order tabs">
            {tabs.map(tab => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </TabList>
        </Box>
        {tabs.map(tab => (
          <TabPanel key={tab.value} value={tab.value}>
            {tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}


