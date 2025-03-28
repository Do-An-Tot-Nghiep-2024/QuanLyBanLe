import { useNavigation } from "expo-router";
import { setItem } from "../AsyncStorage";
import { IpAddress } from "../IpAddressConfig";
import { showToastWithGravityAndOffset } from "../ToastAndroid";



const LoginService = async (username, password, navigation) => {    
    const response = await fetch(`http://${IpAddress.ipAddress}/api/v1/auth/login`, {
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
        await setItem("email", username)
       showToastWithGravityAndOffset("Đăng nhập thành công");
        navigation.navigate('MyTabs');
    } else {
        showToastWithGravityAndOffset("Mật khẩu hoặc email không chính xác");
      
    }

}

const RegisterService = async (name, email, phone, password, navigation) => {
    const response = await fetch(`http://${IpAddress.ipAddress}/api/v1/auth/register`, {
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
       await setItem("email", email) 
       navigation.navigate('MyTabs');

    } else {
        showToastWithGravityAndOffset("Số điện thoại hoặc email đã được sử dụng");
      
    }
}

    const getAccount = async (accessToken) => {
        const response = await fetch(`http://${IpAddress.ipAddress}/api/v1/auth/account`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        console.log(response);
        console.log(data);
        
        
        if (response.status === 200) {
           await setItem("accessToken", accessToken);   
           return true;

        }
        return false;
    }

    const getInformationDetailService = async (accessToken) => {
        const response = await fetch(`http://${IpAddress.ipAddress}/api/v1/customers/detail`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();                
        if (response.status === 200) {
           return data;
        }
        return false;
    }

    const changePasswordService = async (cleanToken, confirmPassword, password, newPassword) => {
        const response = await fetch(`http://${IpAddress.ipAddress}/api/v1/auth/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            },
            body: JSON.stringify({ password, newPassword, confirmPassword }),
        });

        const data = await response.json();
        console.log("RESPONSE" + response);
        console.log(data);
        
        
        if (response.status === 200) {
            return true;
        }
        return false;
    }


export {LoginService, RegisterService, getAccount, getInformationDetailService, changePasswordService}