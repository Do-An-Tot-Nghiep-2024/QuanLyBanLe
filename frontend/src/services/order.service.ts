import api from "../config/axios";
import ApiResponse from "../types/apiResponse";
import { OrderSchema } from "../types/orderSchema";
import ResponsePagination from "../types/responsePagination";

const createOrderService = async (itemList: any[], customerPayment : number, totalDiscount: number) => {
    try {
      console.log(itemList);

  
      const response: ApiResponse = await api.post(`/orders`, {
        orderItems: itemList,
        customerPayment : customerPayment,
        isLive: true,
        paymentType: "CASH",
        totalDiscount

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

  const getAllOrdersService = async (page: number, limit: number): Promise<ResponsePagination<OrderSchema>> => {    
    const response = await api.get(`/orders?pageNumber=${page}&limit=${limit}`);
    
    if (response) { 
        return response.data; 
    }

    return null as unknown as ResponsePagination<OrderSchema>; 
};



  export { createOrderService, getAllOrdersService}