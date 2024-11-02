import api from "../config/axios";
import ApiResponse from "../types/apiResponse";

const createOrderService = async (itemList: any[], customerPayment : number) => {
    try {
      console.log(itemList);

  
      const response: ApiResponse = await api.post(`/orders/live`, {
        orderItems: itemList,
        customerPayment : customerPayment
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
  };
  export 
  { createOrderService}