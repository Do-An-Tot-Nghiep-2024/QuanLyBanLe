import { ToastAndroid } from "react-native";

const showToastWithGravityAndOffset = (text) => {

    ToastAndroid.showWithGravityAndOffset(
      text,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      50,
      0
  
    );
    
  };

export {showToastWithGravityAndOffset}