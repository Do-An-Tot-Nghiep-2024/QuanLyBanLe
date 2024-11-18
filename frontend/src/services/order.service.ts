import api from "../config/axios";
import ApiResponse from "../types/apiResponse";
import { OrderSchema } from "../types/orderSchema";
import ResponsePagination from "../types/responsePagination";

const createOrderService = async (itemList: any[], customerPayment: number, totalDiscount: number) => {
  try {
    console.log(itemList);


    const response: ApiResponse = await api.post(`/orders`, {
      orderItems: itemList,
      customerPayment: customerPayment,
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

//   const getAllOrdersService = async (page: number, limit: number, sortField: string = 'orderId', // Default to 'orderId'
//     sortOrder: string = 'asc'): Promise<ResponsePagination<OrderSchema>> => {    
//     const response = await api.get(`/orders?pageNumber=${page}&limit=${limit}`);    
//     if (response) { 
//         return response.data; 
//     }

//     return null as unknown as ResponsePagination<OrderSchema>; 
// };


const getAllOrdersService = async (
  page: number,
  limit: number,
  sortField: string = 'orderId',
  sortOrder: string = 'asc',
  fromDate?: string,              // Optional start date for filtering
  toDate?: string,                // Optional end date for filtering
  status?: string,                // Optional status filter
  paymentType?: string,           // Optional payment type filter
  customerPhone?: string          // Optional customer phone search filter
): Promise<ResponsePagination<OrderSchema>> => {
  // Construct query parameters based on the provided arguments
  let queryParams = `?pageNumber=${page}&pageSize=${limit}&orderBy=${sortField}&order=${sortOrder}`;

  // Add optional filters if they exist
  if (fromDate) queryParams += `&fromDate=${fromDate}`;
  if (toDate) queryParams += `&toDate=${toDate}`;
  if (status) queryParams += `&status=${status}`;
  if (paymentType) queryParams += `&paymentType=${paymentType}`;
  if (customerPhone) queryParams += `&customerPhone=${customerPhone}`;

  // Send the request with the constructed query parameters

  const response = await api.get(`/orders${queryParams}`);

  if (response && response.data) {
    return response.data as ResponsePagination<OrderSchema>;
  }

  // Return an empty response if there is no valid response data
  return null as unknown as ResponsePagination<OrderSchema>;

};

const getOrderDetailService = async (orderId: number) => {
  try {
    const response: ApiResponse = await api.get(`/orders/${orderId}`);
    if (response.message !== "success") {
      return {
        message: response.message,
        data: {},
      };
    }
    return response;
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: {},
    } as ApiResponse;
  }
};



export { createOrderService, getAllOrdersService, getOrderDetailService  }