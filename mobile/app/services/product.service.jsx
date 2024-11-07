import { getItem } from "../AsyncStorage";
import { IpAddress } from "../IpAddressConfig";

const getProductsByCategoryService = async (id) =>{
    const accessToken = await getItem("accessToken")

    let cleanedToken = accessToken.replace(/"/g, "");   
    console.log("Token" + cleanedToken);
    
    const response = await fetch(`http://${IpAddress.ipAddress}:8080/api/v1/products/mobile/category/${id}`, {
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

const getProductsByIdService = async (id) =>{
    const accessToken = await getItem("accessToken")

    let cleanedToken = accessToken.replace(/"/g, "");   
    console.log("Token" + cleanedToken);
    
    const response = await fetch(`http://${IpAddress.ipAddress}:8080/api/v1/products/${id}`, {
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

export {getProductsByCategoryService, getProductsByIdService}