import api from "../config/axios";
import ApiResponse from "../types/apiResponse";

const createOrderPromotion = async (promotionData : any) => {
    try {
        console.log(promotionData);
  
    
        const response: ApiResponse = await api.post(`/promotions/create-order-promotion`, {
          promotionRequest: promotionData.promotionRequest,
          minOrderValue : promotionData.minOrderValue,
          discountPercent: promotionData.discountPercent
        });
    
        const { message, data } = response;
        if (message !== "success") {
          return {
            message: message,
            data: {},
          };
        }
    
        return {
          message: message,
          data: data,
        };
      } catch (error: any) {
        return {
          message: error.response?.data?.message || "An error occurred",
          data: {},
        };
      }
}

export {createOrderPromotion}