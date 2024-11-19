import { getItem } from "../AsyncStorage";
import { IpAddress } from "../IpAddressConfig";
import { showToastWithGravityAndOffset } from "../ToastAndroid";

const createOrderService = async (order) => {
    const accessToken = await getItem("accessToken")
    
    let cleanedToken = accessToken.replace(/"/g, "");       
    const response = await fetch(`http://${IpAddress.ipAddress}:8080/api/v1/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanedToken}`
        },
        body: JSON.stringify(order),
    });

    const data = await response.json();
    console.log("RESPONSE" + response);
    console.log(data);
    
    
    if (response.status === 201) {
       showToastWithGravityAndOffset("Đặt hàng thành công");
       return;
    } else {
        showToastWithGravityAndOffset("Có lỗi xảy ra, vui lòng thử lại");
      
    }
}

export {createOrderService}