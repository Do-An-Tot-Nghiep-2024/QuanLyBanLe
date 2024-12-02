import { getItem } from "../AsyncStorage";
import { IpAddress } from "../IpAddressConfig";

const getLatestPromotionService = async () => {
    const accessToken = await getItem("accessToken")

    let cleanedToken = accessToken.replace(/"/g, "");   
    console.log("Token" + cleanedToken);
    
    const response = await fetch(`http://${IpAddress.ipAddress}/api/v1/promotions/latest`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanedToken}`
        }
    });

    const data = await response.json();
    console.log("service", data);
    return data;
}
export {getLatestPromotionService}