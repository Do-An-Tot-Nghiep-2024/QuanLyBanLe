import api from "../config/axios";
import { ProductSchema } from "../types/productSchema";
import ApiResponse from "../types/apiResponse";

const getProductsService = async () => { 
    try {
      const response: ApiResponse = await api.get("/products");
      const { message, data } = response;
  
      if (message !== "success") {
        return {
          message: message,
          data: [],
        };
      }
  
      return {
        message: message,
        data: data,
      };
    } catch (error: any) {
      return {
        message: error.response?.data?.message || "An error occurred",
        data: [],
      };
    }
}

const getProductByIdService = async (id: number) => { 
    try {
      const response: ApiResponse = await api.get(`/products/${id}`);
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

export { getProductByIdService, getProductsService };