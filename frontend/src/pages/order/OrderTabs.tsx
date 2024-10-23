import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import OrderPage from './OrderPage';

export default function OrderTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx= {{ width: '100%', typography: 'body1' }
}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Đơn hàng 1" value="1" />
            <Tab label="Đơn hàng 2" value="2" />
            <Tab label="Đơn hàng tự đến lấy" value="3" />
          </TabList>
        </Box>
  < TabPanel value = "1" >
    <OrderPage/>
    </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </Box>
  );
}
