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
        console.log("JSON" + response.json);
        
       showToastWithGravityAndOffset("Đặt hàng thành công");
       return true;
    } else {
        showToastWithGravityAndOffset("Có lỗi xảy ra, vui lòng thử lại");
        return false;
    }
}

const getAllOrdersService = async () => {
    const accessToken = await getItem("accessToken")
    
    let cleanedToken = accessToken.replace(/"/g, "");       
    const response = await fetch(`http://${IpAddress.ipAddress}:8080/api/v1/orders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanedToken}`
        },
    });

    const data = await response.json();
    if (response.status === 200) {
       return data?.responseList;
    }
    else {
        return null;
    }
}

export {createOrderService, getAllOrdersService}