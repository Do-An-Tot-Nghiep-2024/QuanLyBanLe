import { useNavigation } from "expo-router";
import { setItem } from "../AsyncStorage";
import { IpAddress } from "../IpAddressConfig";
import { showToastWithGravityAndOffset } from "../ToastAndroid";



const LoginService = async (username, password, navigation) => {    
    const response = await fetch(`http://${IpAddress.ipAddress}:8080/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    });

    const data = await response.json();
    
    if (response.status === 200) {
        const accessToken = data.data.accessToken;
           
        await setItem("accessToken", accessToken);
       showToastWithGravityAndOffset("Đăng nhập thành công");
        navigation.navigate('MyTabs');
    } else {
        showToastWithGravityAndOffset("Mật khẩu hoặc email không chính xác");
      
    }

}

const RegisterService = async (name, email, phone, password, navigation) => {
    const response = await fetch(`http://${IpAddress.ipAddress}:8080/api/v1/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await response.json();
    console.log(response);
    console.log(data);
    
    
    if (response.status === 200) {
       showToastWithGravityAndOffset("Đăng ký thành công");
       const accessToken = data.data.accessToken;
       await setItem("accessToken", accessToken);   
       navigation.navigate('MyTabs');

    } else {
        showToastWithGravityAndOffset("Số điện thoại hoặc email đã được sử dụng");
      
    }


}
export {LoginService, RegisterService}