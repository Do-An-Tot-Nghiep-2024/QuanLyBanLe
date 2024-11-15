import api from "../config/axios";

const getCustomersService = async (page: number, limit: number) => {
  try {
    const response: any = await api.get(`/customers?pageNumber=${page}&pageSize=${limit}`);
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
      message: error.response.data.message,
      data: [],
    };
  }
};

export default getCustomersService;
