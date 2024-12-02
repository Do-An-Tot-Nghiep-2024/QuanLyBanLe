import { getItem } from "../AsyncStorage";
import { IpAddress } from "../IpAddressConfig";

const getAllCategoryService = async () =>{
    const accessToken = await getItem("accessToken")

    let cleanedToken = accessToken.replace(/"/g, "");       
    const response = await fetch(`http://${IpAddress.ipAddress}/api/v1/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanedToken}`
        }
    });

    const data = await response.json();
    return data  
}

export {getAllCategoryService}