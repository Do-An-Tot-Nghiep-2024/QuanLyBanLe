import api from "../config/axios";
import OrderRequestProp from "../types/order/orderRequestProp";
// import ApiResponse from "../types/common/apiResponse";
import { OrderSchema } from "../types/orderSchema";
import ResponsePagination from "../types/responsePagination";

const createOrderService = async (
  itemList: any[],
  customerPayment: number,
  totalDiscount: number
) => {
  try {
    console.log(itemList);

    const response: any = await api.post(`/orders`, {
      orderItems: itemList,
      customerPayment: customerPayment,
      isLive: true,
      paymentType: "CASH",
      totalDiscount,
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

const getAllOrdersService = async (
  page: number,
  limit: number,
  sortField: string = "orderId",
  sortOrder: string = "asc",
  fromDate?: string,
  toDate?: string,
  status?: string,
  paymentType?: string,
  customerPhone?: string
): Promise<ResponsePagination<OrderSchema>> => {
  let queryParams = `?pageNumber=${page}&pageSize=${limit}&orderBy=${sortField}&order=${sortOrder}`;
  if (fromDate) queryParams += `&fromDate=${fromDate}`;
  if (toDate) {
    const newToDate = new Date(toDate);
    newToDate.setDate(newToDate.getDate() + 1);
    const updatedToDate = newToDate.toISOString().split('T')[0];
    console.log("today is ",updatedToDate);
    queryParams += `&toDate=${updatedToDate}`;
  } if (status) queryParams += `&status=${status}`;
  if (paymentType) queryParams += `&paymentType=${paymentType}`;
  if (customerPhone) queryParams += `&customerPhone=${customerPhone}`;

  // Send the request with the constructed query parameters

  const response = await api.get(`/orders${queryParams}`);
  console.log(response);
  

  if (response && response.data) {
    return response.data as ResponsePagination<OrderSchema>;
  }

  // Return an empty response if there is no valid response data
  return null as unknown as ResponsePagination<OrderSchema>;
};

const getOrderDetailService = async (orderId: number) => {
  try {
    const response: any = await api.get(`/orders/${orderId}`);
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
    } as any;
  }
};

const getOrdersByEmployeeService = async (request: OrderRequestProp) => {
  try {
    let queryParams = "pageNumber=" + request.pageNumber + "&pageSize=" + request.pageSize;
    queryParams += "&status=" + request.status;
    queryParams += "&customerPhone=" + request.customerPhone;
    queryParams += "&fromDate=" + request.fromDate;
    queryParams += "&toDate=" + request.toDate;
    queryParams += "&paymentType=" + request.paymentType;
    const response: any = await api.get(
      `/orders/employee?${queryParams}`
    );
    console.log("response data in service : ", response);

    return {
      message: response.message,
      data: response.message === "success" ? response.data : {},
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: {},
    };
  }
};

const updateOrderStatusService = async (orderId: number, action: 'cancel' | 'status') => {
  try {

    // Sending the request
    const response: any = await api.put(`/orders/${action}/${orderId}`);

    if (response.message !== "success") {
      return {
        message: response.message,
        data: {},
      };
    }

    return response;
  } catch (error: any) {
    return {
      message: error.response?.data?.message || error.message,
      data: {},
    };
  }
};
export {
  createOrderService,
  getAllOrdersService,
  getOrderDetailService,
  getOrdersByEmployeeService,
  updateOrderStatusService
};

// export { createOrderService, getAllOrdersService, getOrderDetailService, updateOrderStatusService  }
