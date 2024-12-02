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

  const addToCart = async (product) => {
    const email = await getItem("email");
    
    if (!email) {
      console.error('No email found for the user.');
      return;
    }
  
    let cleanedEmail = email.replace(/"/g, "");
    
    try {
      const cart = JSON.parse(await AsyncStorage.getItem(cleanedEmail)) || [];
      const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
      if (existingProductIndex >= 0) {        
        cart[existingProductIndex].quantity += 1; 
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      await AsyncStorage.setItem(cleanedEmail, JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };
  
  const updatedCart = async (product, quantity) => {
    const email = await getItem("email");
    
    if (!email) {
      console.error('No email found for the user.');
      return;
    }
  
    let cleanedEmail = email.replace(/"/g, "");
    
    try {
      const cart = JSON.parse(await AsyncStorage.getItem(cleanedEmail)) || [];
      const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
      if (existingProductIndex >= 0) {        
        cart[existingProductIndex].quantity = quantity; 
      } else {
        cart.push({ ...product, quantity: quantity });
      }
      
      await AsyncStorage.setItem(cleanedEmail, JSON.stringify(cart));
    } catch (error) {
      console.error('Error updating product quantity in cart:', error);
    }
  };
  
  const getCart = async () => {
    const email = await getItem("email");
    
    if (!email) {
      console.error('No email found for the user.');
      return [];
    }
  
    let cleanedEmail = email.replace(/"/g, "");
    
    try {
      const cart = JSON.parse(await AsyncStorage.getItem(cleanedEmail)) || [];
      return cart;
    } catch (error) {
      console.error('Error retrieving cart:', error);
      return [];
    }
  };
  
  const removeFromCart = async (productId) => {
    const email = await getItem("email");
    
    if (!email) {
      console.error('No email found for the user.');
      return;
    }
  
    let cleanedEmail = email.replace(/"/g, "");
    
    try {
      const cart = JSON.parse(await AsyncStorage.getItem(cleanedEmail)) || [];
      const updatedCart = cart.filter(item => item.id !== productId);
  
      await AsyncStorage.setItem(cleanedEmail, JSON.stringify(updatedCart));
      console.log('Product removed from cart:', productId);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };
  
  const descreaseQuantity = async (productId) => {
    const email = await getItem("email");
    
    if (!email) {
      console.error('No email found for the user.');
      return;
    }
  
    let cleanedEmail = email.replace(/"/g, "");
    
    try {
      const cart = JSON.parse(await AsyncStorage.getItem(cleanedEmail)) || [];
      const existingProductIndex = cart.findIndex(item => item.id === productId);
  
      if (existingProductIndex >= 0) {        
        cart[existingProductIndex].quantity -= 1; 
        
        if (cart[existingProductIndex].quantity <= 0) {
          cart.splice(existingProductIndex, 1);
        }
      }
  
      await AsyncStorage.setItem(cleanedEmail, JSON.stringify(cart));
    } catch (error) {
      console.error('Error decreasing product quantity in cart:', error);
    }
  };
  
  const removeCart = async () => {
    const email = await getItem("email");
    
    if (!email) {
      console.error('No email found for the user.');
      return;
    }
  
    let cleanedEmail = email.replace(/"/g, "");
    
    try {
      await AsyncStorage.setItem(cleanedEmail, JSON.stringify([]));
    } catch (error) {
      console.error('Error removing cart:', error);
    }
  };
  

  export {getItem, removeItem, setItem, addToCart, getCart, removeFromCart, updatedCart, descreaseQuantity, removeCart}