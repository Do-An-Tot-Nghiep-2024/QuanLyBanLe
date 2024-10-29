import AsyncStorage from '@react-native-async-storage/async-storage';

const setItem = async (key, value) => {
    try {
        console.log("value", value);
        
      await AsyncStorage.setItem(key, JSON.stringify(value)); 
    } catch (error) {
      console.error('Error setting item:', error);
    }
  };

  const getItem = async (key) => {
    try {
        const access_token = await AsyncStorage.getItem(key);
        if (access_token !== null) {
            return access_token;
        }
    } catch (e) {
        console.log(e);
    }
  };

  const removeItem = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  export {getItem, removeItem, setItem}